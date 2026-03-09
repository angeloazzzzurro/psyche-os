import type {
  Connection,
  CrossValidatedPattern,
  DimensionalScore,
  Extraction,
  NarrativeArc,
  Potential,
  Theme,
  Entity,
} from './types'

const ENTITY_LIBRARY: Record<string, Entity> = {
  'PSYCHE/OS': {
    name: 'PSYCHE/OS',
    kind: 'system',
    mentions: 32,
    significance: 'Self-modeling interface for cognitive cartography.',
    dimensions: ['Psychological', 'Professional', 'Creative'],
    relatedEntities: ['Loom', 'Northstar Studio', 'Civic Mesh'],
    sourceMemories: ['claude-sessions', 'codex-sessions'],
  },
  Loom: {
    name: 'Loom',
    kind: 'project',
    mentions: 24,
    significance: 'Recurring architecture substrate for tools and protocols.',
    dimensions: ['Professional', 'Psychological'],
    relatedEntities: ['PSYCHE/OS', 'Claude Code', 'Tailscale'],
    sourceMemories: ['claude-sessions'],
  },
  'Claude Code': {
    name: 'Claude Code',
    kind: 'tool',
    mentions: 18,
    significance: 'External reasoning partner and execution environment.',
    dimensions: ['Professional'],
    relatedEntities: ['Loom', 'Beacon Protocol'],
    sourceMemories: ['claude-sessions', 'social-traces'],
  },
  'Civic Mesh': {
    name: 'Civic Mesh',
    kind: 'protocol',
    mentions: 14,
    significance: 'Protocol framing applied to regulation and interoperability.',
    dimensions: ['Professional', 'Anthropological'],
    relatedEntities: ['PSYCHE/OS', 'Northstar Studio'],
    sourceMemories: ['claude-sessions'],
  },
  Tailscale: {
    name: 'Tailscale',
    kind: 'infrastructure',
    mentions: 11,
    significance: 'Pragmatic substrate for sovereignty-oriented infrastructure.',
    dimensions: ['Professional'],
    relatedEntities: ['Loom', 'PSYCHE/OS'],
    sourceMemories: ['claude-sessions'],
  },
  Lyra: {
    name: 'Lyra',
    kind: 'persona',
    mentions: 22,
    significance: 'Dialogic alter used to externalize thinking and rhythm.',
    dimensions: ['Psychological', 'Creative'],
    relatedEntities: ['Jung', 'Bateson', 'Beacon Protocol'],
    sourceMemories: ['codex-sessions'],
  },
  Jung: {
    name: 'Jung',
    kind: 'thinker',
    mentions: 13,
    significance: 'Primary symbolic frame for archetypes, shadow, and individuation.',
    dimensions: ['Psychological', 'Spiritual'],
    relatedEntities: ['Lyra', 'Bateson'],
    sourceMemories: ['codex-sessions'],
  },
  Bateson: {
    name: 'Bateson',
    kind: 'thinker',
    mentions: 10,
    significance: 'Ecology-of-mind perspective feeding the spiritual and anthropological dimensions.',
    dimensions: ['Spiritual', 'Anthropological'],
    relatedEntities: ['Jung', 'Lyra'],
    sourceMemories: ['codex-sessions'],
  },
  'Corrections Practice': {
    name: 'Corrections Practice',
    kind: 'method',
    mentions: 15,
    significance: 'Living archive of mistakes converted into future leverage.',
    dimensions: ['Psychological', 'Professional'],
    relatedEntities: ['PSYCHE/OS', 'Loom'],
    sourceMemories: ['codex-sessions', 'claude-sessions'],
  },
  Stillframe: {
    name: 'Stillframe',
    kind: 'project',
    mentions: 16,
    significance: 'Photography practice anchored in atmosphere and staging.',
    dimensions: ['Creative'],
    relatedEntities: ['Northstar Studio', 'Beacon Protocol'],
    sourceMemories: ['social-traces'],
  },
  'Northstar Studio': {
    name: 'Northstar Studio',
    kind: 'project',
    mentions: 14,
    significance: 'Convergence surface for system design and public articulation.',
    dimensions: ['Creative', 'Professional'],
    relatedEntities: ['PSYCHE/OS', 'Civic Mesh', 'Stillframe'],
    sourceMemories: ['social-traces', 'claude-sessions'],
  },
  'Beacon Protocol': {
    name: 'Beacon Protocol',
    kind: 'protocol',
    mentions: 12,
    significance: 'Naming-led framework for agent invocation and interaction.',
    dimensions: ['Creative', 'Professional'],
    relatedEntities: ['Claude Code', 'Lyra', 'Northstar Studio'],
    sourceMemories: ['social-traces'],
  },
}

