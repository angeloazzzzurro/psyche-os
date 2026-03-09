import { extractions, crossValidatedPatterns, dimensionalScores } from '../data/loader'
import { TwoCol, Cite, References } from '../components/shared'

const CX = 300
const CY = 300
const MAX_RADIUS = 260
const ACCENT = '#9f4a34'
const GUIDE = '#b8a797'
const GUIDE_SOFT = '#d5c9bd'
const INK_SOFT = '#7f7264'
const INK = '#4d4339'

const RINGS = [
  { level: 'L4', label: 'Archetypal', r: 60, opacity: 1.0, strokeWidth: 2 },
  { level: 'L3', label: 'Depth', r: 110, opacity: 0.8, strokeWidth: 1.5 },
  { level: 'L2', label: 'Cognitive', r: 160, opacity: 0.6, strokeWidth: 1.2 },
  { level: 'L1', label: 'Behavioral', r: 210, opacity: 0.4, strokeWidth: 1 },
  { level: 'L0', label: 'Surface', r: 260, opacity: 0.25, strokeWidth: 0.8 },
]

const DIMENSIONS = [
  { label: 'Psychological', angle: -90 },
  { label: 'Spiritual', angle: -30 },
  { label: 'Anthropological', angle: 30 },
  { label: 'Social', angle: 90 },
  { label: 'Creative', angle: 150 },
  { label: 'Professional', angle: 210 },
]

const DIMENSION_SCORES: Record<string, number> = {
  Psychological: 0.82,
  Spiritual: 0.76,
  Anthropological: 0.60,
  Social: 0.47,
  Creative: 0.72,
  Professional: 0.90,
}

const LEVELS = [
  {
    level: 'L0',
    name: 'Surface',
    description: 'Public persona and observable behavior patterns.',
  },
  {
    level: 'L1',
    name: 'Behavioral',
    description: 'Recurring habits, preferences, and decision tendencies.',
  },
  {
    level: 'L2',
    name: 'Cognitive',
    description: 'Thinking styles, reasoning patterns, and mental models.',
  },
  {
    level: 'L3',
    name: 'Depth',
    description: 'Unconscious motivations, complexes, and shadow material.',
  },
  {
    level: 'L4',
    name: 'Archetypal',
    description: 'Core identity structures and transpersonal patterns.',
  },
]

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

const totalDocuments = extractions.reduce((sum, e) => sum + e.documentsAnalyzed, 0)
const dimensionCount = Object.keys(dimensionalScores).length

const stats = [
  { label: 'Documents', value: totalDocuments },
  { label: 'Patterns', value: crossValidatedPatterns.length },
  { label: 'Dimensions', value: dimensionCount },
  { label: 'Potentials', value: 5 },
]

