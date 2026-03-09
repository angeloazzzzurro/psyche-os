import { AccessLevelId } from "./types.js";

/**
 * Extended access level definition with visibility and consumer metadata.
 */
interface AccessLevelSpec {
  readonly id: (typeof AccessLevelId)[number];
  readonly label: string;
  readonly description: string;
  readonly accessibleBy: readonly string[];
  readonly visibleData: readonly string[];
  readonly riskLevel: "none" | "low" | "medium" | "high" | "critical";
}

/** L0: Public persona, safe for any consumer. */
const L0_SURFACE = {
  id: "L0_Surface",
  label: "Surface",
  description:
    "Public persona and externally visible information. No psychological depth.",
  accessibleBy: ["generic chatbots", "public APIs", "search engines"],
  visibleData: [
    "public bio",
    "professional summary",
    "published content",
    "social profiles",
  ],
  riskLevel: "none",
} as const satisfies AccessLevelSpec;

/** L1: Behavioral patterns visible from work and daily routines. */
const L1_BEHAVIORAL = {
  id: "L1_Behavioral",
  label: "Behavioral",
  description:
    "Observable work patterns, habits, and preferences. No inner analysis.",
  accessibleBy: ["personal assistants", "productivity tools", "task managers"],
  visibleData: [
    "work patterns",
    "scheduling preferences",
    "tool usage habits",
    "communication frequency",
  ],
  riskLevel: "low",
} as const satisfies AccessLevelSpec;

/** L2: Cognitive patterns and thinking styles. */
const L2_COGNITIVE = {
  id: "L2_Cognitive",
  label: "Cognitive",
  description:
    "Thinking styles, decision-making patterns, and cognitive biases.",
  accessibleBy: ["coach AI", "learning systems", "decision support tools"],
  visibleData: [
    "thinking styles",
    "decision patterns",
    "cognitive biases",
    "learning preferences",
    "problem-solving approaches",
  ],
  riskLevel: "medium",
} as const satisfies AccessLevelSpec;

/** L3: Deep emotional patterns and relational dynamics. */
const L3_DEPTH = {
  id: "L3_Depth",
  label: "Depth",
  description:
    "Emotional patterns, attachment styles, defense mechanisms, and relational dynamics.",
  accessibleBy: [
    "supervised therapeutic agents",
    "trusted coaching systems",
    "clinical tools",
  ],
  visibleData: [
    "emotional patterns",
    "attachment mapping",
    "defense mechanisms",
    "relational dynamics",
    "self-sabotage cycles",
  ],
  riskLevel: "high",
} as const satisfies AccessLevelSpec;

/** L4: Archetypal layer, shadow work, deep individuation content. */
const L4_ARCHETYPAL = {
  id: "L4_Archetypal",
  label: "Archetypal",
  description:
    "Shadow work, archetypal patterns, individuation journey. Maximum psychological depth.",
  accessibleBy: ["self-use only", "clinical supervision"],
  visibleData: [
    "shadow inventory",
    "archetypal constellations",
    "individuation markers",
    "numinous encounters",
    "projection maps",
    "golden shadow content",
  ],
  riskLevel: "critical",
} as const satisfies AccessLevelSpec;

/** All five PSYCHE/OS access levels, ordered from surface to deepest. */
export const ACCESS_LEVELS = [
  L0_SURFACE,
  L1_BEHAVIORAL,
  L2_COGNITIVE,
  L3_DEPTH,
  L4_ARCHETYPAL,
] as const;

/**
 * Look up an access level by its ID.
 * @param id - The access level identifier
 * @returns The matching access level spec, or undefined
 */
export function getAccessLevel(
  id: (typeof AccessLevelId)[number]
): AccessLevelSpec | undefined {
  return ACCESS_LEVELS.find((level) => level.id === id);
}

/**
 * Check whether a given consumer type has access at a specific level.
 * @param levelId - The access level to check
 * @param consumer - The consumer type string
 * @returns True if the consumer appears in the level's accessibleBy list
 */
export function canAccess(
  levelId: (typeof AccessLevelId)[number],
  consumer: string
): boolean {
  const level = getAccessLevel(levelId);
  if (!level) return false;
  return level.accessibleBy.some((allowed) =>
    consumer.toLowerCase().includes(allowed.toLowerCase())
  );
}

export type { AccessLevelSpec };