const THEME_LIBRARY: Record<string, Theme> = {
  'Tool Sovereignty': {
    label: 'Tool Sovereignty',
    relevance: 0.91,
    keywords: ['self-hosting', 'control', 'stack', 'independence'],
    dimension: 'Professional',
    evidence: 'Repeated preference for owned infrastructure over opaque platforms.',
  },
  'Protocol Design': {
    label: 'Protocol Design',
    relevance: 0.84,
    keywords: ['interfaces', 'schemas', 'contracts', 'systems'],
    dimension: 'Professional',
    evidence: 'Projects are repeatedly framed as protocols rather than isolated artifacts.',
  },
  'Cross-domain Synthesis': {
    label: 'Cross-domain Synthesis',
    relevance: 0.88,
    keywords: ['bridging', 'transfer', 'unification', 'metaphor'],
    dimension: 'Creative',
    evidence: 'Concepts are moved across engineering, art, philosophy, and product design.',
  },
  'Consciousness Inquiry': {
    label: 'Consciousness Inquiry',
    relevance: 0.82,
    keywords: ['mind', 'metaphysics', 'phenomenology', 'awareness'],
    dimension: 'Spiritual',
    evidence: 'Philosophical and contemplative threads recur with increasing depth.',
  },
  'Narrative Identity': {
    label: 'Narrative Identity',
    relevance: 0.71,
    keywords: ['story', 'self-model', 'chapters', 'meaning'],
    dimension: 'Anthropological',
    evidence: 'Life phases are repeatedly understood as story chapters with evolving roles.',
  },
  'Embodied Discipline': {
    label: 'Embodied Discipline',
    relevance: 0.73,
    keywords: ['body', 'training', 'consistency', 'counter-pattern'],
    dimension: 'Psychological',
    evidence: 'Physical regularity behaves as the most stable corrective to cognitive drift.',
  },
  'Aesthetic Restraint': {
    label: 'Aesthetic Restraint',
    relevance: 0.76,
    keywords: ['editing', 'silence', 'atmosphere', 'composition'],
    dimension: 'Creative',
    evidence: 'Preference for reduced, typographic, high-control visual systems.',
  },
  'Relational Selectivity': {
    label: 'Relational Selectivity',
    relevance: 0.49,
    keywords: ['bandwidth', 'autonomy', 'depth', 'distance'],
    dimension: 'Social',
    evidence: 'Social energy is highly selective and rarely diffused across weak ties.',
  },
}

export const crossValidatedPatterns: CrossValidatedPattern[] = [
  {
    id: 'CVP-001',
    label: 'Build-Abstract-Restart',
    confidence: 0.91,
    sources: ['claude-sessions', 'codex-sessions', 'social-traces'],
    evidence: {
      'claude-sessions':
        'Tools repeatedly begin as concrete utilities, then reappear as cleaner frameworks or protocols.',
      'codex-sessions':
        'Reflection notes frame progress as successive abstraction passes rather than linear completion.',
      'social-traces':
        'Public fragments show recurring announcements of revised systems, renamed architectures, and cleaner restarts.',
    },
    psychologicalInterpretation:
      'Creation tends to move from a specific build into a higher-order model, then restart from that model. This produces originality and coherence, but repeatedly delays final closure.',
    dimension: 'Professional',
    archetypeResonance: ['Architect of Invisible Systems', 'The Integrator'],
  },
  {
    id: 'CVP-002',
    label: 'Dialogic Externalization',
    confidence: 0.86,
    sources: ['claude-sessions', 'codex-sessions', 'social-traces'],
    evidence: {
      'claude-sessions':
        'Reasoning is often scaffolded through prompts, agents, or named interfaces rather than silent internal monologue.',
      'codex-sessions':
        'The Lyra persona is used as an explicit counter-voice for reflection, pressure testing, and reframing.',
      'social-traces':
        'Posts repeatedly stage thought as exchange, invocation, or dialogue rather than declaration.',
    },
    psychologicalInterpretation:
      'Thinking becomes clearer when it is externalized into dialogue. The self reaches precision by creating a second voice, tool, or symbolic counterpart.',
    dimension: 'Psychological',
    archetypeResonance: ['The Seeker', 'The Integrator'],
  },
  {
    id: 'CVP-003',
    label: 'Empirical-Mystical Oscillation',
    confidence: 0.82,
    sources: ['claude-sessions', 'codex-sessions', 'social-traces'],
    evidence: {
      'claude-sessions':
        'Technical and infrastructural decisions coexist with references to metaphysics, idealism, and symbolic meaning.',
      'codex-sessions':
        'Spiritual inquiry appears alongside attempts to model, formalize, and operationalize consciousness.',
      'social-traces':
        'Public traces shift between rigorous implementation talk and explicitly contemplative or philosophical language.',
    },
    psychologicalInterpretation:
      'The profile does not choose between data and intuition; it alternates between them. Meaning emerges from keeping empirical rigor and spiritual receptivity in active tension.',
    dimension: 'Spiritual',
    archetypeResonance: ['The Seeker', 'The Essayist'],
  },
  {
    id: 'CVP-004',
    label: 'Consumption-Production Asymmetry',
    confidence: 0.79,
    sources: ['claude-sessions', 'codex-sessions', 'social-traces'],
    evidence: {
      'claude-sessions':
        'Input volume is structurally higher than published artifact volume, especially in high-complexity domains.',
      'codex-sessions':
        'Notes describe the felt gap between saturation, understanding, and shipping.',
      'social-traces':
        'Public output often appears as fragments, teasers, or prototypes rather than finished works.',
    },
    psychologicalInterpretation:
      'The mind is fed faster than it externalizes. This increases depth and originality, but also creates a standing tension between internal richness and public evidence.',
    dimension: 'Creative',
    archetypeResonance: ['The Essayist', 'Architect of Invisible Systems'],
  },
  {
    id: 'CVP-005',
    label: 'Sovereignty-Body Bridge',
    confidence: 0.76,
    sources: ['claude-sessions', 'codex-sessions', 'social-traces'],
    evidence: {
      'claude-sessions':
        'Work systems repeatedly seek autonomy, but the highest consistency signal appears in bodily routine rather than digital routine.',
      'codex-sessions':
        'Physical discipline is described as the one domain where repetition does not fracture into over-architecture.',
      'social-traces':
        'Fragments imply the body acts as proof that consistency is possible when abstraction is removed.',
    },
    psychologicalInterpretation:
      'The body functions as a bridge between sovereignty and execution. Embodied repetition is the strongest antidote to cognitive fragmentation and can be transferred into knowledge work.',
    dimension: 'Psychological',
    archetypeResonance: ['Architect of Invisible Systems', 'The Integrator'],
  },
  {
    id: 'CVP-006',
    label: 'Sovereignty-as-Core-Value',
    confidence: 0.84,
    sources: ['claude-sessions', 'codex-sessions', 'social-traces'],
    evidence: {
      'claude-sessions':
        'Infrastructure choices favor legibility, ownership, and direct control even when convenience would be higher elsewhere.',
      'codex-sessions':
        'Autonomy is framed not merely as preference but as a non-negotiable condition for good work.',
      'social-traces':
        'Public language repeatedly privileges independence, self-direction, and refusal of unnecessary mediation.',
    },
    psychologicalInterpretation:
      'Autonomy is not decorative in this profile; it is a central organizing value. The psyche protects room to think and build without external compression.',
    dimension: 'Professional',
    archetypeResonance: ['Architect of Invisible Systems', 'The Seeker'],
  },
]