function ConcentricDiagram() {
  return (
    <svg viewBox="0 0 600 600" className="w-full max-w-[560px] h-auto">
      <defs>
        <radialGradient id="centerGlow">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.22" />
          <stop offset="60%" stopColor={ACCENT} stopOpacity="0.08" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>

      {[...RINGS].reverse().map((ring) => (
        <g key={ring.level}>
          <circle
            cx={CX}
            cy={CY}
            r={ring.r}
            fill="none"
            stroke={GUIDE}
            strokeWidth={ring.strokeWidth}
            opacity={ring.opacity}
          />
        </g>
      ))}

      {DIMENSIONS.map((dim) => {
        const outer = polar(CX, CY, 260, dim.angle)
        return (
          <line
            key={dim.label}
            x1={CX}
            y1={CY}
            x2={outer.x}
            y2={outer.y}
            stroke={GUIDE}
            strokeWidth="0.7"
          />
        )
      })}

      {DIMENSIONS.map((dim) => {
        const pos = polar(CX, CY, 288, dim.angle)
        return (
          <text
            key={dim.label}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill={INK_SOFT}
            fontSize="11"
            fontWeight="500"
          >
            {dim.label}
          </text>
        )
      })}

      {/* Score polygon */}
      {(() => {
        const scoreVertices = DIMENSIONS.map((dim) => {
          const score = DIMENSION_SCORES[dim.label] ?? 0
          const r = score * MAX_RADIUS
          return polar(CX, CY, r, dim.angle)
        })
        const polygonPoints = scoreVertices.map((v) => `${v.x},${v.y}`).join(' ')

        return (
          <g>
            <polygon
              points={polygonPoints}
              fill={ACCENT}
              fillOpacity={0.08}
              stroke={ACCENT}
              strokeWidth={1.5}
            />
            {scoreVertices.map((v, i) => (
              <circle
                key={DIMENSIONS[i].label}
                cx={v.x}
                cy={v.y}
                r={3.5}
                fill={ACCENT}
                stroke={GUIDE_SOFT}
                strokeWidth={1}
              />
            ))}
          </g>
        )
      })()}

      {/* Ring level labels — positioned along top-right arc */}
      {RINGS.map((ring, i) => {
        const angle = -55 + i * 4
        const pos = polar(CX, CY, ring.r, angle)
        return (
          <text
            key={ring.level}
            x={pos.x + 6}
            y={pos.y - 6}
            fill={INK_SOFT}
            fontSize="8"
            fontFamily="monospace"
            opacity={ring.opacity}
            textAnchor="start"
          >
            {ring.level}
          </text>
        )
      })}

      <circle cx={CX} cy={CY} r="28" fill="url(#centerGlow)" />
      <circle cx={CX} cy={CY} r="6" fill={ACCENT} />
      <circle cx={CX} cy={CY} r="3" fill={GUIDE_SOFT} />

      <text
        x={CX}
        y={CY + 18}
        textAnchor="middle"
        fill={INK}
        fontSize="10"
        fontWeight="700"
        letterSpacing="3"
      >
        SELF
      </text>
    </svg>
  )
}

export default function OverviewView() {
  return (
    <div className="space-y-12">
      <TwoCol
        left={
          <div className="flex justify-center">
            <ConcentricDiagram />
          </div>
        }
        right={
          <div className="space-y-6">
            <div className="metric-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="metric-block">
                  <div className="metric-value tabular-nums">{stat.value}</div>
                  <div className="metric-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <p className="body-copy">
              <span className="font-medium text-[color:var(--accent)]">PSYCHE/OS</span> analyzes
              your digital traces across 6 psychological dimensions, identifying
              cognitive patterns, archetypal resonances, and latent potentials.
              The concentric rings represent 5 levels of psychological depth, from
              Surface (public persona) to Archetypal (core identity structures).
            </p>

            <div className="space-y-3">
              {LEVELS.map((level) => (
                <div key={level.level} className="flex items-baseline gap-3 border-t border-[color:var(--line)] pt-3">
                  <span className="w-8 shrink-0 text-[0.7rem] font-mono uppercase tracking-[0.24em] text-[color:var(--accent)]">
                    {level.level}
                  </span>
                  <div>
                    <span className="text-[0.8rem] font-medium uppercase tracking-[0.18em] text-[color:var(--ink)]">
                      {level.name}
                    </span>
                    <span className="ml-2 text-[0.82rem] leading-7 text-[color:var(--ink-soft)]">
                      {level.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* References */}
            <References>
              <Cite
                author="Jung, C.G."
                work="Psychological Types"
                year="1921"
                detail="Foundation for dimensional personality analysis"
              />
              <Cite
                author="Murray, H.A."
                work="Explorations in Personality"
                year="1938"
                detail="Personology framework for multi-level assessment"
              />
              <Cite
                author="Costa, P.T. & McCrae, R.R."
                work="Revised NEO Personality Inventory"
                year="1992"
                detail="Five-Factor Model of trait-based personality structure"
              />
            </References>
          </div>
        }
      />
    </div>
  )
}
