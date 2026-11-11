import gsap from 'gsap';
import type { NameContext, NameMotion } from './hero-name';
import { groupByBaseline, percentReadout } from './name-motion';

/**
 * Variant "a" timing (s / px). Draws reuse the section choreography of `reveal.ts` (rules draw in
 * 0.7s power2.out, corner ticks pop in 0.35s power3.out with a 0.06s stagger) and the letters rise
 * with the reveal ease (power3.out).
 */
export const SPECIMEN = {
  guideDraw: 0.7,
  guideStagger: 0.05,
  riseAt: 0.18,
  rise: 0.9,
  riseStagger: 0.022,
  markAt: 0.45,
  markPop: 0.35,
  markStagger: 0.06,
  labelsAt: 0.7,
  /** Needle: one glide across the name, then a rest at the end before it glides back. */
  sweep: 7,
  rest: 1.6,
  /** Guides overshoot the name on the left; marks sit this far outside its box, the needle spans past it. */
  overshoot: 28,
  markGap: 16,
  needleReach: 14,
} as const;

interface Line {
  baseline: number;
  left: number;
  right: number;
}

interface Geometry {
  lines: Line[];
  cap: number;
  box: { left: number; top: number; right: number; bottom: number };
  width: number;
  /** Distance from a cell's bottom up to the baseline (the rise mask), px. */
  baseClip: number;
}

/** Guides drawn on every line, top to bottom; the first line's are labelled. */
const GUIDES = [
  { kind: 'cap', label: 'CAP' },
  { kind: 'base', label: 'BASE' },
] as const;

/** Cap height of the heading face at its current size (canvas ink metrics; Archivo is 0.683em). */
function capHeight(h1: HTMLElement): number {
  const style = getComputedStyle(h1);
  const fallback = parseFloat(style.fontSize) * 0.683;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return fallback;
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  return ctx.measureText('H').actualBoundingBoxAscent || fallback;
}

function measure({ h1, chars }: NameContext): Geometry {
  const origin = h1.getBoundingClientRect();
  const cells = chars.map((char) => char.getBoundingClientRect());
  // The baseline inside a cell: an empty inline-block sits on it.
  const probe = document.createElement('span');
  probe.style.cssText = 'display:inline-block;width:0;height:0';
  chars[0].append(probe);
  const offset = probe.getBoundingClientRect().top - cells[0].top;
  probe.remove();

  const baselines = cells.map((cell) => cell.top + offset - origin.top);
  const lines = groupByBaseline(baselines, 2).map((indices) => ({
    baseline: baselines[indices[0]],
    left: Math.min(...indices.map((i) => cells[i].left)) - origin.left,
    right: Math.max(...indices.map((i) => cells[i].right)) - origin.left,
  }));
  const cap = capHeight(h1);
  const box = {
    left: Math.min(...lines.map((line) => line.left)),
    top: lines[0].baseline - cap,
    right: Math.max(...lines.map((line) => line.right)),
    bottom: lines[lines.length - 1].baseline,
  };
  return { lines, cap, box, width: origin.width, baseClip: cells[0].height - offset };
}

const el = (className: string, parent: HTMLElement, text?: string) => {
  const node = document.createElement('span');
  node.className = className;
  if (text) node.dataset.text = text;
  parent.append(node);
  return node;
};

/**
 * Variant "a", specimen. The name is set like a type specimen: cap-height and baseline guides draw
 * across every line like the section rules, "+" registration marks pop at the corners
 * of its box, and the letters rise out of their baseline. Then a thin accent needle glides across
 * the name and back (the skill-meter needle, with a rail-style percent readout), lighting the
 * guides as it passes while they breathe faintly. The letters themselves never change.
 */