export const archetypeMapping = {
  dominant: {
    archetype: 'Architect of Invisible Systems',
    manifestation:
      'Builds structures, naming systems, and operating grammars that outlast any single project.',
    shadow:
      'Can retreat into architecture itself, postponing contact with messier forms of completion and exposure.',
    confidence: 0.88,
    evidence:
      'Across tools, notes, and public traces, the recurrent impulse is to define substrate before surface.',
  },
  secondary: {
    archetype: 'The Seeker',
    manifestation:
      'Moves toward metaphysical, psychological, and symbolic depth rather than settling for purely instrumental answers.',
    shadow:
      'Depth-seeking can become perpetual pilgrimage, making arrival feel suspicious or premature.',
    confidence: 0.79,
    evidence:
      'Philosophy, consciousness, and meaning-making are treated as live operational questions, not side interests.',
  },
  emergent: {
    archetype: 'The Integrator',
    manifestation:
      'Begins to braid engineering, aesthetics, consciousness work, and public articulation into one coherent practice.',
    shadow:
      'Integration can remain conceptual unless it is forced into a finished artifact with real boundaries.',
    confidence: 0.74,
    evidence:
      'Recent projects increasingly combine multiple previous threads instead of keeping them in separate silos.',
  },
  goldenShadow: {
    archetype: 'The Essayist',
    manifestation:
      'A public voice capable of turning systems, psyche, and lived experience into lucid long-form thought.',
    shadow:
      'This figure is admired at a distance and therefore risks remaining projected rather than inhabited.',
    confidence: 0.72,
    evidence:
      'Writing potential appears repeatedly, but the most visible outputs still privilege systems over explicit authorship.',
  },
}

