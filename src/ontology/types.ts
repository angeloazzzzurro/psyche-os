import { z } from "zod";

// ---------------------------------------------------------------------------
// Entity
// ---------------------------------------------------------------------------

/** All entity categories in the PSYCHE/OS ontology. */
export const EntityKind = [
  "Person",
  "Concept",
  "Tool",
  "Place",
  "Project",
] as const;

export const EntitySchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(EntityKind),
  name: z.string().min(1),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Entity = z.infer<typeof EntitySchema>;

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

export const ExperienceKind = [
  "Interaction",
  "Decision",
  "Creation",
  "Conflict",
  "Achievement",
] as const;

export const ExperienceSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(ExperienceKind),
  description: z.string(),
  timestamp: z.string().datetime(),
  participants: z.array(z.string().uuid()).default([]),
  emotionalValence: z.number().min(-1).max(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

// ---------------------------------------------------------------------------
// Pattern
// ---------------------------------------------------------------------------

export const PatternKind = [
  "BehavioralPattern",
  "CognitivePattern",
  "EmotionalPattern",
  "RelationalPattern",
] as const;

export const PatternSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(PatternKind),
  label: z.string(),
  description: z.string(),
  confidence: z.number().min(0).max(1),
  occurrences: z.number().int().nonnegative().default(0),
  firstSeen: z.string().datetime().optional(),
  lastSeen: z.string().datetime().optional(),
});

export type Pattern = z.infer<typeof PatternSchema>;

// ---------------------------------------------------------------------------
// Archetype
// ---------------------------------------------------------------------------

export const ArchetypeKind = [
  "Shadow",
  "GoldenShadow",
  "Persona",
  "Anima",
  "Trickster",
  "Hero",
  "WiseOld",
] as const;

export const ArchetypeSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(ArchetypeKind),
  label: z.string(),
  description: z.string(),
  manifestations: z.array(z.string().uuid()).default([]),
});

export type Archetype = z.infer<typeof ArchetypeSchema>;

// ---------------------------------------------------------------------------
// Dimension
// ---------------------------------------------------------------------------

export const DimensionKind = [
  "Psychological",
  "Spiritual",
  "Anthropological",
  "Social",
  "Creative",
  "Professional",
] as const;

export const DimensionSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(DimensionKind),
  metrics: z.array(z.string()),
});

export type Dimension = z.infer<typeof DimensionSchema>;

// ---------------------------------------------------------------------------
// Potential
// ---------------------------------------------------------------------------

export const PotentialState = [
  "Expressed",
  "Latent",
  "Sabotaged",
  "Emerging",
] as const;

export const PotentialSchema = z.object({
  id: z.string().uuid(),
  state: z.enum(PotentialState),
  label: z.string(),
  description: z.string(),
  relatedPatterns: z.array(z.string().uuid()).default([]),
});

export type Potential = z.infer<typeof PotentialSchema>;

// ---------------------------------------------------------------------------
// Cycle
// ---------------------------------------------------------------------------

export const CycleKind = [
  "Growth",
  "Sabotage",
  "Creative",
  "Avoidance",
] as const;

export const CycleSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(CycleKind),
  label: z.string(),
  trigger: z.string(),
  outcome: z.string(),
  frequency: z.number().nonnegative().optional(),
  sabotagedPotentials: z.array(z.string().uuid()).default([]),
});

export type Cycle = z.infer<typeof CycleSchema>;

// ---------------------------------------------------------------------------
// Insight
// ---------------------------------------------------------------------------

export const InsightKind = [
  "Observation",
  "Hypothesis",
  "Confirmation",
  "Contradiction",
] as const;

export const InsightSchema = z.object({
  id: z.string().uuid(),
  kind: z.enum(InsightKind),
  content: z.string(),
  confidence: z.number().min(0).max(1),
  provenance: z.string(),
  contradicts: z.array(z.string().uuid()).default([]),
  supports: z.array(z.string().uuid()).default([]),
  timestamp: z.string().datetime(),
});

export type Insight = z.infer<typeof InsightSchema>;

// ---------------------------------------------------------------------------
// Access Level
// ---------------------------------------------------------------------------

export const AccessLevelId = [
  "L0_Surface",
  "L1_Behavioral",
  "L2_Cognitive",
  "L3_Depth",
  "L4_Archetypal",
] as const;

export const AccessLevelSchema = z.object({
  id: z.enum(AccessLevelId),
  label: z.string(),
  description: z.string(),
  accessibleBy: z.array(z.string()),
});

export type AccessLevel = z.infer<typeof AccessLevelSchema>;

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const RelationKind = [
  "triggers",
  "projects_onto",
  "sabotages",
  "manifests_as",
  "contradicts",
  "evolves_into",
  "belongs_to_dimension",
] as const;

export const RelationSchema = z.object({
  kind: z.enum(RelationKind),
  sourceId: z.string().uuid(),
  targetId: z.string().uuid(),
  confidence: z.number().min(0).max(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type Relation = z.infer<typeof RelationSchema>;
