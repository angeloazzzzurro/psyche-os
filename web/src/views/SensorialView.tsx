import { useEffect, useMemo, useState } from 'react'
import { sensorData } from '../data/loader'

interface SensorRow {
  timestamp: string
  source?: string
  heartRate?: number
  steps?: number
  sleepHours?: number
  hrv?: number
  oxygenSaturation?: number
  temperature?: number
  stressLevel?: number
}

type MetricKey = 'heartRate' | 'steps' | 'sleepHours' | 'hrv' | 'oxygenSaturation' | 'temperature' | 'stressLevel'

interface PlanetTooltip {
  x: number
  y: number
  metricLabel: string
  value: number
  unit: string
  timestamp: string
}

const METRICS: Array<{
  key: MetricKey
  label: string
  unit: string
  color: string
  fallbackMin: number
  fallbackMax: number
}> = [
  { key: 'heartRate', label: 'Heart Rate', unit: 'bpm', color: '#ef4444', fallbackMin: 45, fallbackMax: 140 },
  { key: 'steps', label: 'Steps', unit: 'steps', color: '#22c55e', fallbackMin: 0, fallbackMax: 12000 },
  { key: 'sleepHours', label: 'Sleep', unit: 'h', color: '#3b82f6', fallbackMin: 3, fallbackMax: 10 },
  { key: 'hrv', label: 'HRV', unit: 'ms', color: '#f59e0b', fallbackMin: 15, fallbackMax: 120 },
  { key: 'oxygenSaturation', label: 'Oxygen', unit: '%', color: '#06b6d4', fallbackMin: 88, fallbackMax: 100 },
  { key: 'temperature', label: 'Body Temp', unit: 'C', color: '#a855f7', fallbackMin: 34, fallbackMax: 39 },
  { key: 'stressLevel', label: 'Stress', unit: '/100', color: '#f97316', fallbackMin: 0, fallbackMax: 100 },
]

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

function formatValue(value: number | undefined, unit: string) {
  if (value == null || Number.isNaN(value)) return '-'
  if (unit === 'steps') return `${Math.round(value).toLocaleString()}`
  if (unit === '%') return `${value.toFixed(1)}`
  if (unit === 'h' || unit === 'C') return value.toFixed(1)
  return `${Math.round(value)}`
}