export const dimensionalScores: Record<string, DimensionalScore> = {
  Psychological: {
    score: 0.82,
    depth: 0.82,
    convergence:
      'High meta-cognitive awareness, explicit pattern observation, and strong capacity to model one’s own internal dynamics.',
    blindSpot:
      'Reflection can become recursive and delay action when inner clarity is pursued past practical sufficiency.',
    keyFindings: ['High self-observation', 'Shadow literacy present', 'Embodied counter-pattern exists'],
  },
  Spiritual: {
    score: 0.76,
    depth: 0.76,
    convergence:
      'Meaning, consciousness, and metaphysical framing are not ornamental; they are active drivers of inquiry and identity formation.',
    blindSpot:
      'Spiritual breadth can widen faster than integration, producing fertile but unresolved symbolic excess.',
    keyFindings: ['Idealist metaphysics interest', 'Contemplative inquiry', 'Meaning orientation is strong'],
  },
  Anthropological: {
    score: 0.6,
    depth: 0.6,
    convergence:
      'The self is often interpreted through rituals, roles, stories, and cultural systems rather than isolated traits alone.',
    blindSpot:
      'Broader social worlds are often interpreted analytically before they are inhabited relationally.',
    keyFindings: ['Narrative framing', 'Role-based identity', 'Cultural pattern awareness'],
  },
  Social: {
    score: 0.47,
    depth: 0.47,
    convergence:
      'Relational style is selective, depth-seeking, and low-noise rather than expansive or high-frequency.',
    blindSpot:
      'Sophisticated autonomy systems reduce friction, but they also lower exposure to the unpredictability that grows social range.',
    keyFindings: ['Selective bandwidth', 'High autonomy', 'Low weak-tie density'],
  },
  Creative: {
    score: 0.72,
    depth: 0.72,
    convergence:
      'Creative energy is strongest where naming, atmosphere, and cross-domain reframing converge into a distinct formal language.',
    blindSpot:
      'Editing and completion still lag behind ideation and aesthetic system building.',
    keyFindings: ['Strong aesthetic restraint', 'Cross-domain transfer', 'Fragment-to-system tendency'],
  },
  Professional: {
    score: 0.9,
    depth: 0.9,
    convergence:
      'Professional identity is highly structured around systems, tools, leverage, and durable operating logic.',
    blindSpot:
      'The system can become more mature than the shipped artifact, creating an imbalance between infrastructure and publication.',
    keyFindings: ['Infrastructure-first', 'Protocol thinking', 'Sovereignty as operating principle'],
  },
}

export const allPotentials: Potential[] = [
  {
    rank: 1,
    label: 'Long-form Philosophical Writing',
    state: 'Latent',
    description:
      'A sustained essayistic voice that can translate systems, psyche, and metaphysics into public language with clarity and atmosphere.',
    confidence: 0.86,
    crossSourceValidation:
      'Appears in the archetypal profile, the narrative arc, and the repeated tension between depth of thought and low publication volume.',
    actionable:
      'Ship one finished essay with a fixed maximum length and no architecture pass after the first full draft.',
  },
  {
    rank: 2,
    label: 'Protocol Entrepreneurship',
    state: 'Emerging',
    description:
      'The ability to turn protocol thinking into a productized or studio-level practice instead of leaving it as internal architecture.',
    confidence: 0.82,
    crossSourceValidation:
      'Supported by recurring protocol design, infrastructure competence, and the drive to create systems that others can enter.',
    actionable:
      'Package one protocol as a public offer: name it, define the boundary, and ship a minimal entry point.',
  },
  {
    rank: 3,
    label: 'Consciousness Research Practice',
    state: 'Latent',
    description:
      'A hybrid inquiry practice combining contemplative, phenomenological, and technical lenses around mind and experience.',
    confidence: 0.78,
    crossSourceValidation:
      'Strengthened by the spiritual dimension, the seeker archetype, and repeated references to consciousness-oriented frameworks.',
    actionable:
      'Publish a small monthly note that connects one philosophical idea to one concrete technical or lived observation.',
  },
  {
    rank: 4,
    label: 'Photography Worldbuilding',
    state: 'Emerging',
    description:
      'An atmospheric visual language capable of becoming a parallel body of work rather than an occasional aesthetic side channel.',
    confidence: 0.74,
    crossSourceValidation:
      'Supported by social traces around Stillframe, the creative dimension, and the recurring theme of aesthetic restraint.',
    actionable:
      'Build a five-image micro-series around one narrative mood instead of waiting for a complete project identity.',
  },
  {
    rank: 5,
    label: 'AI Studio Practice',
    state: 'Sabotaged',
    description:
      'A coherent public-facing practice around agents, cognition, and human-tool dialogue that is currently dispersed across too many prototypes.',
    confidence: 0.8,
    crossSourceValidation:
      'Visible across tool-building, dialogic externalization, and convergence motifs, but repeatedly diluted by restarts.',
    actionable:
      'Choose one surface for thirty days and let every experiment collapse into that single public container.',
  },
]

export const narrativeArc: NarrativeArc = {
  currentChapter: 'The Throughline',
  description:
    'Previously separate lines of work are now close enough to become one public artifact: systems, psyche, aesthetics, and consciousness no longer need separate containers.',
  previousChapters: [
    'The Engineer (systems, reliability, industrial logic)',
    'The Artist (image, atmosphere, staged perception)',
    'The Builder (tools, protocols, infrastructure)',
    'The Seeker (metaphysics, consciousness, inward depth)',
    'The Simplifier (leverage, cost, simplification)',
  ],
  tensionPoint:
    'The convergence requires shipping, not another architecture pass. The unresolved conflict is between the elegance of the system and the vulnerability of the finished artifact.',
  possibleResolutions: [
    'Ship a single synthesis artifact that binds writing, system design, and psychological modeling.',
    'Turn one internal protocol into a public studio or product surface with clear boundaries.',
    'Use long-form writing as the integration layer instead of waiting for perfect infrastructure.',
  ],
}

