import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import type { ViewId } from './data/types'
import { useI18n } from './i18n'

// ── Daily check-in ──────────────────────────────────────────────────

const CHECKIN_MOODS = ['energia', 'umore', 'focus', 'corpo', 'connessione'] as const
type MoodKey = typeof CHECKIN_MOODS[number]
const MOOD_LABELS: Record<MoodKey, string> = {
  energia: 'Energia',
  umore: 'Umore',
  focus: 'Focus',
  corpo: 'Corpo',
  connessione: 'Connessione',
}

const MASCOT_LINES: Record<ViewId, string> = {
  dashboard: 'Respiro lungo. Un passo chiaro alla volta.',
  sources: 'Partiamo dalle basi: dati puliti, mente libera.',
  overview: 'Guarda l\'insieme, poi scegli il dettaglio utile.',
  genome: 'Qui osservi il nucleo, senza giudizio.',
  dimensions: 'Ogni asse e una direzione, non un voto.',
  patterns: 'I pattern non sono gabbie, sono indizi.',
  archetypes: 'Usa gli archetipi come specchi, non etichette.',
  potentials: 'Piccoli esperimenti, crescita sostenibile.',
  narrative: 'Riscrivere il racconto cambia anche il ritmo.',
  insights: 'Prendi un insight e trasformalo in gesto concreto.',
  iq: 'Numeri utili, identita intatta.',
  neurodivergence: 'Curiosita clinica, niente auto-giudizio.',
  map: 'Segui il filo: connessioni prima, rumore dopo.',
  integration: 'Integra senza fretta. Coerenza prima di velocita.',
  diary: 'Una riga sincera oggi vale moltissimo domani.',
  timeline: 'La traiettoria conta piu del singolo giorno.',
  sensorial: 'Il corpo parla. Qui gli diamo ascolto.',
  contact: 'Quando serve, chiedere supporto e forza.',
}

function DailyCheckIn({ onDismiss }: { onDismiss: () => void }) {
  const [values, setValues] = useState<Record<MoodKey, number>>({
    energia: 5, umore: 5, focus: 5, corpo: 5, connessione: 5,
  })
  const [submitted, setSubmitted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const handleSubmit = () => {
    const entry = { date: new Date().toISOString(), values }
    const existing = JSON.parse(localStorage.getItem('psyche-checkins') ?? '[]')
    localStorage.setItem('psyche-checkins', JSON.stringify([...existing, entry]))
    localStorage.setItem('psyche-checkin-date', new Date().toDateString())
    setSubmitted(true)
    setTimeout(onDismiss, 1600)
  }

  return (
    <div className="checkin-panel" ref={panelRef} role="dialog" aria-label="Check-in giornaliero">
      {submitted ? (
        <div className="checkin-thanks">
          <span className="checkin-thanks-icon">✦</span>
          <p>Registrato. Buona giornata.</p>
        </div>
      ) : (
        <>
          <div className="checkin-header">
            <span className="checkin-title">Come stai oggi?</span>
            <button className="checkin-close" onClick={onDismiss} aria-label="Chiudi check-in">×</button>
          </div>
          <div className="checkin-sliders">
            {CHECKIN_MOODS.map((key) => (
              <label key={key} className="checkin-slider-row">
                <span className="checkin-slider-label">{MOOD_LABELS[key]}</span>
                <input
                  type="range" min={1} max={10} step={1}
                  value={values[key]}
                  onChange={e => setValues(v => ({ ...v, [key]: Number(e.target.value) }))}
                  className="checkin-slider"
                />
                <span className="checkin-slider-val">{values[key]}</span>
              </label>
            ))}
          </div>
          <button className="checkin-submit" onClick={handleSubmit}>Registra</button>
        </>
      )}
    </div>
  )
}

function FoxMascot({ activeView }: { activeView: ViewId }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    return () => mediaQuery.removeEventListener('change', update)
  }, [])

  return (
    <aside className="fox-mascot" aria-live="polite" aria-label="Mascotte guida">
      <div className={`fox-mascot-avatar${reducedMotion ? ' no-motion' : ''}`} aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 28L20 10L30 24" fill="#D98552" />
          <path d="M52 28L44 10L34 24" fill="#D98552" />
          <ellipse cx="32" cy="36" rx="20" ry="17" fill="#E99C69" />
          <ellipse cx="32" cy="42" rx="11" ry="8" fill="#F9E7D9" />
          <circle cx="24" cy="34" r="2.6" fill="#1F2930" />
          <circle cx="40" cy="34" r="2.6" fill="#1F2930" />
          <path d="M32 37L35 41H29L32 37Z" fill="#1F2930" />
          <path d="M28 44C29.5 45.6 31 46.4 32 46.4C33 46.4 34.5 45.6 36 44" stroke="#1F2930" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>
      <p className="fox-mascot-bubble">{MASCOT_LINES[activeView]}</p>
    </aside>
  )
}

