import gsap from 'gsap';
import type Lenis from 'lenis';
import { noop, type Dispose } from '../../shared/lib/dispose';
import { NAV_H, clamp01, easeInOutCubic, easeOutExpo } from '../../shared/lib/motion';
import { INTRO, type IntroClock } from '../intro/intro';
import { RAIL_LAYOUT, RAIL_LOOK, RAIL_MOTION, RAIL_TIMING } from './rail-config';
import {
  QUEUE_SCALE,
  blendPose,
  computeSectionStates,
  horizPose,
  letterProgress,
  rulerMap,
  snapTarget,
  wordTransition,
  type Metrics,
  type Pose,
  type RailSection,
} from './rail-geometry';

type Mode = 'full' | 'static' | null;

export interface ScrollRailOptions {
  readonly lenis: Lenis | null;
  readonly intro: IntroClock;
}

/**
 * Mounts the scroll rail with the reference gating, on desktop only (≥1024px, fine pointer with
 * hover, non-mobile UA): `full` = the whole instrument; `static` (reduced motion) = ticks, labels,
 * needle and readout stay, the letter flight is swapped for a static list of section links.
 * Nothing is rendered on touch / small screens.
 */
export function initScrollRail(options: ScrollRailOptions): Dispose {
  const html = document.documentElement;
  if (!document.querySelector('[data-rail]')) return noop;

  const mobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  const fine = matchMedia('(pointer: fine) and (hover: hover) and (min-width: 1024px)');
  const motion = matchMedia('(prefers-reduced-motion: no-preference)');
  let mode: Mode = null;
  let unmount: Dispose = noop;

  const apply = () => {
    const next: Mode = !mobileUA && fine.matches ? (motion.matches ? 'full' : 'static') : null;
    if (next === mode) return;
    unmount();
    unmount = noop;
    mode = next;
    if (next) html.dataset.ruler = next === 'full' ? 'on' : 'static';
    else delete html.dataset.ruler;
    if (next) unmount = mountRail(next, options);
  };

  apply();
  fine.addEventListener('change', apply);
  motion.addEventListener('change', apply);

  return () => {
    fine.removeEventListener('change', apply);
    motion.removeEventListener('change', apply);
    unmount();
    delete html.dataset.ruler;
  };
}

interface Tick {
  readonly pct: number;
  readonly alpha: number;
  readonly row: HTMLElement;
  readonly line: HTMLElement;
  readonly label: HTMLElement | null;
  docY: number;
  lineCss: string;
  rowCss: string;
  labelOpacity: number;
}

interface Word {
  readonly id: string;
  /** Sections covered by the word; the first is its anchor, the last closes its span. */
  readonly members: readonly HTMLElement[];
  readonly label: string;
  readonly hit: HTMLAnchorElement;
  readonly letters: HTMLElement[];
}

interface RideSpan {
  top: number;
  bottom: number;
  k: number;
}