const COGNITIVE_PATTERN_LIBRARY = {
  'claude-sessions': [
    {
      label: 'Infrastructure-First',
      kind: 'systematic',
      confidence: 0.85,
      evidence: 'Architecture and protocol layers appear before interface polish.',
    },
    {
      label: 'Build-Abstract-Restart',
      kind: 'systematic',
      confidence: 0.91,
      evidence: 'Projects recur as cleaner higher-order restarts.',
    },
  ],
  'codex-sessions': [
    {
      label: 'Dialogic Externalization',
      kind: 'metacognitive',
      confidence: 0.86,
      evidence: 'Reflection sharpens when a counterpart voice is invoked.',
    },
    {
      label: 'Empirical-Mystical Oscillation',
      kind: 'intuitive',
      confidence: 0.82,
      evidence: 'Spiritual and analytical modes actively alternate.',
    },
  ],
  'social-traces': [
    {
      label: 'Aesthetic Compression',
      kind: 'divergent',
      confidence: 0.73,
      evidence: 'Public fragments trend toward atmosphere, naming, and compressed signals.',
    },
    {
      label: 'Consumption-Production Asymmetry',
      kind: 'metacognitive',
      confidence: 0.79,
      evidence: 'Visible output remains lower than internal accumulation.',
    },
  ],
} as const

const CYCLE_LIBRARY = {
  'claude-sessions': [
    {
      kind: 'project',
      label: 'Build-Abstract-Restart',
      trigger: 'Architectural insight',
      outcome: 'Cleaner but delayed public artifact',
      frequency: 'High',
      confidence: 0.88,
    },
  ],
  'codex-sessions': [
    {
      kind: 'reflection',
      label: 'Burst-Process-Burst',
      trigger: 'Intense creation phase',
      outcome: 'Pause, integration, then renewed synthesis',
      frequency: 'High',
      confidence: 0.81,
    },
  ],
  'social-traces': [
    {
      kind: 'public-output',
      label: 'Fragment-to-System',
      trigger: 'Shareable prototype or phrase',
      outcome: 'Reframed into broader operating language',
      frequency: 'Moderate',
      confidence: 0.7,
    },
  ],
} as const

function pickEntities(names: string[]): Entity[] {
  return names.map(name => ENTITY_LIBRARY[name])
}

function pickThemes(labels: string[]): Theme[] {
  return labels.map(label => THEME_LIBRARY[label])
}

function createExtraction(config: {
  source: 'claude-sessions' | 'codex-sessions' | 'social-traces'
  documentsAnalyzed: number
  entityNames: string[]
  themeLabels: string[]
}): Extraction {
  return {
    source: config.source,
    documentsAnalyzed: config.documentsAnalyzed,
    entities: pickEntities(config.entityNames),
    themes: pickThemes(config.themeLabels),
    emotionalTone: {
      valence: 0.12,
      arousal: 0.58,
      dominantEmotion: 'Curiosity',
      secondaryEmotions: ['Resolve', 'Restlessness'],
    },
    cognitivePatterns: [...COGNITIVE_PATTERN_LIBRARY[config.source]],
    selfSabotageIndicators: [],
    projections: [],
    cycles: [...CYCLE_LIBRARY[config.source]],
    potentials: [],
    dimensionalScores,
    connections: [],
    cognitiveGenomeEvidence: {},
  }
}

export const claudeSessions = createExtraction({
  source: 'claude-sessions',
  documentsAnalyzed: 41,
  entityNames: ['PSYCHE/OS', 'Loom', 'Claude Code', 'Civic Mesh', 'Tailscale'],
  themeLabels: ['Tool Sovereignty', 'Protocol Design', 'Cross-domain Synthesis'],
})

export const codexSessions = createExtraction({
  source: 'codex-sessions',
  documentsAnalyzed: 33,
  entityNames: ['Lyra', 'Jung', 'Bateson', 'Corrections Practice'],
  themeLabels: ['Consciousness Inquiry', 'Narrative Identity', 'Embodied Discipline'],
})

export const socialTraces = createExtraction({
  source: 'social-traces',
  documentsAnalyzed: 29,
  entityNames: ['Stillframe', 'Northstar Studio', 'Beacon Protocol'],
  themeLabels: ['Aesthetic Restraint', 'Relational Selectivity'],
})

export const extractions: Extraction[] = [claudeSessions, codexSessions, socialTraces]

export const allEntities = extractions.flatMap(e => e.entities)
export const allThemes = extractions.flatMap(e => e.themes)
export const allPatterns = extractions.flatMap(e => e.cognitivePatterns)
export const allCycles = extractions.flatMap(e => e.cycles)

