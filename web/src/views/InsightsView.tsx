import { SectionHead, Expandable, TwoCol, Cite, References, ConfidenceBar, ExploreButton } from '../components/shared'
import { directionalVector } from '../data/loader'

const BIG_FIVE = [
  { trait: 'Openness', score: 0.92, note: 'Wide-ranging curiosity; philosophical and cross-domain thinking come naturally' },
  { trait: 'Conscientiousness', score: 0.58, note: 'Strong discipline in embodied practices; building rhythm in knowledge work' },
  { trait: 'Extraversion', score: 0.35, note: 'Depth orientation; recharges through solitude and focused, uninterrupted work' },
  { trait: 'Agreeableness', score: 0.52, note: 'Strong self-direction; genuinely collaborative when values and purpose align' },
  { trait: 'Neuroticism', score: 0.48, note: 'Rich inner emotional life; uses structure and somatic practice as grounding' },
]

const DAILY_PHASES = [
  { label: 'Contemplative', start: 6, end: 9, color: 'bg-violet-500/30' },
  { label: 'Technical', start: 9, end: 14, color: 'bg-indigo-500/30' },
  { label: 'Mixed', start: 14, end: 19, color: 'bg-slate-500/30' },
  { label: 'Decompression', start: 19, end: 23, color: 'bg-slate-700/30' },
]

const LIFE_PHASES = [
  {
    label: 'The Engineer',
    period: '2012-2018',
    color: 'bg-slate-500',
    description: 'Mechanical/management engineering foundation. Structured thinking, industrial domain immersion.',
    dominant: 'Systematic, analytical',
    underdeveloped: 'Creative, spiritual',
  },
  {
    label: 'The Digital Transition',
    period: '2018-2021',
    color: 'bg-blue-500',
    description: 'Shift from pure engineering to software development. Deep learning exploration. Self-taught coding.',
    dominant: 'Systematic + emerging divergent',
    keyEvent: 'Discovery of AI as amplifier',
  },
  {
    label: 'The Builder',
    period: '2021-2023',
    color: 'bg-indigo-500',
    description: 'Full immersion in agentic AI systems. Loom iterations, Signal Foundry, infrastructure proliferation.',
    dominant: 'Infrastructure-first, burst-process-burst',
    emerging: 'Naming-as-cognition',
  },
  {
    label: 'The Artist',
    period: '2022-2024',
    color: 'bg-violet-500',
    description: 'Stillframe photography practice. Exhibitions, Crewdson aesthetic.',
    dominant: 'Creative + empirical-mystical oscillation begins',
    keyTension: 'Engineering vs. art identity',
  },
  {
    label: 'The Seeker',
    period: '2024-2025',
    color: 'bg-purple-500',
    description: 'Deep philosophical turn. Bateson, Vedanta, gnosticism. A long season of wide absorption and inner integration.',
    dominant: 'Empirical-mystical, abstraction descent',
    note: 'Inner richness growing; social depth slowly opening',
  },
  {
    label: 'The Throughline',
    period: '2025-present',
    color: 'bg-emerald-500',
    description: 'PSYCHE/OS, Northstar Studio, Civic Mesh. All threads beginning to unify.',
    keyTension: 'Completion vs. further abstraction',
    note: 'All 8 cognitive primitives active',
  },
]

const DIMENSION_EVOLUTION = [
  { dimension: 'Professional', trajectory: 'Steadily rising, foundational', level: 0.85 },
  { dimension: 'Creative', trajectory: 'Emerged mid-timeline, plateaued', level: 0.65 },
  { dimension: 'Psychological', trajectory: 'Deepening, especially metacognitive awareness', level: 0.78 },
  { dimension: 'Spiritual', trajectory: 'Late emergence, now strong', level: 0.72 },
  { dimension: 'Social', trajectory: 'Slowly opening; quality of connection valued over quantity', level: 0.42 },
  { dimension: 'Anthropological', trajectory: 'Moderate, stable', level: 0.55 },
]

function Practice({ text }: { text: string }) {
  return (
    <div className="border-l-2 border-indigo-400 pl-4 mt-3">
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--accent)]">Practice</span>
      <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">{text}</p>
    </div>
  )
}

