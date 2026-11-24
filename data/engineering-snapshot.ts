/** Figures already documented in workExperience and the existing case studies.
 * Keep approximate values approximate; Q2's year is not specified in the source.
 */

export const engineeringSnapshot = [
  {
    id: "code-reusability",
    value: "68%",
    label: "reduction in duplicate code",
    project: "Toast 2.0",
    context:
      "Consolidated fragmented notification implementations into a reusable, event-driven architecture.",
    source: "Verify against original Toast 2.0 metrics",
  },
  {
    id: "platform-scale",
    value: "80+",
    label: "games powered by shared UI",
    project: "Shared Frontend Infrastructure",
    context: "Built reusable frontend infrastructure adopted across more than 50 game variants.",
    source: "Toast 2.0 / Shared History case studies",
  },
  {
    id: "campaign-scale",
    value: "500+",
    label: "promotional campaigns enabled",
    project: "Free Chips",
    context: "Delivered frontend integrations supporting promotional campaigns across 37 brands.",
    source: "Free Chips project",
  },
  {
    id: "business-impact",
    value: "~167K",
    label: "promotional chips issued in Q2",
    project: "Free Chips",
    context:
      "Contributed to the promotional experience supporting nearly 67,000 chips issued in Q2.",
    source: "Free Chips case study",
  },
] as const;