export const allConnections: Connection[] = [
  { from: 'PSYCHE/OS', to: 'Build-Abstract-Restart', relationship: 'embodies' },
  { from: 'PSYCHE/OS', to: 'Cross-domain Synthesis', relationship: 'organizes' },
  { from: 'Loom', to: 'Tool Sovereignty', relationship: 'supports' },
  { from: 'Loom', to: 'Architect of Invisible Systems', relationship: 'resonates' },
  { from: 'Claude Code', to: 'Dialogic Externalization', relationship: 'amplifies' },
  { from: 'Civic Mesh', to: 'Protocol Entrepreneurship', relationship: 'points toward' },
  { from: 'Lyra', to: 'Dialogic Externalization', relationship: 'instantiates' },
  { from: 'Jung', to: 'Narrative Identity', relationship: 'frames' },
  { from: 'Bateson', to: 'Empirical-Mystical Oscillation', relationship: 'feeds' },
  { from: 'Corrections Practice', to: 'Failure-Driven Learning', relationship: 'substantiates' },
  { from: 'Stillframe', to: 'Aesthetic Restraint', relationship: 'expresses' },
  { from: 'Northstar Studio', to: 'Cross-domain Synthesis', relationship: 'compresses' },
  { from: 'Beacon Protocol', to: 'Dialogic Externalization', relationship: 'formalizes' },
  { from: 'Protocol Design', to: 'Protocol Entrepreneurship', relationship: 'enables' },
  { from: 'Consciousness Inquiry', to: 'Consciousness Research Practice', relationship: 'matures into' },
  { from: 'Embodied Discipline', to: 'Sovereignty-Body Bridge', relationship: 'grounds' },
  { from: 'Aesthetic Restraint', to: 'Photography Worldbuilding', relationship: 'shapes' },
  { from: 'Relational Selectivity', to: 'Sovereignty-as-Core-Value', relationship: 'echoes' },
  { from: 'Cross-domain Synthesis', to: 'AI Studio Practice', relationship: 'wants expression through' },
  { from: 'Narrative Identity', to: 'The Essayist', relationship: 'calls forth' },
  { from: 'Consciousness Inquiry', to: 'The Seeker', relationship: 'animates' },
  { from: 'Cross-domain Synthesis', to: 'The Integrator', relationship: 'strengthens' },
]

export const cognitiveGenomePrimitives = [
  { name: 'Abstraction Descent', value: 0.78, kind: 'systematic' },
  { name: 'Fractal Transfer', value: 0.71, kind: 'divergent' },
  { name: 'Failure-Driven Learning', value: 0.83, kind: 'metacognitive' },
  { name: 'Infrastructure-First', value: 0.74, kind: 'systematic' },
  { name: 'Naming-as-Cognition', value: 0.58, kind: 'divergent' },
  { name: 'Empirical-Mystical', value: 0.65, kind: 'intuitive' },
  { name: 'Cost-Conscious', value: 0.69, kind: 'analytical' },
  { name: 'Burst-Process-Burst', value: 0.52, kind: 'divergent' },
]

