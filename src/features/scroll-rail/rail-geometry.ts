/**
 * Pure geometry of the scroll rail: scroll → ruler mapping, per-section word states and the
 * letter poses they blend between. No DOM access, so it is deterministic and reusable.
 */
import { NAV_H, clamp01 } from '../../shared/lib/motion';
import { RAIL_LAYOUT, RAIL_LOOK, RAIL_MOTION } from './rail-config';

/** Glyph advances of a label, in em (measured once at 100px). */
export interface Metrics {
  readonly adv: readonly number[];
  readonly cum: readonly number[];
  readonly total: number;
}

export interface Pose {
  x: number;
  y: number;
  rot: number;
  scale: number;
  alpha: number;
}

export interface RailSection {
  readonly id: string;
  readonly label: string;
  /** Document y of the section top. */
  readonly anchor: number;
  /** Document y of the section bottom. */
  readonly bottom: number;
}

export interface ScrollFlip {
  readonly start: number;
  readonly end: number;
}

export interface SectionState {
  /** Screen y of the section's own tick (top of the riding word). */
  v: number;
  /** Length of the vertical riding word, in px. */
  rideLen: number;
  /** 0 → riding, 1 → landed in the top stack. */
  flipP: number;
  /** 0 → queued at the bottom, 1 → standing on the rail. */
  detachP: number;
  /** Queue slot centre y. */
  yq: number;
  /** Scroll range used instead of the flip line by short final sections. */
  scrollFlip: ScrollFlip | null;
}

export interface RulerMap {
  /** First usable y under the nav (NAV_H + edgePad). */
  readonly base: number;
  /** Usable height of the mapping. */
  readonly span: number;
  /** Small offset spread over the page so 0% sits at `base` and 100% at `vh - edgePad`. */
  drift(p: number): number;
}

export function rulerMap(vh: number, edgePad: number = RAIL_LAYOUT.edgePad): RulerMap {
  const base = NAV_H + edgePad;
  return {
    base,
    span: Math.max(1, vh - NAV_H - 2 * edgePad),
    drift: (p) => base - p * (NAV_H + 2 * edgePad),
  };
}

const D = RAIL_LAYOUT.headingPx;
export const RIDE_SCALE = RAIL_LAYOUT.ridingPx / D;
export const QUEUE_SCALE = RAIL_LAYOUT.queuePx / D;

/** Horizontal pose: right-aligned text ending `railW` from the right edge, centred on `y`. */
export function horizPose(m: Metrics, j: number, y: number, scale: number, alpha: number, vw: number): Pose {
  const s = (m.cum[j] + m.adv[j] / 2) * D * scale;
  const inset = RAIL_LAYOUT.railW + RAIL_LAYOUT.textPad + (m.total * D * scale - s);
  return { x: vw - inset, y, rot: 0, scale, alpha };
}

/** Vertical pose: rotated -90° on the rail centre, reading bottom → top, its top at `top`. */
export function vertPose(m: Metrics, j: number, top: number, vw: number): Pose {
  return {
    x: vw - RAIL_LAYOUT.railW / 2,
    y: top + (m.total - m.cum[j] - m.adv[j] / 2) * D * RIDE_SCALE,
    rot: -90,
    scale: RIDE_SCALE,
    alpha: RAIL_LOOK.queueAlpha,
  };
}

export interface FrameInput {
  readonly y: number;
  readonly vh: number;
  readonly maxScroll: number;
  readonly drift: number;
}

/**
 * Flip / detach progress for every section. Section 0 is always the current heading; the bottom
 * queue is filled from the last section upward and slots slide down as words leave it.
 */
export function computeSectionStates(
  sections: readonly RailSection[],
  metrics: ReadonlyArray<Metrics>,
  { y, vh, maxScroll, drift }: FrameInput,
): SectionState[] {
  const flipLine = (RAIL_LAYOUT.thresholdPct / 100) * vh;
  const queueBase = vh - RAIL_LAYOUT.queuePad;

  const states = sections.map((section, i): SectionState => {
    const rideLen = metrics[i].total * D * RIDE_SCALE;
    const v = section.anchor - y + drift;
    if (i === 0) return { v, rideLen, flipP: 1, detachP: 1, yq: queueBase, scrollFlip: null };

    let flipP = clamp01((flipLine + RAIL_MOTION.flipZone - v) / RAIL_MOTION.flipZone);
    let scrollFlip: ScrollFlip | null = null;
    // Short final sections can never reach the flip line: play their flip over the page end.
    if (section.anchor - maxScroll > flipLine) {
      const start = Math.min(section.bottom - vh, maxScroll - 24);
      const len = Math.max(24, maxScroll - start);
      flipP = Math.max(flipP, clamp01((y - start) / len));
      scrollFlip = { start, end: maxScroll };
    }
    return { v, rideLen, flipP, detachP: 0, yq: queueBase, scrollFlip };
  });

  for (let i = states.length - 1, slot = 0; i >= 1; i--) {
    const st = states[i];
    st.yq = queueBase - RAIL_LAYOUT.queueSlot * slot;
    st.detachP = clamp01((st.yq + RAIL_MOTION.detachZone - (st.v + st.rideLen)) / RAIL_MOTION.detachZone);
    slot += 1 - st.detachP;
  }
  return states;
}

export type PoseFn = (j: number) => Pose;

export interface WordTransition {
  readonly from: PoseFn;
  readonly to: PoseFn;
  /** Drive progress of the transition. */
  readonly t: number;
  /** Reversed letter order: the last letter leaves first. */
  readonly reversed: boolean;
}