export default function SensorialView() {
  const rows = Array.isArray(sensorData) ? (sensorData as SensorRow[]) : []
  const [focusIndex, setFocusIndex] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [tooltip, setTooltip] = useState<PlanetTooltip | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  const orderedRows = useMemo(
    () => [...rows].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [rows],
  )
  const windowRows = orderedRows.slice(0, 18)
  const focusedRow = windowRows[Math.min(focusIndex, Math.max(0, windowRows.length - 1))]

  const metricRanges = useMemo(() => {
    return METRICS.map((metric) => {
      const values = windowRows
        .map((row) => row[metric.key])
        .filter((value): value is number => typeof value === 'number' && !Number.isNaN(value))
      const min = values.length ? Math.min(...values) : metric.fallbackMin
      const max = values.length ? Math.max(...values) : metric.fallbackMax
      return {
        ...metric,
        min,
        max: max === min ? min + 1 : max,
      }
    })
  }, [windowRows])

  if (rows.length === 0) {
    return <div className="text-center text-[color:var(--ink-faint)] py-10">Nessun dato sensoriale disponibile.</div>
  }

  return (
    <div className="mx-auto max-w-6xl py-10 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Mappa Sensoriale Stratificata</h2>
        <p className="text-sm text-[color:var(--ink-soft)]">
          Visualizzazione planetaria a strati: ogni orbita rappresenta una metrica biometrica, i pianeti mostrano lo stato corrente,
          le scie mostrano l&apos;andamento dei campioni recenti.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] items-start">
        <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper-strong)]/70 p-4 sm:p-6">
          <svg viewBox="0 0 560 560" className="w-full h-auto" role="img" aria-label="Visualizzazione planetaria stratificata dei dati sensoriali">
            <defs>
              <radialGradient id="sensorCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#dbeafe" stopOpacity="0.1" />
              </radialGradient>
            </defs>

            <circle cx="280" cy="280" r="42" fill="url(#sensorCore)" />
            <text x="280" y="272" textAnchor="middle" className="fill-slate-700" style={{ fontSize: 11, letterSpacing: '0.16em' }}>
              CORE
            </text>
            <text x="280" y="292" textAnchor="middle" className="fill-slate-500" style={{ fontSize: 9 }}>
              {new Date(focusedRow.timestamp).toLocaleDateString()}
            </text>

            {metricRanges.map((metric, metricIndex) => {
              const ringRadius = 74 + metricIndex * 30
              const samples = windowRows
                .map((row, rowIndex) => {
                  const value = row[metric.key]
                  if (typeof value !== 'number' || Number.isNaN(value)) return null
                  const norm = clamp01((value - metric.min) / (metric.max - metric.min))
                  const baseAngle = (norm * 300 - 150) * (Math.PI / 180)
                  const drift = rowIndex * 0.11
                  const angle = baseAngle + drift
                  const x = 280 + Math.cos(angle) * ringRadius
                  const y = 280 + Math.sin(angle) * ringRadius
                  return { rowIndex, x, y, value }
                })
                .filter((point): point is { rowIndex: number; x: number; y: number; value: number } => point !== null)

              const focusedValue = focusedRow[metric.key]
              const focusedNorm = typeof focusedValue === 'number'
                ? clamp01((focusedValue - metric.min) / (metric.max - metric.min))
                : 0.5
              const focusedAngle = (focusedNorm * 300 - 150) * (Math.PI / 180)
              const focusedX = 280 + Math.cos(focusedAngle) * ringRadius
              const focusedY = 280 + Math.sin(focusedAngle) * ringRadius

              return (
                <g key={metric.key}>
                  <circle cx="280" cy="280" r={ringRadius} fill="none" stroke={metric.color} strokeOpacity="0.25" strokeWidth="1" />
                  <text
                    x={280}
                    y={280 - ringRadius + 12}
                    textAnchor="middle"
                    fill={metric.color}
                    style={{ fontSize: 8, letterSpacing: '0.14em' }}
                  >
                    {metric.label.toUpperCase()}
                  </text>

                  <g>
                    {!reducedMotion && (
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from={`0 280 280`}
                        to={`${metricIndex % 2 === 0 ? 360 : -360} 280 280`}
                        dur={`${32 + metricIndex * 5}s`}
                        repeatCount="indefinite"
                      />
                    )}
                    {samples.map((sample) => (
                      <circle
                        key={`${metric.key}-${sample.rowIndex}`}
                        cx={sample.x}
                        cy={sample.y}
                        r={sample.rowIndex === focusIndex ? 5 : 2.4}
                        fill={metric.color}
                        fillOpacity={sample.rowIndex === focusIndex ? 0.95 : Math.max(0.2, 0.78 - sample.rowIndex * 0.05)}
                        className="cursor-pointer"
                        onMouseEnter={() => setTooltip({
                          x: sample.x,
                          y: sample.y,
                          metricLabel: metric.label,
                          value: sample.value,
                          unit: metric.unit,
                          timestamp: windowRows[sample.rowIndex].timestamp,
                        })}
                        onMouseLeave={() => setTooltip(null)}
                      >
                        <title>{`${metric.label}: ${formatValue(sample.value, metric.unit)} ${metric.unit} · ${new Date(windowRows[sample.rowIndex].timestamp).toLocaleString()}`}</title>
                      </circle>
                    ))}
                  </g>

                  <line x1="280" y1="280" x2={focusedX} y2={focusedY} stroke={metric.color} strokeOpacity="0.22" strokeWidth="1" />
                  <circle cx={focusedX} cy={focusedY} r="6" fill={metric.color} fillOpacity="0.88" stroke="white" strokeWidth="1.5" />
                </g>
              )
            })}

            {tooltip && (
              <g transform={`translate(${Math.max(16, Math.min(390, tooltip.x + 12))} ${Math.max(24, Math.min(510, tooltip.y - 10))})`}>
                <rect x="0" y="0" width="154" height="52" rx="8" fill="rgba(15, 23, 42, 0.88)" />
                <text x="8" y="15" fill="#e2e8f0" style={{ fontSize: 9, letterSpacing: '0.08em' }}>
                  {tooltip.metricLabel.toUpperCase()}
                </text>
                <text x="8" y="30" fill="#f8fafc" style={{ fontSize: 11, fontWeight: 600 }}>
                  {formatValue(tooltip.value, tooltip.unit)} {tooltip.unit}
                </text>
                <text x="8" y="44" fill="#94a3b8" style={{ fontSize: 8 }}>
                  {new Date(tooltip.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </text>
              </g>
            )}
          </svg>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper-strong)]/70 p-4">
            <h3 className="text-sm font-semibold text-[color:var(--ink)]">Snapshot selezionato</h3>
            <p className="mt-1 text-xs text-[color:var(--ink-faint)]">{new Date(focusedRow.timestamp).toLocaleString()} · {focusedRow.source ?? 'Source n/a'}</p>
          </div>

          {metricRanges.map((metric) => {
            const value = focusedRow[metric.key]
            const norm = typeof value === 'number' ? clamp01((value - metric.min) / (metric.max - metric.min)) : 0
            return (
              <div key={metric.key} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--paper-strong)]/65 px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium" style={{ color: metric.color }}>{metric.label}</span>
                  <span className="text-xs text-[color:var(--ink)]">{formatValue(value, metric.unit)} {value != null ? metric.unit : ''}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-[color:var(--panel)] overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${norm * 100}%`, backgroundColor: metric.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--paper-strong)]/70 p-4">
        <h3 className="text-sm font-semibold mb-3">Timeline campioni (ultimi {windowRows.length})</h3>
        <div className="flex flex-wrap gap-2">
          {windowRows.map((row, index) => (
            <button
              key={`${row.timestamp}-${index}`}
              onClick={() => setFocusIndex(index)}
              className={`rounded-md border px-2.5 py-1 text-xs transition ${index === focusIndex ? 'border-[color:var(--accent)] bg-[color:var(--accent-tint)] text-[color:var(--ink)]' : 'border-[color:var(--line)] text-[color:var(--ink-soft)] hover:border-[color:var(--line-strong)]'}`}
            >
              {new Date(row.timestamp).toLocaleDateString()} {new Date(row.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