const DashboardView = lazy(() => import('./views/DashboardView'))
const OnboardingView = lazy(() => import('./views/OnboardingView'))
const OverviewView = lazy(() => import('./views/OverviewView'))
const GenomeView = lazy(() => import('./views/GenomeView'))
const PatternsView = lazy(() => import('./views/PatternsView'))
const ArchetypesView = lazy(() => import('./views/ArchetypesView'))
const DimensionsView = lazy(() => import('./views/DimensionsView'))
const PotentialsView = lazy(() => import('./views/PotentialsView'))
const NarrativeView = lazy(() => import('./views/NarrativeView'))
const InsightsView = lazy(() => import('./views/InsightsView'))
const IQView = lazy(() => import('./views/IQView'))
const NeurodivergenceView = lazy(() => import('./views/NeurodivergenceView'))
const SemanticMapView = lazy(() => import('./views/SemanticMapView'))
const IntegrationView = lazy(() => import('./views/IntegrationView'))
const ProgressDiaryView = lazy(() => import('./views/ProgressDiaryView'))
const TimelineView      = lazy(() => import('./views/TimelineView'))
const SensorialView = lazy(() => import('./views/SensorialView'))
const ContactView = lazy(() => import('./views/ContactView'))

const NAV_ITEMS: { id: ViewId; key: string }[] = [
  { id: 'dashboard', key: 'dashboard' },
  { id: 'sources', key: 'sources' },
  { id: 'overview', key: 'overview' },
  { id: 'genome', key: 'genome' },
  { id: 'dimensions', key: 'dimensions' },
  { id: 'patterns', key: 'patterns' },
  { id: 'archetypes', key: 'archetypes' },
  { id: 'potentials', key: 'potentials' },
  { id: 'narrative', key: 'narrative' },
  { id: 'insights', key: 'insights' },
  { id: 'iq', key: 'iq' },
  { id: 'neurodivergence', key: 'neurodivergence' },
  { id: 'map', key: 'map' },
  { id: 'integration', key: 'integration' },
  { id: 'diary', key: 'diary' },
  { id: 'timeline', key: 'timeline' },
  { id: 'sensorial', key: 'sensorial' },
  { id: 'contact', key: 'contact' },
]

const NAV_GROUPS: Array<{ key: string; items: ViewId[] }> = [
  { key: 'foundation', items: ['dashboard', 'sources', 'overview'] },
  { key: 'analysis', items: ['genome', 'dimensions', 'patterns', 'archetypes', 'potentials', 'narrative', 'insights', 'iq', 'neurodivergence', 'map'] },
  { key: 'operations', items: ['integration', 'diary', 'timeline', 'sensorial', 'contact'] },
]

