import { SectionHead, Expandable, ConfidenceBar, Cite, References, ExploreButton } from '../components/shared'
import {
  neurodivergenceIndicators,
  neurodivergenceOverlapAnalysis,
  neurodivergenceSummary,
} from '../data/loader'

const RECOMMENDED_ASSESSMENTS = [
  {
    name: 'WAIS-IV / WAIS-V',
    type: 'Neuropsychological' as const,
    purpose: 'Full-scale IQ and cognitive profile (processing speed, working memory, verbal comprehension, perceptual reasoning)',
    note: 'Would clarify giftedness indicators and identify any cognitive asymmetries that correlate with 2e profiles.',
  },
  {
    name: 'ASRS v1.1 (Adult ADHD Self-Report Scale)',
    type: 'Self-report' as const,
    purpose: 'WHO-developed ADHD screening instrument, validated across cultures',
    note: 'A quick initial screen. Positive results should be followed by clinical interview, not treated as diagnosis.',
  },
  {
    name: 'AQ-10 (Autism Quotient - Short)',
    type: 'Self-report' as const,
    purpose: 'Brief screening for autism spectrum traits in adults',
    note: 'Moderate indicators in this profile suggest screening is reasonable, but low specificity means many false positives.',
  },
  {
    name: 'HSPS (Highly Sensitive Person Scale)',
    type: 'Self-report' as const,
    purpose: 'Measures sensory processing sensitivity across three facets',
    note: 'Would help differentiate HSP temperament from introversion and neuroticism.',
  },
  {
    name: 'Comprehensive neuropsychological evaluation',
    type: 'Clinical' as const,
    purpose: 'Full assessment of executive function, processing speed, memory, and attention',
    note: 'The most informative option. Captures the full cognitive profile rather than screening for a single condition.',
  },
]

function StrengthIndicator({ value, label }: { value: number; label: string }) {
  const category =
    value >= 0.65 ? 'Moderate-strong' :
    value >= 0.5 ? 'Moderate' :
    value >= 0.35 ? 'Weak-moderate' :
    'Weak'

  const color =
    value >= 0.65 ? 'text-amber-600/80' :
    value >= 0.5 ? 'text-[color:var(--ink-soft)]' :
    'text-[color:var(--ink-faint)]'

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-[color:var(--ink)]">{label}</span>
        <span className={`text-xs ${color}`}>{category} ({Math.round(value * 100)}%)</span>
      </div>
      <ConfidenceBar value={value} />
    </div>
  )
}

function AssessmentBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    'Self-report': 'border-[#5f6e58]/25 bg-[#5f6e58]/8 text-[#5f6e58]',
    Clinical: 'border-[#a77c58]/25 bg-[#a77c58]/8 text-[#a77c58]',
    Neuropsychological: 'border-[#4e5f63]/25 bg-[#4e5f63]/8 text-[#4e5f63]',
  }
  return (
    <span className={`border px-2 py-0.5 text-[0.62rem] uppercase tracking-[0.18em] ${styles[type] ?? 'text-[color:var(--ink-soft)] border-[color:var(--line)]'}`}>
      {type}
    </span>
  )
}

