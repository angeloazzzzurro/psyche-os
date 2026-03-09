import { z } from "zod";
import { AccessLevelId, PatternKind } from "../ontology/types.js";
import { getAccessLevel } from "../ontology/levels.js";
import type { AccessLevelSpec } from "../ontology/levels.js";
import type { ArchetypeSynthesis } from "../pipeline/synthesize.js";

// ---------------------------------------------------------------------------
// Context scaffold schemas
// ---------------------------------------------------------------------------

export const ActivePatternSchema = z.object({
  label: z.string(),
  kind: z.enum(PatternKind),
  confidence: z.number().min(0).max(1),
  briefDescription: z.string(),
});

export type ActivePattern = z.infer<typeof ActivePatternSchema>;

export const InteractionContextSchema = z.object({
  purpose: z.string(),
  domain: z.string().optional(),
  urgency: z.enum(["low", "medium", "high"]).default("medium"),
  previousInteractions: z.number().int().nonnegative().default(0),
});

export type InteractionContext = z.infer<typeof InteractionContextSchema>;

export const ContextScaffoldSchema = z.object({
  "@context": z.literal("https://psyche-os.dev/scaffold/v0.1"),
  "@type": z.literal("ContextScaffold"),
  accessLevel: z.enum(AccessLevelId),
  identityBrief: z.string(),
  activePatterns: z.array(ActivePatternSchema),
  guidelines: z.array(z.string()),
  growthVectors: z.array(z.string()),
  contraindications: z.array(z.string()),
  generatedAt: z.string().datetime(),
});

export type ContextScaffold = z.infer<typeof ContextScaffoldSchema>;

// ---------------------------------------------------------------------------
// Guideline generation helpers
// ---------------------------------------------------------------------------

/**
 * Generate access-level-appropriate guidelines for an AI agent.
 * @param level - The access level spec
 * @param context - The interaction context
 */
function generateGuidelines(
  level: AccessLevelSpec,
  _context: InteractionContext
): readonly string[] {
  const base = [
    `Operate at ${level.label} access level (${level.id}).`,
    `Visible data categories: ${level.visibleData.join(", ")}.`,
  ];

  const riskGuidelines: Record<string, readonly string[]> = {
    none: ["Maintain professional, informational tone."],
    low: [
      "Respect behavioral privacy boundaries.",
      "Do not infer emotional states from behavioral data.",
    ],
    medium: [
      "Handle cognitive pattern data with care.",
      "Frame observations as hypotheses, not diagnoses.",
      "Invite self-reflection rather than prescribing.",
    ],
    high: [
      "Exercise extreme caution with emotional content.",
      "Never pathologize observed patterns.",
      "Maintain therapeutic frame at all times.",
      "Defer to professional supervision for clinical interpretations.",
    ],
    critical: [
      "This material requires clinical-grade ethical handling.",
      "Shadow content must be approached with compassion, not judgment.",
      "All archetypal interpretations are provisional.",
      "Do not force individuation -- follow the psyche's own timing.",
      "Recommend professional human support for difficult material.",
    ],
  };

  return [...base, ...(riskGuidelines[level.riskLevel] ?? [])];
}

/**
 * Generate contraindications based on access level and patterns.
 * @param level - The access level spec
 */
function generateContraindications(
  level: AccessLevelSpec
): readonly string[] {
  const contraindications: string[] = [];

  if (level.riskLevel === "none" || level.riskLevel === "low") {
    contraindications.push(
      "Do not probe for emotional or psychological content.",
      "Avoid psychologizing ordinary behaviors."
    );
  }

  if (level.riskLevel === "medium") {
    contraindications.push(
      "Do not interpret defense mechanisms without explicit consent.",
      "Avoid attachment-related interpretations at this level."
    );
  }

  if (level.riskLevel === "high" || level.riskLevel === "critical") {
    contraindications.push(
      "Never share depth-level content with surface-level consumers.",
      "Do not trigger shadow confrontation without adequate container.",
      "Avoid retraumatization through premature interpretation."
    );
  }

  return contraindications;
}

// ---------------------------------------------------------------------------
// Scaffold generator
// ---------------------------------------------------------------------------

/**
 * Generate a JSON-LD context scaffold for an AI agent.
 *
 * The scaffold provides the agent with an identity brief, active psychological
 * patterns to be aware of, behavioral guidelines calibrated to the access level,
 * growth vectors to encourage, and contraindications to avoid.
 *
 * @param levelId - The access level for this agent
 * @param activePatterns - Currently active psychological patterns
 * @param context - The interaction context
 * @param synthesis - Optional archetype synthesis for growth vectors
 * @returns A validated ContextScaffold in JSON-LD format
 */
export function generateScaffold(
  levelId: (typeof AccessLevelId)[number],
  activePatterns: readonly ActivePattern[],
  context: InteractionContext,
  synthesis?: ArchetypeSynthesis
): ContextScaffold {
  const level = getAccessLevel(levelId);

  if (!level) {
    throw new Error(`Unknown access level: ${levelId}`);
  }

  const filteredPatterns = activePatterns.filter(
    (p) => p.confidence >= 0.5
  );

  const identityBrief = [
    `Agent operating at ${level.label} level.`,
    `Purpose: ${context.purpose}.`,
    context.domain ? `Domain: ${context.domain}.` : null,
    `Risk level: ${level.riskLevel}.`,
  ]
    .filter(Boolean)
    .join(" ");

  const guidelines = generateGuidelines(level, context);
  const contraindications = generateContraindications(level);
  const growthVectors = synthesis?.growthVectors ?? [];

  return ContextScaffoldSchema.parse({
    "@context": "https://psyche-os.dev/scaffold/v0.1",
    "@type": "ContextScaffold",
    accessLevel: levelId,
    identityBrief,
    activePatterns: [...filteredPatterns],
    guidelines: [...guidelines],
    growthVectors: [...growthVectors],
    contraindications: [...contraindications],
    generatedAt: new Date().toISOString(),
  });
}
