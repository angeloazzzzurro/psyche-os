import { DimensionKind } from "./types.js";

/**
 * Metric definition within a dimension.
 */
interface DimensionSpec {
  readonly kind: (typeof DimensionKind)[number];
  readonly label: string;
  readonly metrics: readonly string[];
}

/** Psychological dimension: internal mental structures and defense patterns. */
const PSYCHOLOGICAL = {
  kind: "Psychological",
  label: "Psychological Dimension",
  metrics: [
    "Big Five Profile",
    "Shadow Inventory",
    "Attachment Mapping",
    "Defense Mechanisms",
    "Self-Sabotage Patterns",
  ],
} as const satisfies DimensionSpec;

/** Spiritual dimension: meaning-making and individuation journey. */
const SPIRITUAL = {
  kind: "Spiritual",
  label: "Spiritual Dimension",
  metrics: [
    "Individuation Progress",
    "Numinous Encounters",
    "Value Hierarchy",
    "Meaning-Making Strategies",
  ],
} as const satisfies DimensionSpec;

/** Anthropological dimension: cultural context and mythological resonance. */
const ANTHROPOLOGICAL = {
  kind: "Anthropological",
  label: "Anthropological Dimension",
  metrics: [
    "Cultural Codes",
    "Ritual Mapping",
    "Mythological Resonance",
    "Liminal Spaces",
  ],
} as const satisfies DimensionSpec;

/** Social dimension: relational topology and communication patterns. */
const SOCIAL = {
  kind: "Social",
  label: "Social Dimension",
  metrics: [
    "Network Topology",
    "Communication Atlas",
    "Power Dynamics",
    "Social Masks",
  ],
} as const satisfies DimensionSpec;

/** Creative dimension: flow states and aesthetic preferences. */
const CREATIVE = {
  kind: "Creative",
  label: "Creative Dimension",
  metrics: [
    "Flow Fingerprint",
    "Aesthetic Genome",
    "Innovation Patterns",
    "Blocked Creativity",
  ],
} as const satisfies DimensionSpec;

/** Professional dimension: competency landscape and career patterns. */
const PROFESSIONAL = {
  kind: "Professional",
  label: "Professional Dimension",
  metrics: [
    "Competency Graph",
    "Decision DNA",
    "Leadership Archetype",
    "Career Narrative",
  ],
} as const satisfies DimensionSpec;

/** All six PSYCHE/OS dimensions with their associated metrics. */
export const DIMENSIONS = [
  PSYCHOLOGICAL,
  SPIRITUAL,
  ANTHROPOLOGICAL,
  SOCIAL,
  CREATIVE,
  PROFESSIONAL,
] as const;

/**
 * Look up a dimension spec by kind.
 * @param kind - The dimension kind to retrieve
 * @returns The matching dimension spec, or undefined
 */
export function getDimension(
  kind: (typeof DimensionKind)[number]
): DimensionSpec | undefined {
  return DIMENSIONS.find((d) => d.kind === kind);
}

/**
 * Get all metric names for a given dimension.
 * @param kind - The dimension kind
 * @returns Array of metric names, or empty array if not found
 */
export function getMetrics(
  kind: (typeof DimensionKind)[number]
): readonly string[] {
  return getDimension(kind)?.metrics ?? [];
}

export type { DimensionSpec };