function TraitBar({ trait, score, note }: { trait: string; score: number; note: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-[color:var(--ink)]">{trait}</span>
        <span className="text-xs tabular-nums text-[color:var(--ink-faint)]">{Math.round(score * 100)}%</span>
      </div>
      <ConfidenceBar value={score} />
      <p className="text-xs text-[color:var(--ink-faint)]">{note}</p>
    </div>
  )
}

function DailyRhythmBar() {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-[color:var(--ink)]">Daily Rhythm</h4>
      <div className="flex h-8 w-full overflow-hidden rounded-md">
        {DAILY_PHASES.map((phase) => {
          const width = ((phase.end - phase.start) / 17) * 100
          return (
            <div key={phase.label} className={`${phase.color} flex items-center justify-center`} style={{ width: `${width}%` }}>
              <span className="text-[10px] text-[color:var(--ink-soft)]">{phase.label}</span>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-[10px] text-[color:var(--ink-faint)]">
        <span>6:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
      </div>
    </div>
  )
}

function DirectionalVectorSection() {
  if (!directionalVector) return null
  const { axes, heading, constraints, attractors, antiVectors, nextExperimentSurfaces } = directionalVector

  return (
    <section>
      <SectionHead
        title="Directional Vector"
        subtitle={directionalVector.summary}
      />

      {/* Heading: from → through → toward */}
      <div className="rounded-lg border border-slate-700/60 bg-[color:var(--panel)] p-5 space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--ink-faint)]">From</span>
            <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed">{heading.from}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--accent)]">Through</span>
            <p className="text-sm text-[color:var(--ink)] leading-relaxed font-medium">{heading.through}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[color:var(--ink-faint)]">Toward</span>
            <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed">{heading.toward}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 pt-2 border-t border-[color:var(--line)]">
          <ConfidenceBar value={heading.confidence} />
          <span className="text-[10px] text-[color:var(--ink-faint)] shrink-0">{Math.round(heading.confidence * 100)}% confidence</span>
        </div>
      </div>

      {/* Axes */}
      <div className="space-y-2 mb-6">
        {axes.map((axis) => (
          <div key={axis.axis} className="rounded-md border border-slate-700/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[color:var(--ink)]">{axis.axis}</span>
              <div className="flex items-center gap-2 text-[10px] text-[color:var(--ink-faint)]">
                <span>current: {axis.current > 0 ? '+' : ''}{axis.current.toFixed(2)}</span>
                <span className={axis.recommendedDrift > 0 ? 'text-emerald-500/80' : 'text-amber-500/80'}>
                  drift: {axis.recommendedDrift > 0 ? '+' : ''}{axis.recommendedDrift.toFixed(2)}
                </span>
              </div>
            </div>
            {/* Axis bar */}
            <div className="relative h-2 rounded-full bg-[color:var(--panel)] overflow-visible">
              {/* Current position */}
              <div
                className="absolute top-0 h-2 w-2 rounded-full bg-[color:var(--accent)]"
                style={{ left: `${((axis.current + 1) / 2) * 100}%`, transform: 'translateX(-50%)' }}
              />
              {/* Recommended position */}
              <div
                className="absolute top-0 h-2 w-2 rounded-full border-2 border-emerald-500/80 bg-transparent"
                style={{ left: `${((axis.current + axis.recommendedDrift + 1) / 2) * 100}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[color:var(--ink-faint)]">
              <span>{axis.leftPole}</span>
              <span>{axis.rightPole}</span>
            </div>
            <p className="text-xs text-[color:var(--ink-faint)] leading-relaxed">{axis.rationale}</p>
          </div>
        ))}
      </div>

      {/* Constraints, Attractors, Anti-Vectors */}
      <div className="space-y-2">
        <Expandable title="Constraints" summary={`${constraints.length} forces limiting movement`}>
          <ul className="space-y-1.5">
            {constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500/70 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs text-[color:var(--ink-soft)] leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </Expandable>

        <Expandable title="Attractors" summary={`${attractors.length} forces pulling toward growth`}>
          <ul className="space-y-1.5">
            {attractors.map((a, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500/70 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs text-[color:var(--ink-soft)] leading-relaxed">{a}</span>
              </li>
            ))}
          </ul>
        </Expandable>

        <Expandable title="Anti-Vectors" summary={`${antiVectors.length} directions to avoid`}>
          <ul className="space-y-1.5">
            {antiVectors.map((av, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400/70 text-xs mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-xs text-[color:var(--ink-soft)] leading-relaxed">{av}</span>
              </li>
            ))}
          </ul>
        </Expandable>

        {nextExperimentSurfaces.length > 0 && (
          <Expandable title="Experiment Surfaces" summary={`${nextExperimentSurfaces.length} areas to test next`} defaultOpen>
            <div className="space-y-3">
              {nextExperimentSurfaces.map((exp) => (
                <div key={exp.surface} className="border-l-2 border-indigo-400/40 pl-4 space-y-1">
                  <span className="text-xs font-medium text-[color:var(--ink)]">{exp.surface}</span>
                  <p className="text-xs text-[color:var(--ink-faint)] leading-relaxed">{exp.whyThisSurface}</p>
                  <div className="flex gap-4 text-[10px]">
                    <span><span className="text-emerald-500/70 uppercase tracking-wider">Success:</span> {exp.successSignal}</span>
                    <span><span className="text-red-400/70 uppercase tracking-wider">Failure:</span> {exp.failureSignal}</span>
                  </div>
                </div>
              ))}
            </div>
          </Expandable>
        )}
      </div>
    </section>
  )
}

export default function InsightsView() {
  return (
    <div className="space-y-20">

      {/* ── Breathing pause ─────────────────────────────────────── */}
      <div className="breath-pause">
        <p className="breath-pause-text">
          Prima di leggere,<br />
          <em>respira.</em>
        </p>
        <p className="breath-pause-sub">
          Questi dati descrivono tendenze osservate — non verità immutabili.
          Leggi con curiosità, non con giudizio.
        </p>
      </div>

      {/* Directional Vector */}
      <DirectionalVectorSection />

      {/* Growth Vectors */}
      <section>
        <SectionHead
          title="Growth Vectors"
          subtitle="Personalized development paths derived from your cognitive profile. Each vector is grounded in peer-reviewed psychological research."
        />
        <div className="space-y-2">
          <Expandable
            renderTitle={<div className="flex items-center gap-3"><span className="text-sm font-medium text-[color:var(--ink)]">Integration Over Completion</span></div>}
            explore={<ExploreButton finding="Integration Over Completion" context="Leverage natural integration capacity by constraining the shipping window." />}
            summary="Leverage natural integration capacity by constraining the shipping window."
          >
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              The Build-Abstract-Restart pattern reveals a cognitive style that thrives in early-phase creation but struggles with the final 10%. Rather than pathologizing non-completion, the strategy is to leverage your natural integration capacity by constraining the window.
            </p>
            <Practice text="Time-boxed shipping: set a hard deadline and ship whatever exists at that point. The constraint externalizes the Editor Function that otherwise blocks release." />
            <References>
              <Cite author="Winnicott, D.W." work="Playing and Reality" year="1971" detail="The 'good enough' concept applied to creative output." />
              <Cite author="Schwartz, B." work="The Paradox of Choice" year="2004" detail="Satisficing vs. maximizing research." />
            </References>
          </Expandable>

          <Expandable
            renderTitle={<div className="flex items-center gap-3"><span className="text-sm font-medium text-[color:var(--ink)]">Shadow Dialogue</span></div>}
            explore={<ExploreButton finding="Shadow Dialogue" context="Engage the unlived creative life through raw, unstructured expression." />}
            summary="Engage the unlived creative life through raw, unstructured expression."
          >
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              The Golden Shadow archetype (Philosophical Writer) represents the unlived creative life. This potential is consistently high-confidence across sources but remains latent, suggesting active avoidance rather than absence of capability.
            </p>
            <Practice text="Daily 15-minute freewriting with no editing, no audience, no purpose. The goal is to bypass the infrastructure-first impulse and engage raw expression." />
            <References>
              <Cite author="Jung, C.G." work="Aion: Researches into the Phenomenology of the Self" year="1951" detail="Shadow integration as individuation." />
              <Cite author="Pennebaker, J.W." work="Opening Up: The Healing Power of Expressing Emotions" year="1997" detail="Expressive writing and psychological benefit." />
              <Cite author="Progoff, I." work="At a Journal Workshop" year="1975" detail="Intensive journal method for depth self-exploration." />
            </References>
          </Expandable>

          <Expandable
            renderTitle={<div className="flex items-center gap-3"><span className="text-sm font-medium text-[color:var(--ink)]">Sovereignty-Body Bridge</span></div>}
            explore={<ExploreButton finding="Sovereignty-Body Bridge" context="Transfer physical discipline consistency to a single knowledge-work domain." />}
            summary="Transfer physical discipline consistency to a single knowledge-work domain."
          >
            <TwoCol
              left={
                <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
                  Physical discipline shows 0.90 consistency across all sources, making the body the strongest counter-pattern to digital fragmentation. This discipline has never been successfully transferred to a knowledge-work domain.
                </p>
              }
              right={
                <Practice text="Treat one digital project like physical training: show up daily, no optimization, no architectural rethinking. Just reps. Minimum viable consistency over minimum viable product." />
              }
            />
            <References>
              <Cite author="Lakoff, G. & Johnson, M." work="Philosophy in the Flesh" year="1999" detail="Embodied cognition and its implications for abstract thought." />
              <Cite author="van der Kolk, B." work="The Body Keeps the Score" year="2014" detail="Somatic intelligence and the body as epistemic organ." />
            </References>
          </Expandable>

          <Expandable
            renderTitle={<div className="flex items-center gap-3"><span className="text-sm font-medium text-[color:var(--ink)]">Social Depth Investment</span></div>}
            explore={<ExploreButton finding="Social Depth Investment" context="The Social dimension scores lowest at 0.47: a structural observation, not a deficit." />}
            summary="Social depth is still unfolding — a structural pattern, not a ceiling."
          >
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              The pattern here is structural, not a character flaw: what was poured into intellectual depth, infrastructure, and somatic discipline hasn't yet flowed equally into relational bandwidth. That's a trajectory, not a fixed trait.
            </p>
            <Practice text="One deep conversation per week with no agenda, no problem to solve, no information to exchange. Pure relational presence." />
            <References>
              <Cite author="Dunbar, R." work="How Many Friends Does One Person Need?" year="2010" detail="Social brain hypothesis and relational bandwidth limits." />
              <Cite author="Bowlby, J." work="Attachment and Loss" year="1969" detail="Foundational attachment theory." />
            </References>
          </Expandable>

          <Expandable
            renderTitle={<div className="flex items-center gap-3"><span className="text-sm font-medium text-[color:var(--ink)]">Convergence Artifact</span></div>}
            explore={<ExploreButton finding="Convergence Artifact" context="Cross-domain synthesis at an inflection point, force convergence through concrete output." />}
            summary="Cross-domain synthesis at an inflection point, force convergence through concrete output."
          >
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              The narrative arc points toward convergence of previously separate domains. The pattern profile suggests you are at an inflection point where cross-domain synthesis could produce something genuinely novel.
            </p>
            <Practice text="Write one essay that connects two domains you have never publicly linked. The artifact itself is the practice: forcing convergence through a concrete output." />
            <References>
              <Cite author="Csikszentmihalyi, M." work="Creativity: Flow and the Psychology of Discovery and Invention" year="1996" detail="Domain-crossing creativity and combinatorial innovation." />
              <Cite author="Simonton, D.K." work="Origins of Genius: Darwinian Perspectives on Creativity" year="1999" detail="Combinatorial creativity across knowledge domains." />
            </References>
          </Expandable>
        </div>
      </section>

      {/* Psychological Frameworks */}
      <section>
        <SectionHead
          title="Psychological Frameworks"
          subtitle="Your profile mapped to established assessment models."
        />
        <div className="space-y-2">
          <Expandable title="Big Five Approximation" summary={
            <div className="flex gap-3 mt-1">
              {BIG_FIVE.map(b => (
                <span key={b.trait} className="text-[10px] text-[color:var(--ink-faint)]">
                  {b.trait.slice(0, 1)}: {Math.round(b.score * 100)}%
                </span>
              ))}
            </div>
          }>
            <div className="space-y-4">
              {BIG_FIVE.map(b => <TraitBar key={b.trait} {...b} />)}
            </div>
            <p className="mt-4 text-xs text-[color:var(--ink-faint)] leading-relaxed">
              Scores are approximations inferred from behavioral patterns, not direct psychometric testing. The Openness score reflects consistent cross-domain exploration and philosophical engagement. Conscientiousness diverges sharply between physical discipline (high) and project completion (moderate). Extraversion reflects burst communication rather than sustained social engagement.
            </p>
            <References>
              <Cite author="Costa, P.T. & McCrae, R.R." work="Revised NEO Personality Inventory (NEO PI-R)" year="1992" detail="Professional manual for the standard five-factor model." />
              <Cite author="Goldberg, L.R." work="An Alternative Description of Personality" year="1990" detail="Lexical hypothesis and the Big Five structure." />
            </References>
          </Expandable>

          <Expandable title="Attachment Style" summary="Secure-avoidant indicators: high sovereignty, sophisticated compensatory systems.">
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              Pattern suggests secure-avoidant orientation: high sovereignty preference, thin social dimension, sophisticated compensatory systems (infrastructure, intellectual depth), and strong physical self-care. Relationships are valued but structurally constrained by a preference for autonomy over interdependence.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--ink-soft)]">
              This is not dismissive avoidance, the capacity for depth engagement is present but channeled primarily into intellectual and somatic domains rather than relational ones. Working with this pattern means expanding relational bandwidth gradually, not overriding the sovereignty drive.
            </p>
            <References>
              <Cite author="Bowlby, J." work="Attachment and Loss, Vol. 1: Attachment" year="1969" detail="Foundational theory of attachment behavior." />
              <Cite author="Bartholomew, K. & Horowitz, L.M." work="Attachment Styles Among Young Adults" year="1991" detail="Four-category model of adult attachment." />
            </References>
          </Expandable>

          <Expandable title="Flow Profile" summary="Peak flow in early-project phases; blockers emerge at the last mile.">
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              Flow is most accessible during infrastructure-building and cross-domain synthesis. The optimal challenge-skill balance occurs in early-to-mid project phases where architectural decisions dominate.
            </p>
            <TwoCol
              left={
                <div className="space-y-2">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-emerald-500/70">Triggers</h4>
                  <p className="text-sm text-[color:var(--ink-soft)]">Novel architectural problems, cross-domain synthesis, constrained creative windows.</p>
                </div>
              }
              right={
                <div className="space-y-2">
                  <h4 className="text-xs font-medium uppercase tracking-wider text-amber-500/70">Blockers</h4>
                  <p className="text-sm text-[color:var(--ink-soft)]">Last-mile shipping, repetitive maintenance, unconstrained timelines.</p>
                </div>
              }
            />
            <References>
              <Cite author="Csikszentmihalyi, M." work="Flow: The Psychology of Optimal Experience" year="1990" detail="Challenge-skill balance and autotelic experience." />
              <Cite author="Nakamura, J. & Csikszentmihalyi, M." work="The Concept of Flow" year="2002" detail="Conditions and phenomenology of flow states." />
            </References>
          </Expandable>

          <Expandable title="Defense Mechanisms" summary="Predominantly mature defenses: sublimation and intellectualization.">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-emerald-500/70">Mature</span>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                  Sublimation (building as meaning-making), Intellectualization (philosophical framing of experience). These are the primary adaptive strategies.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-amber-500/70">Neurotic</span>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                  Displacement (abstraction as escape from affect), Isolation of affect (the body-mind discipline split where physical rigor compensates for emotional complexity).
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[color:var(--ink-faint)]">
              These are functional adaptations, not pathologies. The mature-to-neurotic ratio is favorable.
            </p>
            <References>
              <Cite author="Vaillant, G.E." work="Adaptation to Life" year="1977" detail="Hierarchy of defense mechanisms and longitudinal outcomes." />
              <Cite author="Cramer, P." work="Protecting the Self: Defense Mechanisms in Action" year="2006" detail="Contemporary research on defense mechanism assessment." />
            </References>
          </Expandable>
        </div>
      </section>

      {/* Temporal Evolution */}
      <section>
        <SectionHead
          title="Temporal Evolution"
          subtitle="How your cognitive and psychological profile has shifted across identifiable life phases."
        />
        <div className="space-y-2">
          <Expandable title="Timeline of Phases" summary="Six identifiable life phases from engineering foundation to present convergence." defaultOpen>
            <div className="space-y-0">
              {LIFE_PHASES.map((phase, i) => (
                <div key={phase.label} className="relative flex gap-4 pb-6 last:pb-0">
                  {/* Vertical connector line */}
                  {i < LIFE_PHASES.length - 1 && (
                    <div className="absolute left-[7px] top-5 bottom-0 w-px bg-slate-700/60" />
                  )}
                  {/* Phase dot */}
                  <div className={`relative mt-1.5 h-4 w-4 shrink-0 rounded-full ${phase.color}/30 flex items-center justify-center`}>
                    <div className={`h-2 w-2 rounded-full ${phase.color}`} />
                  </div>
                  {/* Phase content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-medium text-[color:var(--ink)]">{phase.label}</span>
                      <span className="text-xs text-[color:var(--ink-faint)]">{phase.period}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[color:var(--ink-soft)]">{phase.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px]">
                      <span className="text-[color:var(--ink-faint)]">
                        <span className="text-emerald-500/70 uppercase tracking-wider">Dominant:</span>{' '}
                        {phase.dominant}
                      </span>
                      {phase.underdeveloped && (
                        <span className="text-[color:var(--ink-faint)]">
                          <span className="text-amber-500/70 uppercase tracking-wider">Underdeveloped:</span>{' '}
                          {phase.underdeveloped}
                        </span>
                      )}
                      {phase.keyEvent && (
                        <span className="text-[color:var(--ink-faint)]">
                          <span className="text-blue-400/70 uppercase tracking-wider">Key event:</span>{' '}
                          {phase.keyEvent}
                        </span>
                      )}
                      {phase.emerging && (
                        <span className="text-[color:var(--ink-faint)]">
                          <span className="text-blue-400/70 uppercase tracking-wider">Emerging:</span>{' '}
                          {phase.emerging}
                        </span>
                      )}
                      {phase.keyTension && (
                        <span className="text-[color:var(--ink-faint)]">
                          <span className="text-red-400/70 uppercase tracking-wider">Key tension:</span>{' '}
                          {phase.keyTension}
                        </span>
                      )}
                      {phase.note && (
                        <span className="text-[color:var(--ink-faint)]">
                          <span className="text-[color:var(--ink-soft)]/70 uppercase tracking-wider">Note:</span>{' '}
                          {phase.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Expandable>

          <Expandable title="Dimensional Shift Analysis" summary="How each of the six dimensions has evolved across life phases.">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[color:var(--line)]">
                    <th className="py-2 pr-4 text-left font-medium text-[color:var(--ink-soft)]">Dimension</th>
                    <th className="py-2 pr-4 text-left font-medium text-[color:var(--ink-soft)]">Current Level</th>
                    <th className="py-2 text-left font-medium text-[color:var(--ink-soft)]">Trajectory</th>
                  </tr>
                </thead>
                <tbody>
                  {DIMENSION_EVOLUTION.map(d => (
                    <tr key={d.dimension} className="border-b border-[color:var(--line)]">
                      <td className="py-2.5 pr-4 text-[color:var(--ink)] font-medium">{d.dimension}</td>
                      <td className="py-2.5 pr-4 w-32">
                        <ConfidenceBar value={d.level} />
                      </td>
                      <td className="py-2.5 text-[color:var(--ink-faint)]">{d.trajectory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Expandable>

          <Expandable title="Psychological Maturity Indicators" summary="Observable signs of developmental progression across the timeline.">
            <div className="space-y-4">
              {[
                {
                  indicator: 'Increasing meta-cognitive capacity',
                  detail: 'Corrections-driven learning appeared late in the timeline, suggesting a shift from unconscious competence to deliberate self-observation.',
                },
                {
                  indicator: 'Shift from pure doing to reflection',
                  detail: 'The spiritual phase marks a transition from output-oriented identity to contemplative engagement with experience itself.',
                },
                {
                  indicator: 'Growing awareness of own patterns',
                  detail: 'PSYCHE/OS itself is evidence of this: the subject building a system to observe and model its own cognitive architecture.',
                },
                {
                  indicator: 'Body discipline as stable anchor',
                  detail: 'Physical practice has remained consistent across all phases, serving as the one domain unaffected by the burst-process-burst cycle.',
                },
              ].map(m => (
                <div key={m.indicator} className="border-l-2 border-slate-700 pl-4">
                  <span className="text-sm text-[color:var(--ink)]">{m.indicator}</span>
                  <p className="mt-1 text-xs leading-relaxed text-[color:var(--ink-faint)]">{m.detail}</p>
                </div>
              ))}
            </div>
            <References>
              <Cite author="Erikson, E.H." work="Childhood and Society" year="1950" detail="Psychosocial development stages across the lifespan." />
              <Cite author="Levinson, D.J." work="The Seasons of a Man's Life" year="1978" detail="Adult developmental periods and life structure transitions." />
              <Cite author="Kegan, R." work="The Evolving Self" year="1982" detail="Constructive-developmental theory of meaning-making evolution." />
              <Cite author="Loevinger, J." work="Ego Development" year="1976" detail="Stages of ego maturity and self-awareness." />
            </References>
          </Expandable>
        </div>
      </section>

      {/* Temporal Patterns */}
      <section>
        <SectionHead
          title="Temporal Patterns"
          subtitle="How cognitive rhythms structure your experience over time."
        />
        <TwoCol
          left={<DailyRhythmBar />}
          right={
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-[color:var(--ink)]">Phase Interpretation</h4>
              <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
                The contemplative phase (6-9h) supports philosophical inquiry and journaling. Technical work peaks mid-morning through early afternoon. The mixed phase accommodates context-switching. Decompression is not idle, it enables unconscious consolidation.
              </p>
            </div>
          }
        />
        <div className="mt-8 space-y-2">
          <Expandable title="Burst-Process-Burst" summary="Multi-day rhythm alternating creation bursts with unconscious consolidation.">
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              Multi-day rhythm alternating between high-intensity creation bursts and quieter integration periods. The processing phase is not downtime but unconscious consolidation. Attempting to force sustained output disrupts the cycle.
            </p>
            <References>
              <Cite author="Wallas, G." work="The Art of Thought" year="1926" detail="Four-stage model of creativity: preparation, incubation, illumination, verification." />
              <Cite author="Simonton, D.K." work="Scientific Genius: A Psychology of Science" year="1988" detail="Incubation and the role of unconscious processing in creative breakthroughs." />
            </References>
          </Expandable>

          <Expandable title="Domain Shift Cycle" summary="Longer-term oscillation across knowledge domains, accelerating as vocabulary stabilizes.">
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              Longer-term oscillation across knowledge domains: deep learning, LLM engineering, vibe coding, mystical/philosophical inquiry. Each phase informs the next through Fractal Transfer. The cycle is accelerating as cross-domain vocabulary stabilizes.
            </p>
            <References>
              <Cite author="Kuhn, T.S." work="The Structure of Scientific Revolutions" year="1962" detail="Paradigm shifts and the structure of domain migration." />
              <Cite author="Simonton, D.K." work="Scientific Genius: A Psychology of Science" year="1988" detail="Domain migration and combinatorial creativity." />
            </References>
          </Expandable>
        </div>
      </section>

      {/* Recommended Resources */}
      <section>
        <SectionHead
          title="Recommended Resources"
          subtitle="Curated based on your cognitive profile and current growth edge."
        />
        <div className="space-y-2">
          <Expandable title="Books" summary="Six titles selected for resonance with your pattern profile.">
            <div className="space-y-4">
              {[
                { title: 'The War of Art', author: 'Steven Pressfield', year: '2002', why: 'Addresses the Editor Function blind spot and resistance to shipping.' },
                { title: 'Finite and Infinite Games', author: 'James Carse', year: '1986', why: 'Speaks directly to the convergent-divergent tension in your pattern profile.' },
                { title: 'The Body Keeps the Score', author: 'Bessel van der Kolk', year: '2014', why: 'Deepens understanding of the body as counter-pattern and somatic intelligence.' },
                { title: 'Soulcraft', author: 'Bill Plotkin', year: '2003', why: 'Jungian nature-based individuation aligned with the Empirical-Mystical primitive.' },
                { title: 'The Courage to Create', author: 'Rollo May', year: '1975', why: 'Existential approach to the latent creative potential.' },
                { title: 'Godel, Escher, Bach', author: 'Douglas Hofstadter', year: '1979', why: 'A re-read through the PSYCHE/OS lens reveals new recursive layers.' },
              ].map(b => (
                <div key={b.title} className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm text-[color:var(--ink)]">{b.title}</span>
                    <span className="text-sm text-[color:var(--ink-faint)]">, {b.author} ({b.year})</span>
                    <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">{b.why}</p>
                  </div>
                  <ExploreButton finding={b.title} context={b.why} />
                </div>
              ))}
            </div>
          </Expandable>

          <Expandable title="Films" summary="Visual works that resonate with meta-cognitive and consciousness themes.">
            <div className="space-y-4">
              {[
                { title: 'Synecdoche, New York', director: 'Charlie Kaufman', year: '2008', why: 'The meta-layer of self-observation, building a model of the self inside the self.' },
                { title: 'Stalker', director: 'Andrei Tarkovsky', year: '1979', why: 'The Zone as metaphor for the unconscious: a space where desire and fear converge.' },
                { title: 'Waking Life', director: 'Richard Linklater', year: '2001', why: 'Consciousness, lucid engagement, and the boundary between dreaming and waking cognition.' },
              ].map(f => (
                <div key={f.title}>
                  <span className="text-sm text-[color:var(--ink)]">{f.title}</span>
                  <span className="text-sm text-[color:var(--ink-faint)]">, {f.director} ({f.year})</span>
                  <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">{f.why}</p>
                </div>
              ))}
            </div>
          </Expandable>

          <Expandable title="Thinkers to Follow" summary="Active researchers and writers aligned with your intellectual trajectory.">
            <div className="space-y-4">
              {[
                { name: 'Michael Levin', field: 'Bioelectric cognition, intelligence without brains. His work on morphogenetic fields bridges biology and information theory.' },
                { name: 'Joscha Bach', field: 'Computational consciousness, cognitive architecture. Rigorous formalism applied to the hard problem.' },
                { name: 'Gregory Bateson', field: 'Ecology of mind, systems thinking, learning and communication across layers.' },
                { name: 'Iain McGilchrist', field: 'Hemispheric brain theory. "The Master and His Emissary" reframes the left-right divide as a civilizational question.' },
                { name: 'Nora Bateson', field: 'Warm data, systems thinking. Extends Gregory Bateson\'s ecology of mind into relational epistemology.' },
              ].map(t => (
                <div key={t.name} className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm font-medium text-[color:var(--ink)]">{t.name}</span>
                    <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">{t.field}</p>
                  </div>
                  <ExploreButton finding={t.name} context={t.field} />
                </div>
              ))}
            </div>
          </Expandable>

          <Expandable title="Concepts to Explore" summary="Theoretical frameworks at the intersection of your active domains.">
            <div className="space-y-4">
              {[
                { concept: 'Autopoiesis', source: 'Maturana & Varela', desc: 'Self-creating systems, cognition as the process by which a living system maintains its own organization.' },
                { concept: 'Enactivism', source: 'Varela, Thompson, Rosch', desc: 'Cognition as embodied action, not internal computation. The mind emerges from the coupling of organism and environment.' },
                { concept: 'Apophatic Theology', source: 'Pseudo-Dionysius, Meister Eckhart', desc: 'Knowing through negation, what cannot be said reveals more than what can.' },
                { concept: 'Strange Loops', source: 'Douglas Hofstadter', desc: 'Self-reference as the mechanism of consciousness. Identity as a tangled hierarchy.' },
                { concept: 'Individuation', source: 'C.G. Jung', desc: 'The lifelong process of integrating conscious and unconscious into a coherent self.' },
              ].map(c => (
                <div key={c.concept} className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-sm text-[color:var(--ink)]">{c.concept}</span>
                    <span className="text-sm text-[color:var(--ink-faint)]">, {c.source}</span>
                    <p className="mt-0.5 text-xs text-[color:var(--ink-faint)]">{c.desc}</p>
                  </div>
                  <ExploreButton finding={c.concept} context={c.desc} />
                </div>
              ))}
            </div>
          </Expandable>
        </div>
      </section>
    </div>
  )
}
