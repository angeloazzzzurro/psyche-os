import {
  SectionHead,
  TwoCol,
  Expandable,
  ConfidenceBar,
  Cite,
  References,
  ExploreButton,
} from '../components/shared'

const IQ_RANGE = { low: 125, high: 138 }
const SCALE_MIN = 70
const SCALE_MAX = 160

const SD_MARKS = [
  { value: 85, label: '85' },
  { value: 100, label: '100' },
  { value: 115, label: '115' },
  { value: 130, label: '130' },
  { value: 145, label: '145' },
]

const CATEGORIES = [
  { label: 'Below Avg', from: 70, to: 85, color: 'bg-slate-700' },
  { label: 'Average', from: 85, to: 115, color: 'bg-slate-600' },
  { label: 'Above Avg', from: 115, to: 130, color: 'bg-blue-900/60' },
  { label: 'Superior', from: 130, to: 145, color: 'bg-indigo-900/60' },
  { label: 'Gifted', from: 145, to: 160, color: 'bg-violet-900/60' },
]

const HIGHER_INDICATORS = [
  { label: 'Cross-domain synthesis (fluid intelligence per Cattell)', confidence: 0.76 },
  { label: 'Abstraction descent capability (g-factor correlate)', confidence: 0.72 },
  { label: 'Mathematical/first-principles reasoning (set theory to type theory)', confidence: 0.68 },
  { label: 'Pattern transfer across unrelated domains (fractal transfer)', confidence: 0.71 },
  { label: 'Meta-cognitive sophistication (corrections-driven learning loops)', confidence: 0.74 },
]

const MODERATION_INDICATORS = [
  'Completion deficit suggests possible executive function gaps (not pure IQ but often correlated).',
  'Social dimension thinness: emotional/social intelligence is partially independent of g.',
  'Consumption-production asymmetry: high input with lower output is consistent with high IQ but also with avoidance patterns.',
  'Risk of Dunning-Kruger in self-selected digital traces: the data is not a random sample.',
]

const LIMITATIONS = [
  'Selection bias: only digital traces analyzed, not standardized tasks.',
  'Halo effect: impressive technical work may inflate estimates.',
  'Missing data: no timed problem-solving, no spatial reasoning tasks.',
  'Cultural bias: Western-centric cognitive frameworks.',
  'The Bayesian prior: population base rate pulls estimates toward 100.',
]

const SUB_SCORES = [
  { name: 'Verbal Comprehension', score: 130, evidence: 'strong', detail: 'Philosophical depth, multilingual capacity' },
  { name: 'Perceptual Reasoning', score: 125, evidence: 'moderate', detail: 'Architectural/spatial thinking in SVG, infrastructure design' },
  { name: 'Working Memory', score: 120, evidence: 'moderate', detail: 'Multi-project juggling, but completion issues' },
  { name: 'Processing Speed', score: 115, evidence: 'limited', detail: 'Burst-pause pattern is ambiguous' },
]

function pct(value: number): string {
  return `${((value - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100}%`
}