function App() {
  const { t, language, setLanguage, languages, isRTL } = useI18n()
  const [activeView, setActiveView] = useState<ViewId>('sources')
  const activeItem = NAV_ITEMS.find(item => item.id === activeView) ?? NAV_ITEMS[0]

  // dark mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('psyche-dark-mode')
    if (saved !== null) return saved === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('psyche-dark-mode', String(darkMode))
  }, [darkMode])

  // daily check-in
  const [showCheckIn, setShowCheckIn] = useState<boolean>(() => {
    return localStorage.getItem('psyche-checkin-date') !== new Date().toDateString()
  })

  // allow views like DashboardView to request navigation without prop drilling
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail
      if (typeof detail === 'string' && NAV_ITEMS.some(i => i.id === detail)) {
        setActiveView(detail as ViewId)
      }
    }
    window.addEventListener('navigate', handler)
    return () => window.removeEventListener('navigate', handler)
  }, [])

  const isDashboard = activeView === 'dashboard'
  // on dashboard we hide sidebar and center content; allow the panel to grow

  return (
    <div className={`app-shell${isDashboard ? ' is-dashboard' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <FoxMascot activeView={activeView} />
      {showCheckIn && <DailyCheckIn onDismiss={() => {
        localStorage.setItem('psyche-checkin-date', new Date().toDateString())
        setShowCheckIn(false)
      }} />}
      {!isDashboard && <a href="#main-content" className="skip-link">{t('app.skipToContent')}</a>}
      {!isDashboard && (
        <aside className="app-sidebar">
          <div className="app-sidebar-inner">
            <header>
              <div className="checkin-top-row">
                <div className="app-kicker">{t('app.kicker')}</div>
                <button
                  className="dark-toggle"
                  onClick={() => setDarkMode(d => !d)}
                  aria-label={darkMode ? 'Passa a tema chiaro' : 'Passa a tema scuro'}
                  title={darkMode ? 'Tema chiaro' : 'Tema scuro'}
                >
                  {darkMode ? '☀' : '◑'}
                </button>
              </div>
              <h1 className="app-brand">
                <span className="app-brand-accent">PSYCHE</span>
                <span className="app-brand-divider">/</span>
                <span>OS</span>
              </h1>
              <p className="app-brand-note">
                "{t('app.quote')}"
                <span className="app-brand-attribution">C.G. Jung</span>
              </p>
              <div className="app-language-wrap">
                <select
                  className="app-language-select"
                  value={language}
                  onChange={e => setLanguage(e.target.value as typeof language)}
                  aria-label={t('app.language')}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            </header>

            <nav className="app-nav" aria-label={t('app.primaryNavigation')}>
              {NAV_GROUPS.map((group) => (
                <section key={group.key} className="app-nav-group" aria-labelledby={`nav-group-${group.key}`}>
                  <h3 id={`nav-group-${group.key}`} className="app-nav-group-title">
                    {t(`app.navGroup.${group.key}`)}
                  </h3>
                  {group.items.map((viewId) => {
                    const item = NAV_ITEMS.find((candidate) => candidate.id === viewId)
                    if (!item) return null

                    const note = t(`app.nav.${item.key}.note`)
                    const globalIndex = NAV_ITEMS.findIndex((candidate) => candidate.id === item.id) + 1

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveView(item.id)}
                        className={`app-nav-button ${activeView === item.id ? 'is-active' : ''}`}
                        aria-current={activeView === item.id ? 'page' : undefined}
                        aria-label={note ? `${t(`app.nav.${item.key}.label`)} - ${note}` : t(`app.nav.${item.key}.label`)}
                      >
                        <span className="app-nav-index">{String(globalIndex).padStart(2, '0')}</span>
                        <span className="app-nav-copy">
                          <span className="app-nav-label">{t(`app.nav.${item.key}.label`)}</span>
                          <span className="app-nav-note">{note}</span>
                        </span>
                      </button>
                    )
                  })}
                </section>
              ))}
            </nav>
          </div>
        </aside>
      )}

      <main id="main-content" className={`app-main${isDashboard ? ' dashboard-mode' : ''}`}>
        {!isDashboard && (
          <header className="app-main-header">
            <div className="app-main-header-inner">
              <div>
                <div className="app-kicker">{t('app.currentView')}</div>
                <h2 className="app-view-title">{t(`app.nav.${activeItem.key}.label`)}</h2>
              </div>
              <p className="app-view-note">{t(`app.nav.${activeItem.key}.note`)}</p>
            </div>
          </header>
        )}

        <div className="app-main-frame">
          <Suspense fallback={<div className="app-loading">{t('app.loading')}</div>}>
            <section className="view-shell">
              {activeView === 'dashboard' && <DashboardView />}
              {activeView === 'sources' && <OnboardingView />}
              {activeView === 'overview' && <OverviewView />}
              {activeView === 'genome' && <GenomeView />}
              {activeView === 'patterns' && <PatternsView />}
              {activeView === 'archetypes' && <ArchetypesView />}
              {activeView === 'dimensions' && <DimensionsView />}
              {activeView === 'potentials' && <PotentialsView />}
              {activeView === 'narrative' && <NarrativeView />}
              {activeView === 'insights' && <InsightsView />}
              {activeView === 'iq' && <IQView />}
              {activeView === 'neurodivergence' && <NeurodivergenceView />}
              {activeView === 'map' && <SemanticMapView />}
              {activeView === 'integration' && <IntegrationView />}
              {activeView === 'diary'     && <ProgressDiaryView />}
              {activeView === 'timeline'  && <TimelineView />}
              {activeView === 'sensorial' && <SensorialView />}
              {activeView === 'contact'   && <ContactView />}
            </section>
          </Suspense>
        </div>
      </main>
    </div>
  )
}

export default App
