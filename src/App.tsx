import { useState, useEffect } from 'react'

import Itinerary from './components/Itinerary'
import Places from './components/Places'
import Checklist from './components/Checklist'
import Budget from './components/Budget'

// BeforeInstallPromptEvent não está nos tipos padrão do DOM
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type TabId = 'itinerary' | 'places' | 'checklist' | 'budget'

interface Tab {
  id: TabId
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'itinerary', label: 'Roteiro', icon: '🗺️' },
  { id: 'places', label: 'Lugares', icon: '📍' },
  { id: 'checklist', label: 'Checklist', icon: '✅' },
  { id: 'budget', label: 'Gastos', icon: '💶' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('itinerary')
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      const dismissed = localStorage.getItem('pwa_install_dismissed')
      if (!dismissed) setShowInstallBanner(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall(): Promise<void> {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowInstallBanner(false)
      setDeferredPrompt(null)
    }
  }

  function dismissBanner(): void {
    setShowInstallBanner(false)
    localStorage.setItem('pwa_install_dismissed', '1')
  }

  function renderTab() {
    switch (activeTab) {
      case 'itinerary': return <Itinerary />
      case 'places':    return <Places />
      case 'checklist': return <Checklist />
      case 'budget':    return <Budget />
    }
  }

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Header */}
      <header className="bg-white border-b border-sand sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 pt-4 pb-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-ink leading-tight">Minha Viagem</h1>
            <p className="text-xs text-gray-400">🇮🇹 Itália &amp; 🇪🇸 Barcelona</p>
          </div>
        </div>

        {/* Tabs */}
        <nav className="max-w-4xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-terra text-terra'
                  : 'border-transparent text-gray-500 hover:text-ink'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="bg-terra text-white px-4 py-3 flex items-center justify-between">
          <span className="text-sm">📲 Adicionar à tela inicial para uso offline</span>
          <div className="flex gap-4 shrink-0">
            <button onClick={handleInstall} className="text-sm font-semibold underline">
              Instalar
            </button>
            <button onClick={dismissBanner} className="text-sm opacity-80 hover:opacity-100">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-16">{renderTab()}</main>
    </div>
  )
}