export const neurodivergenceIndicators: import('./types').NeurodivergenceIndicator[] = [
  {
    label: 'ADHD-adjacent patterns',
    dimension: 'Attention & Executive Function',
    markers: [
      {
        marker: 'Burst-Process-Burst rhythm',
        evidence: 'All three sources confirm a multi-day oscillation between intense creation and disengagement. This resembles hyperfocus-crash cycles documented in ADHD literature.',
        strength: 0.68,
      },
      {
        marker: 'High novelty-seeking with project restarts',
        evidence: 'The Build-Abstract-Restart pattern (CVP-001, confidence 0.91) shows repeated project reinitiation. Six identifiable life phases each involve domain shifts. This overlaps with ADHD novelty preference but also with creative temperament.',
        strength: 0.62,
      },
      {
        marker: 'Last-mile completion difficulty',
        evidence: 'Consumption-Production Asymmetry (CVP-004) and the narrative tension point both describe a gap between internal richness and shipped artifacts. The Sabotaged potential (AI Studio Practice) shows high capability dispersed across prototypes.',
        strength: 0.58,
      },
      {
        marker: 'Domain-switching acceleration',
        evidence: 'Life phases show progressively faster domain transitions: engineering (6yr), digital (3yr), builder (2yr), artist (2yr), seeker (1yr), convergence (ongoing). This acceleration is consistent with novelty-seeking but also with polymath learning curves.',
        strength: 0.45,
      },
    ],
    overallStrength: 0.58,
    caveat: 'Burst-process-burst is also documented in creative professionals without ADHD (Wallas, 1926). Project restarts may reflect genuine architectural insight rather than impulsivity. Completion difficulty correlates with perfectionism and high standards, not exclusively with executive dysfunction.',
    differentialNotes: 'The profile shows HIGH consistency in physical discipline (0.90 across all sources), which is atypical for clinical ADHD where inconsistency tends to be domain-general. The selectivity of the attention pattern (strong in body domain, variable in knowledge work) suggests a more nuanced picture than standard ADHD presentation.',
    references: [
      { author: 'Barkley, R.A.', work: 'ADHD and the Nature of Self-Control', year: '1997', detail: 'Executive function model of ADHD and temporal discounting.' },
      { author: 'Brown, T.E.', work: 'A New Understanding of ADHD in Children and Adults', year: '2013', detail: 'Executive function impairments across six clusters.' },
      { author: 'Hoogman, M. et al.', work: 'Brain Imaging of the Cortex in ADHD', year: '2019', detail: 'Meta-analysis of structural brain differences in ADHD (Lancet Psychiatry).' },
      { author: 'White, H.A. & Shah, P.', work: 'Creative Style and Achievement in Adults with ADHD', year: '2011', detail: 'Divergent thinking advantages in ADHD populations.' },
    ],
  },
  {
    label: 'Autism spectrum-adjacent patterns',
    dimension: 'Systematizing & Social Processing',
    markers: [
      {
        marker: 'Infrastructure-first systematizing',
        evidence: 'The cognitive genome shows Infrastructure-First as a core primitive (0.74). Projects consistently begin with architecture, protocols, and naming systems before surface implementation. This systematic approach is consistent with Baron-Cohen\'s systematizing quotient.',
        strength: 0.65,
      },
      {
        marker: 'Deep interest accumulation with expertise depth',
        evidence: 'Each life phase shows deep immersion: mechanical engineering, AI systems, photography aesthetics, consciousness philosophy. The depth within each domain goes well beyond casual interest.',
        strength: 0.55,
      },
      {
        marker: 'Social selectivity and low weak-tie density',
        evidence: 'Social dimension scores lowest (0.47). Relational Selectivity theme confirms "social energy is highly selective and rarely diffused across weak ties." Dunbar number appears structurally low.',
        strength: 0.52,
      },
      {
        marker: 'Naming-as-Cognition: explicit systematizing of experience',
        evidence: 'The Naming-as-Cognition primitive (0.58) and protocol design theme suggest a preference for making implicit knowledge explicit through formal systems.',
        strength: 0.48,
      },
    ],
    overallStrength: 0.52,
    caveat: 'Systematizing is also characteristic of engineering training and practice. Social selectivity correlates with introversion (Big Five Extraversion: 0.35) without requiring an ASD explanation. Deep interests are common in high-openness profiles (Big Five Openness: 0.92). Many "autistic traits" in behavioral data are indistinguishable from introversion + high intelligence + engineering training.',
    differentialNotes: 'The profile shows FLEXIBLE domain-switching (6 life phases with genuine pivots), which is atypical for restrictive/repetitive behavior patterns in ASD. Social engagement, while selective, shows capacity for deep relational engagement when activated. The Dialogic Externalization pattern suggests comfort with symbolic social interaction (agents, personas) that differs from typical ASD social processing difficulties.',
    references: [
      { author: 'Baron-Cohen, S.', work: 'The Essential Difference', year: '2003', detail: 'Empathizing-systematizing theory and the extreme male brain hypothesis.' },
      { author: 'Happé, F. & Frith, U.', work: 'The Weak Coherence Account', year: '2006', detail: 'Detail-focused processing style in autism (Journal of Autism and Developmental Disorders).' },
      { author: 'Lai, M.C. et al.', work: 'Quantifying and Exploring Camouflaging in Men and Women with Autism', year: '2017', detail: 'Masking and compensation strategies in high-functioning autism.' },
      { author: 'Ruzich, E. et al.', work: 'Measuring Autistic Traits in the General Population', year: '2015', detail: 'AQ scores are continuously distributed, not bimodal (PLOS ONE).' },
    ],
  },
  {
    label: 'Giftedness indicators',
    dimension: 'Cognitive Intensity & Overexcitabilities',
    markers: [
      {
        marker: 'Intellectual overexcitability',
        evidence: 'High Openness (0.92), cross-domain synthesis as a core pattern, and the Empirical-Mystical oscillation all point to Dabrowski\'s intellectual overexcitability: an intense drive to understand, question, and seek truth across domains.',
        strength: 0.72,
      },
      {
        marker: 'Imaginational overexcitability',
        evidence: 'The photography practice (Stillframe), atmospheric aesthetics, and naming-as-cognition suggest rich inner imagery and a strong capacity for metaphorical thinking.',
        strength: 0.58,
      },
      {
        marker: 'Existential concerns and meaning-seeking',
        evidence: 'The Seeker archetype (0.79), Consciousness Inquiry theme, and Spiritual dimension depth (0.76) all show sustained existential engagement beyond what circumstance requires. This is characteristic of gifted adults.',
        strength: 0.67,
      },
      {
        marker: 'Rapid cross-domain transfer',
        evidence: 'Fractal Transfer primitive (0.71) and the Cross-domain Synthesis theme (0.88) confirm a pattern of applying insights from one domain to another, a hallmark of high general intelligence.',
        strength: 0.64,
      },
      {
        marker: 'Asynchronous development',
        evidence: 'Professional dimension (0.90) far exceeds Social dimension (0.47). Physical discipline is highly developed while project completion is inconsistent. This asymmetry is characteristic of asynchronous development in giftedness.',
        strength: 0.56,
      },
    ],
    overallStrength: 0.63,
    caveat: 'Overexcitabilities also appear in highly creative individuals who may not meet formal giftedness criteria. Existential concerns increase with education and philosophical exposure regardless of cognitive ability. Cross-domain transfer can reflect breadth of experience rather than exceptional processing speed.',
    differentialNotes: 'The IQ estimate from behavioral patterns (provided separately in the dashboard) gives additional context. Giftedness is typically defined by IQ > 130, but the behavioral markers here are observable regardless of formal testing. The combination of high abstraction + cross-domain transfer + existential engagement is suggestive but not conclusive without psychometric data.',
    references: [
      { author: 'Dabrowski, K.', work: 'Positive Disintegration', year: '1964', detail: 'Theory of overexcitabilities and developmental potential in gifted individuals.' },
      { author: 'Webb, J.T. et al.', work: 'Misdiagnosis and Dual Diagnoses of Gifted Children and Adults', year: '2005', detail: 'How giftedness mimics ADHD, ASD, and mood disorders.' },
      { author: 'Silverman, L.K.', work: 'Giftedness 101', year: '2012', detail: 'Asynchronous development and the lived experience of giftedness.' },
      { author: 'Rinn, A.N. & Bishop, J.', work: 'Gifted Adults: A Systematic Review and Analysis of the Literature', year: '2015', detail: 'Meta-review of gifted adult characteristics and outcomes.' },
    ],
  },
  {
    label: 'High Sensitivity (HSP) patterns',
    dimension: 'Sensory Processing & Depth of Processing',
    markers: [
      {
        marker: 'Deep processing of information',
        evidence: 'Consumption-Production Asymmetry (CVP-004) confirms that input is processed more deeply than it is externalized. The mind saturates before shipping. This depth-of-processing is a core HSP trait per Aron\'s model.',
        strength: 0.6,
      },
      {
        marker: 'Aesthetic sensitivity',
        evidence: 'Aesthetic Restraint theme (0.76), the photography practice emphasizing atmosphere and composition, and preference for "reduced, typographic, high-control visual systems" all suggest heightened aesthetic processing.',
        strength: 0.62,
      },
      {
        marker: 'Need for autonomy and low-stimulation environments',
        evidence: 'Sovereignty-as-Core-Value (CVP-006, 0.84) and the preference for owned infrastructure over noisy platforms suggest a need to control environmental input, consistent with HSP overstimulation management.',
        strength: 0.5,
      },
    ],
    overallStrength: 0.55,
    caveat: 'Aesthetic sensitivity and deep processing are also features of high Openness (which scores 0.92 in this profile). The preference for controlled environments may reflect introversion or engineering mindset rather than sensory sensitivity. HSP overlaps heavily with introversion and neuroticism, making it difficult to distinguish from personality traits alone.',
    differentialNotes: 'HSP (Sensory Processing Sensitivity) is a temperament trait present in ~15-20% of the population, not a clinical diagnosis. It correlates with but is distinct from introversion and neuroticism. The evidence here is moderate — the sovereignty preference and aesthetic sensitivity are suggestive, but the profile also shows tolerance for high-intensity technical work, which is less typical of high-HSP profiles.',
    references: [
      { author: 'Aron, E.N.', work: 'The Highly Sensitive Person', year: '1996', detail: 'Foundational description of sensory processing sensitivity as a temperament trait.' },
      { author: 'Aron, E.N. et al.', work: 'Sensory Processing Sensitivity: A Review in the Light of the Evolution of Biological Responsivity', year: '2012', detail: 'Updated theoretical framework connecting SPS to differential susceptibility.' },
      { author: 'Pluess, M.', work: 'Individual Differences in Environmental Sensitivity', year: '2015', detail: 'Vantage sensitivity model — sensitivity to positive environments, not just negative.' },
    ],
  },
]

