import { useEffect, useMemo, useState } from 'react'
import { SectionHead } from '../components/shared'
import { LinkIcon, CogIcon, ChartIcon, SearchIcon } from '../components/icons'
import { crossValidatedPatterns, dimensionalScores, narrativeArc } from '../data/loader'
import { useI18n } from '../i18n'

// ── Streak helpers ───────────────────────────────────────────────────

function getWeekKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const week = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  return `${year}-W${week}`
}

function computeStreak(): number {
  const stored = localStorage.getItem('psyche-visit-dates')
  const dates: string[] = stored ? JSON.parse(stored) : []
  const today = new Date().toDateString()
  if (!dates.includes(today)) {
    dates.push(today)
    localStorage.setItem('psyche-visit-dates', JSON.stringify(dates))
  }
  const unique = [...new Set(dates)].sort().reverse()
  let streak = 0
  let cursor = new Date()
  for (const d of unique) {
    const expected = cursor.toDateString()
    if (d === expected) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

type DimensionStat = { name: string; score: number }

export default function DashboardView() {
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('')
  const [intention, setIntention] = useState<string>(() => {
    const weekKey = `psyche-intention-${getWeekKey()}`
    return localStorage.getItem(weekKey) ?? ''
  })
  const [intentionSaved, setIntentionSaved] = useState(false)
  const [streak] = useState<number>(computeStreak)
  const [glassMode, setGlassMode] = useState<'soft' | 'intense'>(() => {
    const saved = localStorage.getItem('psyche-dashboard-glass')
    return saved === 'intense' ? 'intense' : 'soft'
  })

  useEffect(() => {
    localStorage.setItem('psyche-dashboard-glass', glassMode)
  }, [glassMode])

  const saveIntention = () => {
    const weekKey = `psyche-intention-${getWeekKey()}`
    localStorage.setItem(weekKey, intention)
    setIntentionSaved(true)
    setTimeout(() => setIntentionSaved(false), 2000)
  }

  const navigate = (view: string) => {
    window.dispatchEvent(new CustomEvent('navigate', { detail: view }))
  }

  const stats = useMemo(() => {
    const dimensions = Object.entries(dimensionalScores).map(([k, v]) => ({
      name: k,
      score: v.score ?? 0,
    }))

    const active = dimensions.filter(d => d.score >= 0.5)
    const exploring = dimensions.filter(d => d.score < 0.5)
    const patterns = crossValidatedPatterns.slice(0, 4)
    const progress = (name ? 50 : 0) + (goal ? 50 : 0)

    return {
      active,
      exploring,
      patterns,
      progress,
      chapter: narrativeArc?.currentChapter ?? t('dashboard.stat.narrative'),
    }
  }, [name, goal, t])

  return (
    <div className={`dashboard-glass-root glass-${glassMode} mx-auto w-full max-w-[92rem] space-y-10 px-4 py-8 sm:px-8 lg:space-y-12 lg:px-10 xl:px-12`}>
      <SectionHead
        title={t('dashboard.title')}
        subtitle={t('dashboard.subtitle')}
      />

      {/* Streak + intenzione settimanale */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr]">
        {/* Streak */}
        <div className="liquid-glass-card flex flex-col items-center justify-center gap-1 rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] px-6 py-4 shadow-[var(--shadow-card)] min-w-[9rem]">
          <span className="text-4xl font-bold tabular-nums text-[color:var(--accent)]">{streak}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--ink-faint)]">
            {streak === 1 ? 'giorno' : 'giorni'} di riflessione
          </span>
          <span className="mt-0.5 text-[11px] text-[color:var(--ink-faint)]">continuità</span>
        </div>

        {/* Intenzione settimana */}
        <div className="liquid-glass-panel rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-5 shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">Intenzione della settimana</h3>
          <p className="mt-0.5 mb-3 text-xs text-[color:var(--ink-faint)]">Qual è la qualità che vuoi portare questa settimana?</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={intention}
              onChange={e => setIntention(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveIntention()}
              placeholder="es. presenza, pazienza, slancio creativo…"
              className="liquid-glass-input flex-1 rounded-lg border border-[color:var(--line-strong)] bg-[color:var(--paper-strong)] px-3 py-2 text-sm text-[color:var(--ink)]"
            />
            <button
              onClick={saveIntention}
              className="rounded-lg border border-[color:var(--accent)] bg-[color:var(--accent-tint)] px-3 py-2 text-sm font-semibold text-[color:var(--accent)] transition-colors hover:bg-[color:var(--accent)] hover:text-white"
            >
              {intentionSaved ? '✓' : 'Salva'}
            </button>
          </div>
        </div>
      </section>

      <section className="-mt-4 flex justify-end">
        <div className="liquid-glass-chip inline-flex items-center gap-1 rounded-full p-1">
          <span className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
            {t('dashboard.glassMode')}
          </span>
          <button
            type="button"
            onClick={() => setGlassMode('soft')}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${glassMode === 'soft' ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--ink-soft)]'}`}
          >
            {t('dashboard.glass.soft')}
          </button>
          <button
            type="button"
            onClick={() => setGlassMode('intense')}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${glassMode === 'intense' ? 'bg-[color:var(--accent)] text-white' : 'text-[color:var(--ink-soft)]'}`}
          >
            {t('dashboard.glass.intense')}
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <StatCard label={t('dashboard.stat.profile')} value={`${stats.progress}%`} hint={t('dashboard.stat.completion')} />
        <StatCard label={t('dashboard.stat.phase')} value={stats.chapter} hint={t('dashboard.stat.narrative')} />
        <StatCard label={t('dashboard.stat.active')} value={String(stats.active.length)} hint={t('dashboard.stat.dimensions')} />
        <StatCard label={t('dashboard.stat.signals')} value={String(stats.patterns.length)} hint={t('dashboard.stat.topPatterns')} />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div className="liquid-glass-panel rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-semibold text-[color:var(--ink)]">{t('dashboard.profileSetup')}</h3>
          <p className="mt-1 text-sm text-[color:var(--ink-faint)]">{t('dashboard.profileHint')}</p>

          <div className="mt-5 space-y-4">
            <Field
              label={t('dashboard.name')}
              value={name}
              placeholder={t('dashboard.namePlaceholder')}
              onChange={setName}
            />
            <Field
              label={t('dashboard.goal')}
              value={goal}
              placeholder={t('dashboard.goalPlaceholder')}
              onChange={setGoal}
            />
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[color:var(--line)]">
            <div
              className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-300"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>

        <div className="liquid-glass-panel rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-soft)] p-6 shadow-[var(--shadow-card)]">
          <h3 className="text-lg font-semibold text-[color:var(--ink)]">{t('dashboard.quickActions')}</h3>
          <p className="mt-1 text-sm text-[color:var(--ink-faint)]">{t('dashboard.quickHint')}</p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <MenuCard icon={<LinkIcon />} label={t('dashboard.action.connect')} sub={t('dashboard.action.connectSub')} onClick={() => navigate('sources')} />
            <MenuCard icon={<CogIcon />} label={t('dashboard.action.run')} sub={t('dashboard.action.runSub')} onClick={() => navigate('sources')} />
            <MenuCard icon={<ChartIcon />} label={t('dashboard.action.overview')} sub={t('dashboard.action.overviewSub')} onClick={() => navigate('overview')} />
            <MenuCard icon={<SearchIcon />} label={t('dashboard.action.patterns')} sub={t('dashboard.action.patternsSub')} onClick={() => navigate('patterns')} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DimensionBlock title={t('dashboard.activeDimensions')} data={stats.active} tone="active" />
        <DimensionBlock title={t('dashboard.exploringDimensions')} data={stats.exploring} tone="soft" />
      </section>

      <section className="liquid-glass-panel rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow-card)]">
        <h3 className="text-lg font-semibold text-[color:var(--ink)]">{t('dashboard.recentSignals')}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.patterns.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => navigate('patterns')}
              className="liquid-glass-chip rounded-full border border-[color:var(--line-strong)] bg-[color:var(--paper-strong)] px-3 py-1 text-sm text-[color:var(--ink-soft)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
            >
              {pattern.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string
  value: string
  placeholder: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-faint)]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="liquid-glass-input block w-full rounded-lg border border-[color:var(--line-strong)] bg-white px-3 py-2"
      />
    </label>
  )
}

function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="liquid-glass-card rounded-xl border border-[color:var(--line)] bg-[color:var(--panel)] px-4 py-3 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-faint)]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[color:var(--ink)]">{value}</p>
      <p className="text-sm text-[color:var(--ink-faint)]">{hint}</p>
    </div>
  )
}

function MenuCard({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="liquid-glass-card rounded-xl border border-[color:var(--line)] bg-[color:var(--paper-strong)] p-4 text-left shadow-[var(--shadow-card)] transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-[var(--shadow-hover)]"
    >
      <span className="mb-2 inline-flex text-[color:var(--accent)]">{icon}</span>
      <span className="block text-base font-semibold text-[color:var(--ink)]">{label}</span>
      <span className="mt-0.5 block text-sm text-[color:var(--ink-faint)]">{sub}</span>
    </button>
  )
}

function DimensionBlock({
  title,
  data,
  tone,
}: {
  title: string
  data: DimensionStat[]
  tone: 'active' | 'soft'
}) {
  const color = tone === 'active' ? 'text-[color:var(--accent)]' : 'text-[color:var(--ink-soft)]'

  return (
    <div className="liquid-glass-panel rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[var(--shadow-card)]">
      <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
      <div className="mt-4 space-y-3">
        {data.slice(0, 4).map(item => (
          <div key={item.name} className="liquid-glass-chip flex items-center justify-between rounded-lg bg-[color:var(--paper-strong)] px-3 py-2">
            <span className="text-sm text-[color:var(--ink)]">{item.name}</span>
            <span className="text-sm font-medium text-[color:var(--ink-faint)]">{Math.round(item.score * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
