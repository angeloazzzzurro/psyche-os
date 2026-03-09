import { allPotentials } from '../data/loader'
import {
  SectionHead,
  StateBadge,
  ConfidenceBar,
  Cite,
  References,
  ExploreButton,
  Expandable,
} from '../components/shared'

const POTENTIAL_REFS: Record<
  string,
  { author: string; work: string; year?: string; detail?: string }[]
> = {
  creativity: [
    {
      author: 'James W. Pennebaker',
      work: 'Writing to Heal',
      year: '2004',
      detail: 'Therapeutic and cognitive effects of expressive writing',
    },
    {
      author: 'Julia Cameron',
      work: "The Artist's Way",
      year: '1992',
      detail: 'Structured practice for recovering creative capacity',
    },
  ],
  writing: [
    {
      author: 'James W. Pennebaker',
      work: 'Writing to Heal',
      year: '2004',
      detail: 'Therapeutic and cognitive effects of expressive writing',
    },
    {
      author: 'Julia Cameron',
      work: "The Artist's Way",
      year: '1992',
      detail: 'Structured practice for recovering creative capacity',
    },
  ],
  entrepreneurship: [
    {
      author: 'Saras D. Sarasvathy',
      work: 'Effectuation: Elements of Entrepreneurial Expertise',
      year: '2001',
      detail:
        'Decision-making under uncertainty through means-driven action',
    },
  ],
  photography: [
    {
      author: 'Susan Sontag',
      work: 'On Photography',
      year: '1977',
      detail: 'Photography as interpretation and power relation',
    },
    {
      author: 'John Berger',
      work: 'Ways of Seeing',
      year: '1972',
      detail: 'Visual perception shaped by cultural assumptions',
    },
  ],
  protocol: [
    {
      author: 'Everett M. Rogers',
      work: 'Diffusion of Innovations',
      year: '1962',
      detail: 'How new ideas and practices spread through social systems',
    },
  ],
  industry: [
    {
      author: 'Everett M. Rogers',
      work: 'Diffusion of Innovations',
      year: '1962',
      detail: 'How new ideas and practices spread through social systems',
    },
  ],
  consciousness: [
    {
      author: 'Francisco J. Varela',
      work: 'Neurophenomenology: A Methodological Remedy for the Hard Problem',
      year: '1996',
      detail:
        'Bridging first-person experience with neuroscience methodology',
    },
  ],
  ai: [
    {
      author: 'Francisco J. Varela',
      work: 'Neurophenomenology: A Methodological Remedy for the Hard Problem',
      year: '1996',
      detail:
        'Bridging first-person experience with neuroscience methodology',
    },
  ],
}

function findRefsForPotential(
  label: string
): { author: string; work: string; year?: string; detail?: string }[] {
  const lower = label.toLowerCase()
  const seen = new Set<string>()
  const result: {
    author: string
    work: string
    year?: string
    detail?: string
  }[] = []

  for (const [keyword, refs] of Object.entries(POTENTIAL_REFS)) {
    if (lower.includes(keyword)) {
      for (const ref of refs) {
        const key = `${ref.author}-${ref.work}`
        if (!seen.has(key)) {
          seen.add(key)
          result.push(ref)
        }
      }
    }
  }

  return result
}

function confidenceColor(confidence: number): string {
  if (confidence >= 0.85) return 'bg-emerald-400'
  if (confidence >= 0.75) return 'bg-blue-400'
  return 'bg-amber-400'
}

function PotentialRow({
  potential,
  rank,
}: {
  potential: (typeof allPotentials)[number]
  rank: number
}) {
  const refs = findRefsForPotential(potential.label)

  return (
    <Expandable
      explore={
        <ExploreButton
          finding={potential.label}
          context={potential.description}
          sources={potential.crossSourceValidation}
        />
      }
      renderTitle={
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-lg font-light tabular-nums text-[color:var(--ink-faint)]">
              {rank}
            </span>
            <span className="text-sm font-medium text-[color:var(--ink)]">
              {potential.label}
            </span>
            <StateBadge state={potential.state} />
          </div>
          <div className="max-w-sm">
            <ConfidenceBar
              value={potential.confidence}
              color={confidenceColor(potential.confidence)}
            />
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Description */}
        {potential.description && (
          <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
            {potential.description}
          </p>
        )}

        {/* Cross-Source Validation */}
        {potential.crossSourceValidation && (
          <div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-[color:var(--ink-faint)]">
              Cross-Source Validation
            </span>
            <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">
              {potential.crossSourceValidation}
            </p>
          </div>
        )}

        {/* Actionable Steps */}
        {potential.actionable && (
          <div className="border-l-2 border-indigo-400 pl-4">
            <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--accent)]">
              Actionable Next Step
            </span>
            <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">
              {potential.actionable}
            </p>
          </div>
        )}

        {/* References */}
        {refs.length > 0 && (
          <References>
            {refs.map((ref) => (
              <Cite
                key={`${ref.author}-${ref.work}`}
                author={ref.author}
                work={ref.work}
                year={ref.year}
                detail={ref.detail}
              />
            ))}
          </References>
        )}
      </div>
    </Expandable>
  )
}

export default function PotentialsView() {
  const potentials = allPotentials.slice(0, 5)

  return (
    <div className="space-y-10">
      <SectionHead
        title="Latent Potentials"
        explanation="Potentials represent capabilities identified in the data that exist at varying stages of realization. 'Expressed' means actively manifested; 'Emerging' shows early signs; 'Latent' exists but is dormant; 'Sabotaged' is actively undermined by countervailing patterns."
      />

      <div className="space-y-0">
        {potentials.map((p, idx) => (
          <PotentialRow
            key={p.label}
            potential={p}
            rank={p.rank ?? idx + 1}
          />
        ))}
      </div>
    </div>
  )
}