export default function NeurodivergenceView() {
  return (
    <div className="space-y-20">
      {/* Disclaimer */}
      <section>
        <SectionHead
          title="Neurodivergence Screening"
          subtitle="Behavioral pattern analysis mapped to neurodivergent profiles from peer-reviewed literature. This is observation, not diagnosis."
        />

        <div className="border border-amber-600/20 bg-amber-600/5 p-5 space-y-3">
          <div className="text-xs font-medium uppercase tracking-widest text-amber-700/80">Important disclaimer</div>
          <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
            This analysis identifies behavioral patterns that <em>correlate with</em> neurodivergent profiles in published research.
            It is <strong>not a clinical diagnosis</strong>. Many of these patterns also appear in neurotypical individuals
            with specific personality traits, high intelligence, creative temperaments, or particular professional training.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
            Neurodivergence is a spectrum of natural cognitive variation, not a deficiency. The goal here is
            self-understanding, not labeling. If any pattern resonates strongly and you want clarity,
            consult a licensed clinical psychologist or neuropsychologist for formal assessment.
          </p>
          <p className="text-xs text-[color:var(--ink-faint)]">
            Methodology: behavioral markers are extracted from cross-source analysis (AI conversations, social media, work patterns)
            and mapped to criteria from DSM-5-TR, ICD-11, and established research instruments. Scores reflect behavioral
            signal strength, not diagnostic probability.
          </p>
        </div>
      </section>

      {/* Overview Chart */}
      <section>
        <SectionHead
          title="Signal Overview"
          subtitle="Strength of behavioral indicators across four neurodivergent dimensions."
        />
        <div className="space-y-5">
          {neurodivergenceIndicators.map(ind => (
            <StrengthIndicator key={ind.label} value={ind.overallStrength} label={ind.label} />
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-[color:var(--ink-faint)]">
          Scores represent convergent behavioral evidence strength, not diagnostic probability.
          A score of 0.5 means "ambiguous, could be explained by neurodivergence or by other factors."
          Above 0.65 means "multiple independent behavioral indicators converge."
        </p>
      </section>

      {/* Detailed Indicators */}
      <section>
        <SectionHead
          title="Detailed Analysis"
          subtitle="Each dimension with specific behavioral markers, evidence, and differential considerations."
          explanation="Every indicator includes what ELSE could explain the pattern. This is essential: behavioral data alone cannot distinguish between neurodivergent traits and personality, training, or circumstantial factors."
        />
        <div className="space-y-2">
          {neurodivergenceIndicators.map(indicator => (
            <Expandable
              key={indicator.label}
              renderTitle={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[color:var(--ink)]">{indicator.label}</span>
                  <span className="text-xs text-[color:var(--ink-faint)]">{indicator.dimension}</span>
                  <ExploreButton
                    finding={indicator.label}
                    context={`Behavioral signal strength: ${Math.round(indicator.overallStrength * 100)}%. ${indicator.differentialNotes}`}
                  />
                </div>
              }
              summary={
                <span className="text-xs text-[color:var(--ink-faint)]">
                  Signal: {Math.round(indicator.overallStrength * 100)}%, {indicator.markers.length} markers analyzed
                </span>
              }
            >
              <div className="space-y-6">
                {/* Markers */}
                <div className="space-y-4">
                  <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--ink-faint)]">Behavioral Markers</div>
                  {indicator.markers.map(m => (
                    <div key={m.marker} className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-sm text-[color:var(--ink)]">{m.marker}</span>
                        <span className="shrink-0 text-xs tabular-nums text-[color:var(--ink-faint)]">{Math.round(m.strength * 100)}%</span>
                      </div>
                      <ConfidenceBar value={m.strength} />
                      <p className="text-xs leading-relaxed text-[color:var(--ink-faint)]">{m.evidence}</p>
                    </div>
                  ))}
                </div>

                {/* Differential */}
                <div className="border-l-2 border-amber-600/30 pl-4 space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-amber-700/70">Alternative explanations</div>
                  <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">{indicator.caveat}</p>
                </div>

                {/* Differential notes */}
                <div className="border-l-2 border-slate-500/30 pl-4 space-y-2">
                  <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--ink-faint)]">Clinical differentiation</div>
                  <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">{indicator.differentialNotes}</p>
                </div>

                {/* References */}
                <References>
                  {indicator.references.map(ref => (
                    <Cite key={ref.work} author={ref.author} work={ref.work} year={ref.year} detail={ref.detail} />
                  ))}
                </References>
              </div>
            </Expandable>
          ))}
        </div>
      </section>

      {/* Overlap Analysis */}
      <section>
        <SectionHead
          title="Overlap & Comorbidity"
          subtitle="Why these dimensions cannot be cleanly separated from behavioral data alone."
        />
        <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
          {neurodivergenceOverlapAnalysis}
        </p>
        <References>
          <Cite author="Webb, J.T. et al." work="Misdiagnosis and Dual Diagnoses of Gifted Children and Adults" year="2005" detail="How giftedness mimics ADHD, ASD, OCD, and mood disorders." />
          <Cite author="Assouline, S.G. et al." work="Twice-Exceptional Learners" year="2006" detail="The intersection of giftedness and disability (Gifted Child Quarterly)." />
          <Cite author="Rommelse, N. et al." work="Shared Heritability of ADHD and Autism" year="2010" detail="Genetic overlap between attention and social processing (Lancet Neurology)." />
        </References>
      </section>

      {/* Strengths Framing */}
      <section>
        <SectionHead
          title="Strengths Framing"
          subtitle="These patterns are cognitive variation, not deficiency."
        />
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
            The neurodiversity paradigm recognizes that brains vary naturally, and many traits coded as "disorders" in clinical
            contexts are also sources of distinctive capability. In this profile:
          </p>
          <div className="space-y-3">
            {[
              { trait: 'Burst-process-burst', reframe: 'enables intense creative output during focused windows rather than demanding artificial consistency.' },
              { trait: 'Novelty-seeking and domain shifts', reframe: 'produce cross-domain transfer and combinatorial creativity that depth-only specialists cannot access.' },
              { trait: 'Systematizing drive', reframe: 'creates durable frameworks and protocols that compound over time.' },
              { trait: 'Deep processing', reframe: 'leads to genuine understanding rather than surface familiarity.' },
              { trait: 'Existential engagement', reframe: 'provides meaning orientation that sustains motivation beyond external rewards.' },
            ].map(s => (
              <div key={s.trait} className="border-l-2 border-[#5f6e58]/40 pl-4">
                <span className="text-sm text-[color:var(--ink)]">{s.trait}</span>
                <p className="text-xs leading-relaxed text-[color:var(--ink-faint)]">{s.reframe}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Assessments */}
      <section>
        <SectionHead
          title="Formal Assessment Options"
          subtitle="If you want clarity beyond behavioral observation, these are the validated instruments and procedures."
          explanation="Self-report instruments are screening tools, not diagnoses. Clinical and neuropsychological assessments provide the most reliable results."
        />
        <div className="space-y-2">
          {RECOMMENDED_ASSESSMENTS.map(a => (
            <Expandable
              key={a.name}
              renderTitle={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[color:var(--ink)]">{a.name}</span>
                  <AssessmentBadge type={a.type} />
                </div>
              }
              summary={a.purpose}
            >
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">{a.purpose}</p>
                <p className="text-xs leading-relaxed text-[color:var(--ink-faint)]">{a.note}</p>
              </div>
            </Expandable>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section>
        <SectionHead title="Summary" />
        <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
          {neurodivergenceSummary}
        </p>
        <References>
          <Cite author="Armstrong, T." work="The Power of Neurodiversity" year="2010" detail="Strengths-based framework for understanding neurological variation." />
          <Cite author="Singer, J." work="NeuroDiversity: The Birth of an Idea" year="2017" detail="Origins and evolution of the neurodiversity concept." />
          <Cite author="Chapman, R." work="The Case for Neurodiversity" year="2021" detail="Philosophical foundations of the neurodiversity paradigm." />
        </References>
      </section>
    </div>
  )
}
