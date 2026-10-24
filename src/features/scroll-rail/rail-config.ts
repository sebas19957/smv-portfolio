/**
 * Scroll-rail constants. These are the reference implementation's tuner defaults
 * ("Ruler layout" / "Ruler motion" / "Ruler look"), kept verbatim.
 */
export const RAIL_LAYOUT = {
  /** Vertical inset of the whole mapping from the nav bottom and the viewport bottom. */
  edgePad: 12,
  railW: 60,
  minorPct: 1,
  labelPct: 5,
  /** Flip line, as a % of viewport height from the top. */
  thresholdPct: 12,
  headingPx: 34,
  ridingPx: 20,
  queuePx: 16,
  topPad: 28,
  currentGap: 26,
  queueSlot: 20,
  queuePad: 36,
  textPad: 0,
  /**
   * Compact words kept visible above the current heading (the reference's maximum, 4 sections).
   * With more sections the oldest entries slide up under the nav and fade out instead of
   * pushing the heading down toward the content.
   */
  pileMax: 3,
} as const;

export const RAIL_MOTION = {
  flipZone: 200,
  detachZone: 240,
  stagger: 0.16,
  arc: 28,
  jumpDur: 1.25,
  snapDelay: 400,
  snapDur: 0.7,
  introDur: 1,
  introStagger: 0.01,
  velRadius: 180,
  velMax: 0.6,
  zoomInDelay: 150,
  zoomOutDelay: 150,
  zoomLerp: 10,
  dragLerp: 0.18,
} as const;

export const RAIL_LOOK = {
  minorAlpha: 0.4,
  majorAlpha: 0.8,
  labelAlpha: 0.5,
  minorLen: 10,
  majorLen: 20,
  ghostAlpha: 1,
  ghostThick: 3,
  queueAlpha: 0.35,
  yieldPad: 24,
  needleFadePct: 3,
  bracketAlpha: 0.1,
  mapAlpha: 0.85,
  poolAlpha: 1,
  frostSolid: 40,
  frostGamma: 2.2,
  poolPad: 64,
} as const;

/** Rail interaction timings that are not tunables in the reference. */
export const RAIL_TIMING = {
  /** Accent flash on a clicked heading, in ms. */
  flashMs: 350,
  /** Hover highlight time constant, in seconds. */
  hoverTau: 0.08,
  /** Scroll velocity below which a half-done flip may auto-snap, in px/s. */
  snapVelocity: 30,
  /** Readout jumps above the needle when it gets this close to the viewport bottom. */
  readoutFlipPad: 26,
} as const;