/**
 * How far the top pile has scrolled: once more than `pileMax` compact words would sit above the
 * current heading, every slot moves up (continuously, following the flip in progress).
 */
export function pileOffset(stackCount: number, inFlight: number): number {
  return Math.max(0, stackCount - 1 + inFlight - RAIL_LAYOUT.pileMax);
}

/**
 * Which transition a word is in: flipping (rail → top stack), current/pile (demoted linearly by
 * the next word's flip), detaching (queue → rail, in place) or riding the rail with its section.
 * Pile entries pushed above the visible window (slot < 0) slide under the nav and fade out.
 */
export function wordTransition(
  index: number,
  st: SectionState,
  m: Metrics,
  stackCount: number,
  inFlight: number,
  vw: number,
): WordTransition {
  const A = NAV_H + RAIL_LAYOUT.topPad;
  const { queueSlot: slot, currentGap: gap } = RAIL_LAYOUT;
  const qa = RAIL_LOOK.queueAlpha;
  const position = index - pileOffset(stackCount, inFlight);

  if (st.flipP > 0) {
    const from: PoseFn = (j) => vertPose(m, j, st.v, vw);
    if (st.flipP >= 1) {
      const k = index === stackCount - 1 ? inFlight : 1;
      const y = A + position * slot + gap * (1 - k);
      const scale = 1 - (1 - QUEUE_SCALE) * k;
      const alpha = (1 - (1 - qa) * k) * clamp01(1 + position);
      return { from, to: (j) => horizPose(m, j, y, scale, alpha, vw), t: st.flipP, reversed: true };
    }
    return { from, to: (j) => horizPose(m, j, A + position * slot + gap, 1, 1, vw), t: st.flipP, reversed: true };
  }
  if (st.detachP < 1) {
    const top = st.yq - st.rideLen;
    return {
      from: (j) => horizPose(m, j, st.yq, QUEUE_SCALE, qa, vw),
      to: (j) => vertPose(m, j, top, vw),
      t: st.detachP,
      reversed: true,
    };
  }
  const ride: PoseFn = (j) => vertPose(m, j, st.v, vw);
  return { from: ride, to: ride, t: 1, reversed: false };
}

/** Per-letter local progress: letters start `stagger` apart and each spans 1/O of the move. */
export function letterProgress(t: number, order: number, count: number): number {
  const O = 1 + (count - 1) * RAIL_MOTION.stagger;
  return clamp01(t * O - order * RAIL_MOTION.stagger);
}

/** Quadratic Bézier flight that bows `arc` px toward the page (left of a right-hand rail). */
export function blendPose(a: Pose, b: Pose, d: number, out: Pose): Pose {
  const cx = (a.x + b.x) / 2 - RAIL_MOTION.arc;
  const cy = (a.y + b.y) / 2;
  const u = 1 - d;
  out.x = u * u * a.x + 2 * u * d * cx + d * d * b.x;
  out.y = u * u * a.y + 2 * u * d * cy + d * d * b.y;
  out.rot = a.rot + (b.rot - a.rot) * d;
  out.scale = a.scale + (b.scale - a.scale) * d;
  out.alpha = a.alpha + (b.alpha - a.alpha) * d;
  return out;
}

/** Scroll positions at which a section's flip reaches 0.96 (`yFlip`) and 0.04 (`yUnflip`). */
function flipBounds(anchor: number, st: SectionState, drift: number, flipLine: number) {
  const yFlip = anchor + drift - flipLine - 0.04 * RAIL_MOTION.flipZone;
  const yUnflip = anchor + drift - flipLine - 0.96 * RAIL_MOTION.flipZone;
  if (!st.scrollFlip) return { yFlip, yUnflip };
  const len = st.scrollFlip.end - st.scrollFlip.start;
  return {
    yFlip: Math.min(yFlip, st.scrollFlip.start + 0.96 * len),
    yUnflip: Math.min(yUnflip, st.scrollFlip.start + 0.04 * len),
  };
}

/**
 * Auto-snap target for a half-done flip: the nearer end of that flip, clamped so no other
 * section is pushed into a half-flipped state.
 */
export function snapTarget(
  index: number,
  sections: readonly RailSection[],
  states: readonly SectionState[],
  { vh, maxScroll, drift }: Pick<FrameInput, 'vh' | 'maxScroll' | 'drift'>,
): number {
  const flipLine = (RAIL_LAYOUT.thresholdPct / 100) * vh;
  const st = states[index];
  const forward = st.flipP >= 0.5;
  let target: number;
  if (st.scrollFlip) {
    target = forward ? st.scrollFlip.end + 4 : st.scrollFlip.start - 4;
  } else {
    const offset = forward ? flipLine - 4 : flipLine + RAIL_MOTION.flipZone + 4;
    target = sections[index].anchor + drift - offset;
  }

  let clamped = target;
  for (let i = 0; i < states.length; i++) {
    if (i === index) continue;
    const bounds = flipBounds(sections[i].anchor, states[i], drift, flipLine);
    if (states[i].flipP >= 0.96) clamped = Math.max(clamped, bounds.yFlip + 2);
    else if (states[i].flipP <= 0.04) clamped = Math.min(clamped, bounds.yUnflip - 2);
  }
  const own = flipBounds(sections[index].anchor, st, drift, flipLine);
  const ok = forward ? clamped >= own.yFlip : clamped <= own.yUnflip;
  return Math.max(0, Math.min(maxScroll, ok ? clamped : target));
}