function IQGauge() {
  return (
    <div className="space-y-4 py-4">
      <div className="text-center mb-6">
        <span className="text-3xl font-light text-[color:var(--accent)] tracking-tight">
          {IQ_RANGE.low}&ndash;{IQ_RANGE.high}
        </span>
        <p className="text-xs text-[color:var(--ink-faint)] mt-1">Superior to Gifted (estimated range)</p>
        <ExploreButton
          finding="Estimated IQ range: 125-138 (Superior to Gifted)"
          context="Bayesian estimate based on behavioral cognitive patterns. Not a psychometric test."
        />
      </div>

      <div className="relative h-6 rounded-full overflow-hidden flex">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.label}
            className={`${cat.color} h-full`}
            style={{ width: `${((cat.to - cat.from) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
          />
        ))}
        {/* Estimated range overlay */}
        <div
          className="absolute top-0 h-full bg-indigo-500/40 border-x-2 border-indigo-400"
          style={{ left: pct(IQ_RANGE.low), width: `${((IQ_RANGE.high - IQ_RANGE.low) / (SCALE_MAX - SCALE_MIN)) * 100}%` }}
        />
      </div>

      {/* SD marks */}
      <div className="relative h-4">
        {SD_MARKS.map((m) => (
          <span
            key={m.value}
            className="absolute text-[10px] text-[color:var(--ink-faint)] -translate-x-1/2"
            style={{ left: pct(m.value) }}
          >
            {m.label}
          </span>
        ))}
      </div>

      {/* Category labels */}
      <div className="relative h-4">
        {CATEGORIES.map((cat) => {
          const center = (cat.from + cat.to) / 2
          return (
            <span
              key={cat.label}
              className="absolute text-[9px] text-[color:var(--ink-faint)] -translate-x-1/2 whitespace-nowrap"
              style={{ left: pct(center) }}
            >
              {cat.label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default function IQView() {
  return (
    <div className="space-y-12">
      <SectionHead
        title="Cognitive Capacity Estimate"
        subtitle="Approximate IQ range derived from behavioral and cognitive pattern analysis."
        explanation="This is NOT a psychometric IQ test. It is a Bayesian estimate based on observable cognitive behaviors in digital traces. Actual IQ measurement requires standardized testing (WAIS-IV, Raven's Progressive Matrices). This estimate has wide confidence intervals and should be treated as a rough hypothesis, not a diagnosis."
      />

      <TwoCol
        left={<IQGauge />}
        right={
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[color:var(--ink)]">Interpreting the Estimate</h3>
            <p className="text-sm text-[color:var(--ink-soft)] leading-relaxed">
              The estimate of 125 to 138 places the subject in the Superior range with
              possible extension into Gifted territory. This is a wide band reflecting
              significant uncertainty. The range was derived from converging behavioral
              signals, not from any single measurement. It should not be cited as a
              verified score.
            </p>
          </div>
        }
      />

      {/* Evidence Breakdown */}
      <div className="space-y-6">
        <h3 className="text-sm font-medium text-[color:var(--ink)] tracking-wide">Evidence Breakdown</h3>

        <Expandable title="Indicators Supporting Higher Estimate">
          <div className="space-y-4">
            {HIGHER_INDICATORS.map((ind) => (
              <div key={ind.label} className="space-y-1">
                <span className="text-xs text-[color:var(--ink-soft)]">{ind.label}</span>
                <ConfidenceBar value={ind.confidence} />
              </div>
            ))}
          </div>
        </Expandable>

        <Expandable title="Indicators Suggesting Moderation">
          <ul className="space-y-3">
            {MODERATION_INDICATORS.map((text) => (
              <li key={text} className="text-xs text-[color:var(--ink-soft)] leading-relaxed pl-3 border-l border-amber-400/30">
                {text}
              </li>
            ))}
          </ul>
        </Expandable>

        <Expandable title="Methodological Limitations">
          <ul className="space-y-3">
            {LIMITATIONS.map((text) => (
              <li key={text} className="text-xs text-[color:var(--ink-soft)] leading-relaxed pl-3 border-l border-red-400/30">
                {text}
              </li>
            ))}
          </ul>
        </Expandable>
      </div>

      {/* Component Analysis */}
      <Expandable title="Component Analysis (Estimated Sub-Scores)">
        <div className="space-y-4">
          {SUB_SCORES.map((s) => (
            <div key={s.name} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[color:var(--ink)]">{s.name}</span>
                <span className="text-xs font-mono text-[color:var(--accent)]">~{s.score}</span>
              </div>
              <ConfidenceBar value={(s.score - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)} />
              <p className="text-[11px] text-[color:var(--ink-faint)]">
                Evidence: {s.evidence}. {s.detail}.
              </p>
            </div>
          ))}
        </div>
      </Expandable>

      {/* References */}
      <References>
        <Cite author="Cattell, R.B." work="Theory of fluid and crystallized intelligence" year="1963" />
        <Cite author="Sternberg, R.J." work="Beyond IQ: A Triarchic Theory of Human Intelligence" year="1985" />
        <Cite author="Gardner, H." work="Frames of Mind: The Theory of Multiple Intelligences" year="1983" />
        <Cite author="Mensa International" work="IQ classification ranges" />
        <Cite author="Nisbett, R.E." work="Intelligence and How to Get It" year="2009" />
        <Cite author="Deary, I.J." work="Intelligence: A Very Short Introduction" year="2001" />
      </References>
    </div>
  )
}