export const neurodivergenceOverlapAnalysis = 'The four dimensions analyzed here overlap substantially. ADHD and giftedness share novelty-seeking, rapid ideation, and intensity. ASD and giftedness share systematizing, deep interests, and social selectivity. HSP overlaps with all three through deep processing and sensitivity. This is why differential diagnosis requires professional assessment: the same behavioral pattern (e.g., project restarts) can have entirely different underlying mechanisms (impulsivity vs. perfectionism vs. boredom from mastery). In this profile, the strongest convergent signal is across the giftedness and ADHD-adjacent dimensions, which is consistent with the "twice-exceptional" (2e) literature where high cognitive ability coexists with executive function variability.'

export const neurodivergenceSummary = 'The behavioral profile shows moderate-to-strong indicators of intellectual giftedness (overexcitabilities, cross-domain transfer, existential depth) and moderate ADHD-adjacent patterns (burst rhythms, novelty-seeking, completion difficulty). Autism spectrum and HSP indicators are present but weaker and largely explainable by introversion, engineering training, and high Openness. The overall picture is more consistent with a gifted/2e profile than with any single clinical neurodivergent condition, but formal assessment would be needed to confirm or refute this.'

export const DIMENSION_COLORS: Record<string, string> = {
  Psychological: '#9f4a34',
  Spiritual: '#82654b',
  Anthropological: '#a77c58',
  Social: '#8c8272',
  Creative: '#5f6e58',
  Professional: '#4e5f63',
}
