import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { dimensionalScores, DIMENSION_COLORS } from '../data/loader'
import {
  SectionHead,
  TwoCol,
  Expandable,
  Cite,
  References,
  ExploreButton,
} from '../components/shared'

const DIMENSION_REFS: Record<
  string,
  { author: string; work: string; year?: string; detail?: string }[]
> = {
  Psychological: [
    {
      author: 'Costa & McCrae',
      work: 'Revised NEO Personality Inventory (NEO PI-R)',
      year: '1992',
      detail: 'Five-factor model of personality traits',
    },
    {
      author: 'APA',
      work: 'DSM-5 Alternative Model for Personality Disorders',
      year: '2013',
      detail: 'Dimensional personality trait assessment',
    },
  ],
  Spiritual: [
    {
      author: 'William James',
      work: 'The Varieties of Religious Experience',
      year: '1902',
      detail: 'Foundational taxonomy of spiritual states',
    },
    {
      author: 'Abraham Maslow',
      work: 'Toward a Psychology of Being',
      year: '1962',
      detail: 'Self-actualization and peak experiences',
    },
  ],
  Anthropological: [
    {
      author: 'Clifford Geertz',
      work: 'The Interpretation of Cultures',
      year: '1973',
      detail: 'Thick description of cultural meaning systems',
    },
  ],
  Social: [
    {
      author: 'Robin Dunbar',
      work: 'The Social Brain Hypothesis',
      year: '1998',
      detail: 'Cognitive limits on social network size',
    },
    {
      author: 'Mark Granovetter',
      work: 'The Strength of Weak Ties',
      year: '1973',
      detail: 'Role of bridging connections in information flow',
    },
  ],
  Creative: [
    {
      author: 'Mihaly Csikszentmihalyi',
      work: 'Creativity: Flow and the Psychology of Discovery and Invention',
      year: '1996',
      detail: 'Systems model of creativity',
    },
    {
      author: 'Teresa Amabile',
      work: 'Componential Theory of Creativity',
      year: '1983',
      detail: 'Domain skills, creative processes, and intrinsic motivation',
    },
  ],
  Professional: [
    {
      author: 'John L. Holland',
      work: 'Making Vocational Choices',
      year: '1997',
      detail: 'RIASEC model of vocational personality types',
    },
    {
      author: 'Edgar H. Schein',
      work: 'Career Anchors: Discovering Your Real Values',
      year: '1990',
      detail: 'Self-concept patterns guiding career decisions',
    },
  ],
}

const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  Psychological:
    'Personality traits, cognitive style, emotional regulation patterns, and defense mechanisms as identified across sources.',
  Spiritual:
    'Relationship with meaning, transcendence, and existential questions. Includes both traditional spirituality and secular meaning-making.',
  Anthropological:
    'Cultural positioning, value systems, rituals, and the symbolic frameworks used to interpret experience.',
  Social:
    'Network structure, relational patterns, communication style, and the quality of interpersonal bonds.',
  Creative:
    'Creative process, aesthetic sensibility, capacity for divergent thinking, and relationship with artistic expression.',
  Professional:
    'Career identity, vocational alignment, leadership style, and relationship with work and professional growth.',
}

const radarData = Object.entries(dimensionalScores).map(([name, dim]) => ({
  dimension: name,
  score: (dim.score ?? 0) * 100,
  fullMark: 100,
}))

const dimensions = Object.entries(dimensionalScores).map(([name, dim]) => ({
  name,
  score: dim.score ?? 0,
  convergence: dim.convergence ?? '',
  blindSpot: dim.blindSpot ?? '',
  color: DIMENSION_COLORS[name] ?? '#6366f1',
}))

export default function DimensionsView() {
  return (
    <div className="space-y-10">
      <SectionHead
        title="Dimensional Profile"
        explanation="PSYCHE/OS analyzes identity across 6 dimensions derived from established psychological, sociological, and anthropological frameworks. Scores reflect the depth and consistency of evidence across sources, not absolute measurement."
      />

      <TwoCol
        left={
          <div className="mx-auto max-w-lg">
            <ResponsiveContainer width="100%" height={380}>
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                <PolarGrid stroke="#cdbdad" />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fill: '#7f7264', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#96897c', fontSize: 10 }}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fbf7f1',
                    border: '1px solid #d3c4b6',
                    borderRadius: '6px',
                    color: '#4d4339',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [
                    `${Number(value ?? 0).toFixed(0)}%`,
                    'Score',
                  ]}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#9f4a34"
                  fill="#9f4a34"
                  fillOpacity={0.08}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        }
        right={
          <div className="space-y-5">
            <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
              The radar chart visualizes relative scores across all six
              dimensions. A balanced profile appears as a regular hexagon;
              asymmetries reveal where evidence is strongest and where gaps
              exist. Each score is derived from cross-source convergence,
              higher values indicate consistent evidence from multiple data
              sources, not a value judgment.
            </p>
            <ul className="space-y-2.5">
              {dimensions.map((dim) => (
                <li key={dim.name} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: dim.color }}
                  />
                  <div>
                    <span className="text-xs font-medium text-[color:var(--ink)]">
                      {dim.name}
                    </span>
                    <p className="text-xs leading-relaxed text-[color:var(--ink-faint)]">
                      {DIMENSION_DESCRIPTIONS[dim.name] ?? ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        }
      />

      <div className="space-y-0">
        {dimensions.map((dim) => {
          const refs = DIMENSION_REFS[dim.name] ?? []

          return (
            <Expandable
              key={dim.name}
              explore={
                <ExploreButton
                  finding={dim.name}
                  context={`${dim.convergence}${dim.blindSpot ? ` Blind spot: ${dim.blindSpot}` : ''}`}
                  sources="claude-sessions, codex-sessions, social-traces"
                />
              }
              renderTitle={
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[color:var(--ink)]">{dim.name}</span>
                </div>
              }
              summary={`Score: ${Math.round(dim.score * 100)}%`}
            >
              <div className="space-y-4">
                {/* Colored dot + score bar */}
                <div className="flex items-center gap-3">
                  <span
                    className="block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: dim.color }}
                  />
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-[color:var(--panel)]">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${dim.score * 100}%`,
                        backgroundColor: dim.color,
                      }}
                    />
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-[color:var(--ink-soft)]">
                    {Math.round(dim.score * 100)}%
                  </span>
                </div>

                {/* Convergence */}
                {dim.convergence && (
                  <p className="text-sm leading-relaxed text-[color:var(--ink-soft)]">
                    {dim.convergence}
                  </p>
                )}

                {/* Blind Spot */}
                {dim.blindSpot && (
                  <div className="border-l-2 border-amber-500/40 pl-4">
                    <span className="text-xs font-medium uppercase tracking-wider text-amber-500/70">
                      Blind Spot
                    </span>
                    <p className="mt-1 text-sm leading-relaxed text-[color:var(--ink-soft)]">
                      {dim.blindSpot}
                    </p>
                  </div>
                )}

                {/* References */}
                {refs.length > 0 && (
                  <References>
                    {refs.map((ref) => (
                      <Cite
                        key={`${ref.author}-${ref.year}`}
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
        })}
      </div>
    </div>
  )
}