function required<T extends Element>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Scroll rail: missing ${selector}`);
  return node;
}

/** Measures every label's glyph advances at 100px with the display cut (kerning ignored). */
function measureMetrics(labels: readonly string[]): Metrics[] {
  const probe = document.createElement('div');
  probe.className = 'font-display';
  probe.style.cssText =
    'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:pre;font-size:100px;line-height:1;';
  document.body.appendChild(probe);
  const result = labels.map((label) => {
    probe.textContent = '';
    const spans = label.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      probe.appendChild(span);
      return span;
    });
    const adv = spans.map((span) => span.getBoundingClientRect().width / 100);
    const cum: number[] = [];
    let total = 0;
    for (const a of adv) {
      cum.push(total);
      total += a;
    }
    return { adv, cum, total };
  });
  probe.remove();
  return result;
}

function mountRail(mode: 'full' | 'static', { lenis, intro }: ScrollRailOptions): Dispose {
  const html = document.documentElement;
  const full = mode === 'full';
  const rail = required<HTMLElement>('[data-rail]');
  const strip = required<HTMLElement>('[data-rail-strip]');
  const needle = required<HTMLElement>('[data-rail-needle]');
  const readout = required<HTMLElement>('[data-rail-readout]');
  const bracket = required<HTMLElement>('[data-rail-bracket]');
  const ghost = required<HTMLElement>('[data-rail-ghost]');
  const ghostBar = required<HTMLElement>('[data-rail-ghost-bar]');
  const poolTop = required<HTMLElement>('[data-rail-pool="top"]');
  const poolBottom = required<HTMLElement>('[data-rail-pool="bottom"]');
  const digitCols = [...document.querySelectorAll<HTMLElement>('[data-rail-digit]')];

  // Section words only exist in full mode (the static mode shows the server-rendered list).
  const hits = full ? [...document.querySelectorAll<HTMLAnchorElement>('[data-rail-hit]')] : [];
  const words: Word[] = hits.flatMap((hit) => {
    const id = hit.dataset.railHit ?? '';
    const letters = [...document.querySelectorAll<HTMLElement>(`[data-rail-letter="${id}"]`)];
    const members = (hit.dataset.railMembers ?? id)
      .split(' ')
      .map((member) => document.getElementById(member))
      .filter((el): el is HTMLElement => el !== null);
    if (!id || !members.length || !letters.length) return [];
    return [{ id, hit, letters, members, label: letters.map((l) => l.textContent ?? '').join('') }];
  });

  const controller = new AbortController();
  const { signal } = controller;
  const st = {
    docH: 0,
    vh: 0,
    vw: 0,
    lastY: window.scrollY,
    vel: 0,
    prevPct: -1,
    prevDigits: [-1, -1, -1],
    readoutAbove: false,
    introDone: false,
    zoomIntent: false,
    zoomTimer: 0,
    zoomP: 0,
    zoomWrote: false,
    dragging: false,
    ghostActive: false,
    ghostY: 0,
    dragStartY: 0,
    dragMoved: 0,
    snapSince: null as number | null,
    snapping: false,
    armed: true,
    jumping: false,
    hovered: -1,
  };
  let sections: RailSection[] = [];
  let metrics: Metrics[] | null = null;
  const hover = new Float32Array(words.length);
  const flashUntil = new Float64Array(words.length);
  const spans: RideSpan[] = [];
  const pose: Pose = { x: 0, y: 0, rot: 0, scale: 1, alpha: 1 };

  // ---------- Ticks: one row per 1% of the document, labelled every 5% ----------
  const ticks: Tick[] = [];
  const fragment = document.createDocumentFragment();
  for (let i = 0; i <= 100 + 1e-6; i += RAIL_LAYOUT.minorPct) {
    const pct = Math.round(i * 100) / 100;
    const major = Math.abs(pct % RAIL_LAYOUT.labelPct) < 1e-6;
    const row = document.createElement('div');
    row.className = 'rail-tick';
    const line = document.createElement('span');
    line.className = 'rail-tick__line';
    line.style.width = `${major ? RAIL_LOOK.majorLen : RAIL_LOOK.minorLen}px`;
    line.style.opacity = full ? '0' : String(major ? RAIL_LOOK.majorAlpha : RAIL_LOOK.minorAlpha);
    row.appendChild(line);
    let label: HTMLElement | null = null;
    if (major) {
      label = document.createElement('span');
      label.className = 'rail-tick__label';
      label.style.right = `${RAIL_LOOK.majorLen + 4}px`;
      label.style.opacity = String(RAIL_LOOK.labelAlpha);
      label.textContent = String(pct);
      row.appendChild(label);
    }
    fragment.appendChild(row);
    ticks.push({
      pct,
      alpha: major ? RAIL_LOOK.majorAlpha : RAIL_LOOK.minorAlpha,
      row,
      line,
      label,
      docY: 0,
      lineCss: '',
      rowCss: '',
      labelOpacity: RAIL_LOOK.labelAlpha,
    });
  }
  strip.replaceChildren(fragment);

  const lines = ticks.map((t) => t.line);
  let cascade: gsap.core.Timeline | null = null;
  if (!full) {
    st.introDone = true;
  } else if (intro.isDone()) {
    gsap.set(lines, { scaleX: 1, opacity: (i: number) => ticks[i].alpha });
    st.introDone = true;
  } else {
    // Load-in cascade: ticks draw in from the outer edge, top-down, after the instrument delay.
    gsap.set(lines, { scaleX: 0, opacity: 0 });
    cascade = gsap
      .timeline()
      .to({}, { duration: INTRO.instrAt })
      .to(lines, {
        scaleX: 1,
        opacity: (i: number) => ticks[i].alpha,
        duration: RAIL_MOTION.introDur,
        stagger: RAIL_MOTION.introStagger,
        ease: 'power3.out',
        overwrite: true,
        onComplete: () => {
          st.introDone = true;
        },
      });
    intro.register(cascade);
  }

  // ---------- Layout (document height, viewport, section anchors, pool sizes) ----------
  const sizePools = () => {
    if (!metrics) return;
    const longest = Math.max(260, ...metrics.map((m) => m.total * RAIL_LAYOUT.headingPx));
    const width = longest + RAIL_LAYOUT.railW + RAIL_LAYOUT.textPad + RAIL_LOOK.poolPad;
    const count = words.length;
    poolTop.style.width = poolBottom.style.width = `${width}px`;
    // Lets page chrome (eyebrow asides) stay clear of the top contrast pool.
    html.style.setProperty('--rail-pool-w', `${width}px`);
    poolTop.style.height = `${
      NAV_H +
      RAIL_LAYOUT.topPad +
      Math.min(Math.max(0, count - 1), RAIL_LAYOUT.pileMax) * RAIL_LAYOUT.queueSlot +
      RAIL_LAYOUT.currentGap +
      RAIL_LAYOUT.headingPx +
      RAIL_LOOK.poolPad
    }px`;
    poolBottom.style.height = `${RAIL_LAYOUT.queuePad + count * RAIL_LAYOUT.queueSlot + RAIL_LOOK.poolPad}px`;
  };

  const layout = () => {
    st.docH = html.scrollHeight;
    st.vh = window.innerHeight;
    st.vw = window.innerWidth;
    strip.style.height = `${st.docH}px`;
    for (const tick of ticks) {
      tick.docY = (tick.pct / 100) * st.docH;
      tick.row.style.top = `${tick.docY}px`;
    }
    sections = words.map((word) => {
      const first = word.members[0].getBoundingClientRect();
      const last = word.members[word.members.length - 1].getBoundingClientRect();
      return { id: word.id, label: word.label, anchor: first.top + window.scrollY, bottom: last.bottom + window.scrollY };
    });
    sizePools();
  };

  layout();
  const resizeObserver = new ResizeObserver(layout);
  resizeObserver.observe(document.body);
  window.addEventListener('resize', layout, { signal });

  let alive = true;
  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  fontsReady
    .catch(() => undefined)
    .then(() => {
      if (!alive) return;
      if (words.length) metrics = measureMetrics(words.map((w) => w.label));
      layout();
    });

  // ---------- Per-frame update ----------
  const frame = (_time: number, deltaMs: number) => {
    const { docH, vh, vw } = st;
    if (!vh) return;
    const dt = Math.min(deltaMs / 1000, 0.1) || 0.016;
    const y = window.scrollY;
    const maxScroll = Math.max(1, docH - vh);
    const p = clamp01(y / maxScroll);
    const map = rulerMap(vh);
    const drift = map.drift(p);
    st.vel += ((y - st.lastY) / dt - st.vel) * (1 - Math.exp(-6 * dt));
    st.lastY = y;

    // Hover zoom of the rail into a whole-page map (damped).
    const zoomTarget = full && (st.zoomIntent || st.dragging) ? 1 : 0;
    st.zoomP += (zoomTarget - st.zoomP) * (1 - Math.exp(-RAIL_MOTION.zoomLerp * dt));
    if (zoomTarget === 0 && st.zoomP < 5e-4) st.zoomP = 0;
    if (zoomTarget === 1 && st.zoomP > 0.9995) st.zoomP = 1;
    const zoom = st.zoomP;

    // Section words: queue → rail → letter-by-letter flip into the top stack.
    spans.length = 0;
    const states = metrics ? computeSectionStates(sections, metrics, { y, vh, maxScroll, drift }) : null;
    if (metrics && states) {
      let stackCount = 0;
      let inFlight = 0;
      let maxFlip = 0;
      let maxQueued = 0;
      states.forEach((s, i) => {
        if (s.flipP >= 1) stackCount++;
        else if (s.flipP > 0) inFlight += s.flipP;
        maxFlip = Math.max(maxFlip, s.flipP);
        if (i > 0) maxQueued = Math.max(maxQueued, 1 - s.detachP);
      });
      poolTop.style.opacity = String(RAIL_LOOK.poolAlpha * maxFlip);
      poolBottom.style.opacity = String(RAIL_LOOK.poolAlpha * maxQueued);

      const zoomEase = easeInOutCubic(zoom);
      const now = performance.now();
      words.forEach((word, i) => {
        const m = metrics![i];
        const s = states[i];
        const tr = wordTransition(i, s, m, stackCount, inFlight, vw);
        const n = word.letters.length;
        const mapY = map.base + (sections[i].anchor / docH) * map.span;
        hover[i] += ((st.hovered === i ? 1 : 0) - hover[i]) * (1 - Math.exp(-dt / RAIL_TIMING.hoverTau));
        const highlight = hover[i];
        const flash = clamp01((flashUntil[i] - now) / RAIL_TIMING.flashMs);
        let x0 = Infinity;
        let x1 = -Infinity;
        let y0 = Infinity;
        let y1 = -Infinity;
        let maxAlpha = 0;

        for (let j = 0; j < n; j++) {
          const order = tr.reversed ? n - 1 - j : j;
          const d = easeInOutCubic(letterProgress(tr.t, order, n));
          blendPose(tr.from(j), tr.to(j), d, pose);
          if (zoomEase > 0) {
            const target = horizPose(m, j, mapY, QUEUE_SCALE, RAIL_LOOK.mapAlpha, vw);
            pose.x += (target.x - pose.x) * zoomEase;
            pose.y += (target.y - pose.y) * zoomEase;
            pose.rot *= 1 - zoomEase;
            pose.scale += (target.scale - pose.scale) * zoomEase;
            pose.alpha += (target.alpha - pose.alpha) * zoomEase;
          }
          const el = word.letters[j];
          el.style.transform = `translate3d(${pose.x}px, ${pose.y}px, 0) translate(-50%, -50%) rotate(${pose.rot}deg) scale(${pose.scale})`;
          el.style.opacity = '1';
          // Alpha is a colour mix toward the page background (keeps the bg halo opaque).
          const visible = pose.alpha + (1 - pose.alpha) * highlight;
          const base =
            visible >= 0.995
              ? 'var(--ink-strong)'
              : `color-mix(in srgb, var(--ink-strong) ${(100 * clamp01(visible)).toFixed(1)}%, var(--bg))`;
          el.style.color =
            flash > 0.01 ? `color-mix(in srgb, var(--accent-ink) ${(70 * flash).toFixed(0)}%, ${base})` : base;
          maxAlpha = Math.max(maxAlpha, pose.alpha);

          const halfW = (m.adv[j] * RAIL_LAYOUT.headingPx * pose.scale) / 2 + 2;
          const halfH = (RAIL_LAYOUT.headingPx * pose.scale) / 2 + 2;
          const upright = Math.abs(pose.rot) > 45;
          const ex = upright ? halfH : halfW;
          const ey = upright ? halfW : halfH;
          x0 = Math.min(x0, pose.x - ex);
          x1 = Math.max(x1, pose.x + ex);
          y0 = Math.min(y0, pose.y - ey);
          y1 = Math.max(y1, pose.y + ey);
        }

        const riding = s.detachP * (1 - s.flipP);
        if (i > 0 && riding > 0.02) spans.push({ top: s.v, bottom: s.v + s.rideLen, k: riding });
        if (Number.isFinite(x0)) {
          const hit = word.hit.style;
          hit.left = `${x0 - 2}px`;
          hit.top = `${y0 - 2}px`;
          hit.width = `${x1 - x0 + 4}px`;
          hit.height = `${y1 - y0 + 4}px`;
          hit.pointerEvents = maxAlpha > 0.05 ? 'auto' : 'none';
        }
      });
    }

    // Ruler: the tick strip scrolls with the page plus a small drift; the needle moves like a thumb.
    strip.style.transform = `translate3d(0, ${-y + drift}px, 0)`;
    const needleY = map.base + p * map.span;
    needle.style.transform = `translate3d(0, ${needleY}px, 0)`;
    needle.style.opacity = String(clamp01(p / Math.max(0.001, RAIL_LOOK.needleFadePct / 100)));
    const above = needleY > vh - RAIL_TIMING.readoutFlipPad;
    if (above !== st.readoutAbove) {
      st.readoutAbove = above;
      readout.style.top = above ? '-14px' : '4px';
    }
    const pct = Math.round(100 * p);
    if (pct !== st.prevPct) {
      st.prevPct = pct;
      rail.setAttribute('aria-valuenow', String(pct));
      const digits = String(pct).padStart(3, '0');
      for (let k = 0; k < 3; k++) {
        const digit = digits.charCodeAt(k) - 48;
        if (digit !== st.prevDigits[k]) {
          st.prevDigits[k] = digit;
          digitCols[k].style.transform = `translateY(${-digit}em)`;
        }
      }
    }

    bracket.style.transform = `translate3d(0, ${map.base + (y / docH) * map.span}px, 0)`;
    bracket.style.height = `${(vh / docH) * map.span}px`;
    bracket.style.opacity = String(zoom);
    if (st.ghostActive) {
      ghost.style.transform = `translate3d(0, ${st.ghostY}px, 0)`;
      ghost.style.opacity = String(RAIL_LOOK.ghostAlpha * (0.2 + 0.8 * zoom));
    } else ghost.style.opacity = '0';

    // Tick reactions (zoom map, label yield, velocity stretch) belong to the full instrument only.
    if (full && st.introDone) {
      const pos = p * docH;
      const speed = clamp01(Math.abs(st.vel) / 3000);
      const moveRows = zoom > 0 || st.zoomWrote;
      for (const tick of ticks) {
        const screenY = tick.docY - y + drift;
        const mapTickY = map.base + (tick.pct / 100) * map.span;
        if (moveRows) {
          const rowCss = zoom > 0 ? `translate3d(0, ${zoom * (mapTickY - screenY)}px, 0)` : '';
          if (rowCss !== tick.rowCss) {
            tick.rowCss = rowCss;
            tick.row.style.transform = rowCss;
          }
        }
        if (tick.label) {
          // Proximity yield: numbers step aside for a riding word.
          const labelY = screenY + zoom * (mapTickY - screenY);
          let keep = 1;
          if (RAIL_LOOK.yieldPad > 0 && zoom < 1) {
            for (const span of spans) {
              const gap = labelY < span.top ? span.top - labelY : labelY > span.bottom ? labelY - span.bottom : 0;
              if (gap < RAIL_LOOK.yieldPad) keep = Math.min(keep, 1 - span.k * (1 - gap / RAIL_LOOK.yieldPad));
            }
          }
          const opacity = RAIL_LOOK.labelAlpha * (1 - (1 - keep) * (1 - zoom));
          if (Math.abs(opacity - tick.labelOpacity) > 1e-3) {
            tick.labelOpacity = opacity;
            tick.label.style.opacity = String(opacity);
          }
        }
        // Velocity stretch: fast scrolling lengthens and brightens the ticks near the needle.
        const dist = Math.abs(tick.docY - pos);
        let scale = 1;
        let alpha = tick.alpha;
        if (dist < RAIL_MOTION.velRadius && RAIL_MOTION.velRadius > 0) {
          const f = 1 - dist / RAIL_MOTION.velRadius;
          const k = speed * f * f;
          scale = 1 + RAIL_MOTION.velMax * k;
          alpha = Math.min(1, tick.alpha + 0.6 * k);
        }
        const lineCss = `${scale.toFixed(4)}|${alpha.toFixed(4)}`;
        if (lineCss !== tick.lineCss) {
          tick.lineCss = lineCss;
          tick.line.style.transform = `scaleX(${scale})`;
          tick.line.style.opacity = String(alpha);
        }
      }
      st.zoomWrote = zoom > 0;
    }

    // Auto-snap: never leave a flip frozen half-way once scrolling rests.
    if (!full || !states || !lenis) return;
    const half = states.findIndex((s) => s.flipP > 0.04 && s.flipP < 0.96);
    if (st.dragging) st.armed = true;
    if (st.snapping) {
      if (half < 0) st.snapping = false;
    } else if (
      half >= 0 &&
      st.armed &&
      !st.jumping &&
      Math.abs(st.vel) < RAIL_TIMING.snapVelocity &&
      !st.dragging &&
      st.zoomP < 0.3
    ) {
      const now = performance.now();
      if (st.snapSince === null) st.snapSince = now;
      else if (now - st.snapSince > RAIL_MOTION.snapDelay) {
        const target = snapTarget(half, sections, states, { vh, maxScroll, drift });
        st.snapping = true;
        st.armed = false;
        st.snapSince = null;
        lenis.scrollTo(target, {
          duration: RAIL_MOTION.snapDur,
          easing: easeInOutCubic,
          onComplete: () => {
            st.snapping = false;
          },
        });
      }
    } else st.snapSince = null;
  };
  gsap.ticker.add(frame);

  // ---------- Interaction ----------
  const scrollToY = (target: number, duration: number) => {
    if (lenis) lenis.scrollTo(target, { duration, easing: easeOutExpo, onComplete: () => (st.jumping = false) });
    else {
      window.scrollTo({ top: target });
      st.jumping = false;
    }
  };

  const setZoomIntent = (on: boolean) => {
    window.clearTimeout(st.zoomTimer);
    st.zoomTimer = window.setTimeout(
      () => {
        st.zoomIntent = on;
      },
      on ? RAIL_MOTION.zoomInDelay : RAIL_MOTION.zoomOutDelay,
    );
  };

  const endDrag = (event: PointerEvent) => {
    if (!st.dragging) return;
    st.dragging = false;
    const r = rail.getBoundingClientRect();
    const inside =
      event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    if (!inside) {
      st.ghostActive = false;
      setZoomIntent(false);
    }
  };

  // Hover zoom, ghost line and drag-scrub: full instrument only.
  if (full) {
    rail.addEventListener('pointerenter', () => setZoomIntent(true), { signal });
    rail.addEventListener(
      'pointerleave',
      () => {
        st.ghostActive = false;
        if (!st.dragging) setZoomIntent(false);
      },
      { signal },
    );
    rail.addEventListener(
      'pointermove',
      (event) => {
        const map = rulerMap(st.vh);
        const yClamped = Math.max(map.base, Math.min(map.base + map.span, event.clientY));
        const ratio = clamp01((yClamped - map.base) / map.span);
        st.ghostActive = true;
        st.ghostY = yClamped;
        if (st.dragging) {
          st.dragMoved = Math.max(st.dragMoved, Math.abs(event.clientY - st.dragStartY));
          lenis?.scrollTo(ratio * Math.max(1, st.docH - st.vh), { lerp: RAIL_MOTION.dragLerp });
        }
      },
      { signal },
    );
    rail.addEventListener(
      'pointerdown',
      (event) => {
        event.preventDefault();
        st.dragStartY = event.clientY;
        st.dragMoved = 0;
        st.dragging = true;
        rail.setPointerCapture(event.pointerId);
      },
      { signal },
    );
    rail.addEventListener('pointerup', endDrag, { signal });
    rail.addEventListener('pointercancel', endDrag, { signal });
  }
  rail.addEventListener(
    'click',
    (event) => {
      if (st.dragMoved > 4) return;
      const map = rulerMap(st.vh);
      const target = clamp01((event.clientY - map.base) / map.span) * Math.max(1, st.docH - st.vh);
      const dist = Math.abs(target - window.scrollY);
      scrollToY(target, RAIL_MOTION.jumpDur * (0.4 + 0.6 * Math.min(1, dist / (2.5 * st.vh))));
      if (full) gsap.fromTo(ghostBar, { opacity: 1 }, { opacity: RAIL_LOOK.ghostAlpha, duration: 0.45 });
    },
    { signal },
  );

  words.forEach((word, i) => {
    word.hit.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        flashUntil[i] = performance.now() + RAIL_TIMING.flashMs;
        st.armed = false;
        st.jumping = true;
        const el = document.getElementById(word.id);
        const target = i === 0 || !el ? 0 : el.getBoundingClientRect().top + window.scrollY - NAV_H;
        scrollToY(target, RAIL_MOTION.jumpDur);
      },
      { signal },
    );
    word.hit.addEventListener('pointerenter', () => (st.hovered = i), { signal });
    word.hit.addEventListener(
      'pointerleave',
      () => {
        if (st.hovered === i) st.hovered = -1;
      },
      { signal },
    );
  });

  const rearm = () => {
    st.armed = true;
  };
  if (full) {
    window.addEventListener('wheel', rearm, { passive: true, signal });
    window.addEventListener('touchmove', rearm, { passive: true, signal });
    window.addEventListener('keydown', rearm, { signal });
  }

  return () => {
    alive = false;
    controller.abort();
    gsap.ticker.remove(frame);
    resizeObserver.disconnect();
    window.clearTimeout(st.zoomTimer);
    cascade?.kill();
    strip.replaceChildren();
    for (const word of words) {
      word.hit.removeAttribute('style');
      for (const letter of word.letters) letter.removeAttribute('style');
    }
    for (const el of [needle, bracket, ghost, poolTop, poolBottom, strip, readout]) el.removeAttribute('style');
    html.style.removeProperty('--rail-pool-w');
    for (const col of digitCols) col.removeAttribute('style');
  };
}
