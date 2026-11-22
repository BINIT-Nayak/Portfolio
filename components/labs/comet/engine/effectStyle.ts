/** Visual tuning in CSS pixels; spark size deliberately does not scale with the beam. */
export const effectStyle = {
  trailLength: 190,
  // Width multipliers relative to headSize, one for each trail strand.
  trailWidthPrimary: 0.06,
  trailWidthSecondary: 0.043,
  duration: 700,
  trailHistoryMs: 240,
  tailFadeMs: 140,
  headFadeMs: 180,
  noseGlow: 0.38,
  particleRadiusMin: 0.7,
  particleRadiusMax: 1.35,
  particleLifeMax: 680,
  emissionStart: 0.3,
  midPathRate: 12,
  approachRate: 74,
  convergenceMs: 620,
  arrivalCount: 10,
  arrivalRadiusMin: 2,
  arrivalRadiusMax: 3,
} as const;
