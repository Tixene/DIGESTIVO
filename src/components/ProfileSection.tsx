import { useState } from 'react';
import { User, Crown, Lock, Check, Pencil, Heart } from 'lucide-react';
import { usePremium } from '@/lib/premium';

interface Props {
  userName: string;
  setUserName: (v: string) => void;
  entryCount: number;
}

export function ProfileSection({ userName, setUserName, entryCount }: Props) {
  const { isPremium, setIsPremium, showPaywall } = usePremium();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(userName);

  const save = () => {
    setUserName(draft.trim() || 'Sin nombre');
    setEditing(false);
    try {
      localStorage.setItem('gutlog_user', draft.trim() || 'Sin nombre');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="card p-5 sm:p-7 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-sage-200 to-sage-300 flex items-center justify-center text-2xl font-bold font-display text-sage-700">
          {(userName || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && save()}
                className="input-clean py-2 text-sm"
                placeholder="Tu nombre"
                autoFocus
              />
              <button onClick={save} className="btn-primary py-2 px-3 text-sm">
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-sage-800 truncate">
                {userName || 'Sin nombre'}
              </h2>
              <button
                onClick={() => {
                  setDraft(userName);
                  setEditing(true);
                }}
                className="p-1.5 rounded-lg hover:bg-sage-100 text-sage-400 hover:text-sage-600 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <p className="text-sm text-sage-500 mt-0.5">{entryCount} registros en tu diario</p>
        </div>
      </div>

      {/* Plan toggle */}
      <div className="rounded-2xl bg-cream-100 border border-cream-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isPremium ? 'bg-mp-blue/10' : 'bg-sage-100'}`}>
              {isPremium ? (
                <Crown className="w-4.5 h-4.5 text-mp-blue" />
              ) : (
                <User className="w-4.5 h-4.5 text-sage-500" />
              )}
            </div>
            <div>
              <div className="font-medium text-sage-700 text-sm">
                Plan {isPremium ? 'Premium' : 'Free'}
              </div>
              <div className="text-xs text-sage-500">
                {isPremium ? 'Acceso completo activado' : 'Funciones básicas'}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (isPremium) {
                setIsPremium(false);
              } else {
                showPaywall();
              }
            }}
            role="switch"
            aria-checked={isPremium}
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
              isPremium ? 'bg-mp-blue' : 'bg-sage-200'
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                isPremium ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="space-y-1.5 pt-3 border-t border-cream-200">
          {[
            { label: 'Registro diario de comidas y síntomas', free: true },
            { label: 'Historial semanal cronológico', free: true },
            { label: 'Reporte Clínico PDF', free: false },
            { label: 'Análisis de desencadenantes con IA', free: false },
            { label: 'Guía de alimentos FODMAP', free: false },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {f.free ? (
                <Check className="w-3.5 h-3.5 text-sage-500 flex-shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-sage-300 flex-shrink-0" />
              )}
              <span className={f.free ? 'text-sage-600' : 'text-sage-400'}>{f.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-sage-400">
        <Heart className="w-3.5 h-3.5 text-sage-300" />
        <span>Diseñado para pacientes con SII y SIBO. No sustituye consulta médica.</span>
      </div>
    </div>
  );
}