export function createSpecimen(ctx: NameContext): NameMotion {
  const { h1, glyphs } = ctx;
  let geo = measure(ctx);

  // Overlay (behind the letters). Decorative text lives in pseudo-elements, so copying the name never includes it.
  const root = document.createElement('span');
  root.className = 'spec';
  root.setAttribute('aria-hidden', 'true');
  const guideLayer = el('spec__guides', root);
  const marks = Array.from({ length: 4 }, () => el('spec__mark tick', root));
  const needle = el('spec__needle', root);
  const readout = el('spec__readout', needle, percentReadout(0));
  h1.prepend(root);

  let guides: HTMLElement[] = [];
  let labels: HTMLElement[] = [];
  /** Right end of the guides and width of the readout, px (the readout stays between the marks and that end). */
  let guideEnd = 0;
  let readoutWidth = 0;

  const layout = () => {
    const { lines, cap, box, width } = geo;
    const left = box.left - SPECIMEN.overshoot;
    const right = Math.max(box.right + SPECIMEN.overshoot, width - 48);
    guideEnd = right;
    readoutWidth = readout.offsetWidth;
    root.style.setProperty('--gl', `${left}px`);
    root.style.setProperty('--gw', `${right - left}px`);
    const wanted = lines.length * GUIDES.length;
    if (guides.length !== wanted) {
      guideLayer.replaceChildren();
      guides = [];
      labels = [];
      lines.forEach((_, li) =>
        GUIDES.forEach(({ kind, label }) => {
          const guide = el('spec__guide', guideLayer);
          guide.dataset.kind = kind;
          guides.push(guide);
          if (li === 0) labels.push(el('spec__label', guideLayer, label));
        }),
      );
    }
    lines.forEach((line, li) =>
      GUIDES.forEach(({ kind }, gi) => {
        const y = kind === 'cap' ? line.baseline - cap : line.baseline;
        guides[li * GUIDES.length + gi].style.top = `${Math.round(y)}px`;
        if (li === 0) {
          const label = labels[gi];
          label.style.left = `${right + 8}px`;
          label.style.top = `${Math.round(y) + 0.5}px`;
        }
      }),
    );
    const [l, r] = [box.left - SPECIMEN.markGap, box.right + SPECIMEN.markGap];
    const corners = [
      [l, box.top],
      [r, box.top],
      [l, box.bottom],
      [r, box.bottom],
    ];
    marks.forEach((mark, i) => {
      mark.style.left = `${Math.round(corners[i][0])}px`;
      mark.style.top = `${Math.round(corners[i][1])}px`;
    });
    root.style.setProperty('--ny', `${Math.round(box.top - SPECIMEN.needleReach)}px`);
    root.style.setProperty('--nh', `${Math.round(box.bottom - box.top + SPECIMEN.needleReach * 2)}px`);
    h1.style.setProperty('--base-clip', `${geo.baseClip}px`);
  };
  layout();

  // ---- Needle ----
  const sweep = { p: 0 };
  let shown = '';
  const setX = gsap.quickSetter(needle, 'x', 'px');
  const setReadoutX = gsap.quickSetter(readout, 'x', 'px');
  const place = () => {
    const from = geo.box.left - SPECIMEN.markGap;
    const x = from + (geo.box.right + SPECIMEN.markGap - from) * sweep.p;
    setX(x);
    // Centred over the needle, but never past the left mark or the end of the guides.
    const start = Math.min(Math.max(x - readoutWidth / 2, from - 5), guideEnd - readoutWidth);
    setReadoutX(start - x);
    root.style.setProperty('--nx', `${x.toFixed(1)}px`);
    const text = percentReadout(sweep.p);
    if (text !== shown) readout.dataset.text = shown = text;
  };
  place();

  // ---- Entrance ----
  gsap.set(guides, { scaleX: 0 });
  gsap.set(marks, { scale: 0, opacity: 0 });
  gsap.set(labels, { opacity: 0 });
  gsap.set(needle, { opacity: 0 });
  gsap.set(glyphs, { yPercent: 100 });
  root.style.setProperty('--glow', '0');

  const riseEnd = SPECIMEN.riseAt + SPECIMEN.rise + SPECIMEN.riseStagger * (glyphs.length - 1);
  const entrance = gsap.timeline({ paused: true });
  entrance.to(guides, { scaleX: 1, duration: SPECIMEN.guideDraw, ease: 'power2.out', stagger: SPECIMEN.guideStagger }, 0);
  entrance.to(
    glyphs,
    { yPercent: 0, duration: SPECIMEN.rise, ease: 'power3.out', stagger: SPECIMEN.riseStagger, clearProps: 'transform' },
    SPECIMEN.riseAt,
  );
  entrance.to(
    marks,
    { scale: 1, opacity: 1, duration: SPECIMEN.markPop, ease: 'power3.out', stagger: SPECIMEN.markStagger },
    SPECIMEN.markAt,
  );
  entrance.to(labels, { opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.06 }, SPECIMEN.labelsAt);
  // Descenders drop through the mask once the letters have landed.
  entrance.to(h1, { '--base-clip': `${-0.6 * parseFloat(getComputedStyle(h1).fontSize)}px`, duration: 0.4, ease: 'power2.out' }, riseEnd - 0.35);
  entrance.fromTo(needle, { scaleY: 0 }, { scaleY: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, riseEnd - 0.4);
  entrance.to(root, { '--glow': 1, duration: 0.6, ease: 'power2.out' }, riseEnd - 0.3);

  // ---- Constant life: the needle glides across and back, resting at each end ----
  const life = gsap.timeline({ paused: true, repeat: -1 });
  life.to({}, { duration: SPECIMEN.rest / 2 });
  life.to(sweep, { p: 1, duration: SPECIMEN.sweep, ease: 'sine.inOut', onUpdate: place });
  life.to({}, { duration: SPECIMEN.rest });
  life.to(sweep, { p: 0, duration: SPECIMEN.sweep, ease: 'sine.inOut', onUpdate: place });
  life.to({}, { duration: SPECIMEN.rest / 2 });

  const ro = new ResizeObserver(() => {
    geo = measure(ctx);
    layout();
    place();
  });
  ro.observe(h1);

  return {
    entrance,
    setRunning: (run) => (run ? life.resume() : life.pause()),
    relayout: () => {
      geo = measure(ctx);
      layout();
      place();
    },
    dispose: () => {
      ro.disconnect();
      entrance.kill();
      life.kill();
      gsap.set(glyphs, { clearProps: 'transform' });
      h1.style.removeProperty('--base-clip');
      root.remove();
    },
  };
}
