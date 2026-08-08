import { useState, useEffect, useCallback } from 'react';
import { Home, Calendar, Crown, User, Leaf } from 'lucide-react';
import { supabase, type DigestiveEntry } from '@/lib/supabase';
import { PremiumProvider, usePremium } from '@/lib/premium';
import { EntryForm } from '@/components/EntryForm';
import { HistoryFeed } from '@/components/HistoryFeed';
import { PremiumSections } from '@/components/PremiumSections';
import { ProfileSection } from '@/components/ProfileSection';
import { PaywallModal } from '@/components/PaywallModal';

type Tab = 'home' | 'historial' | 'premium' | 'perfil';

const TABS: { key: Tab; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Registrar', icon: Home },
  { key: 'historial', label: 'Historial', icon: Calendar },
  { key: 'premium', label: 'Premium', icon: Crown },
  { key: 'perfil', label: 'Perfil', icon: User },
];

function AppContent() {
  const { isPremium } = usePremium();
  const [tab, setTab] = useState<Tab>('home');
  const [entries, setEntries] = useState<DigestiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Sin nombre');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gutlog_user');
      if (stored) setUserName(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('digestive_entries')
      .select('*')
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      console.error('Error cargando registros:', error);
      return;
    }
    setEntries((data as DigestiveEntry[]) ?? []);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-cream-50/80 backdrop-blur-md border-b border-sage-100">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-soft">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-sage-800 leading-none">GutLog</h1>
              <p className="text-[10px] text-sage-400 leading-none mt-0.5">Diario Clínico Digestivo</p>
            </div>
          </div>
          {isPremium && (
            <span className="chip bg-mp-blue/10 text-mp-deep border border-mp-blue/20 text-xs">
              <Crown className="w-3 h-3" /> Premium
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-5 pb-28">
        {tab === 'home' && (
          <div className="space-y-5">
            <div className="text-center pt-2 pb-1">
              <h2 className="font-display text-2xl font-bold text-sage-800 mb-1">
                ¿Cómo te sientes hoy?
              </h2>
              <p className="text-sm text-sage-500">
                Registra tus comidas y síntomas para entender tu digestión
              </p>
            </div>
            <EntryForm onSaved={fetchEntries} />
          </div>
        )}

        {tab === 'historial' && (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl font-bold text-sage-800 mb-1">
                Tu historial
              </h2>
              <p className="text-sm text-sage-500">
                Revisa qué comiste y qué síntomas tuviste cada día
              </p>
            </div>
            <HistoryFeed entries={entries} loading={loading} />
          </div>
        )}

        {tab === 'premium' && (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl font-bold text-sage-800 mb-1">
                Funciones Premium
              </h2>
              <p className="text-sm text-sage-500">
                Herramientas avanzadas para tu salud digestiva
              </p>
            </div>
            <PremiumSections entries={entries} userName={userName} />
          </div>
        )}

        {tab === 'perfil' && (
          <div>
            <div className="mb-5">
              <h2 className="font-display text-2xl font-bold text-sage-800 mb-1">
                Tu perfil
              </h2>
              <p className="text-sm text-sage-500">
                Gestiona tu cuenta y plan
              </p>
            </div>
            <ProfileSection userName={userName} setUserName={setUserName} entryCount={entries.length} />
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-t border-sage-100">
        <div className="max-w-2xl mx-auto px-2 sm:px-6">
          <div className="flex items-center justify-around h-16">
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
                    active ? 'text-sage-600' : 'text-sage-300 hover:text-sage-500'
                  }`}
                >
                  <div className={`relative ${active ? 'scale-110' : ''} transition-transform`}>
                    <t.icon className="w-5 h-5" />
                    {t.key === 'premium' && !isPremium && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-mp-blue border-2 border-white" />
                    )}
                  </div>
                  <span className={`text-[10px] font-medium ${active ? 'text-sage-700' : ''}`}>
                    {t.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <PaywallModal />
    </div>
  );
}

export default function App() {
  return (
    <PremiumProvider>
      <AppContent />
    </PremiumProvider>
  );
}
