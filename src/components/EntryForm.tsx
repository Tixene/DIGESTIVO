import { useState, type FormEvent } from 'react';
import { Coffee, Sun, Moon, Cookie, Plus, Loader2, Check } from 'lucide-react';
import { supabase, type NewEntryInput, type MealType } from '@/lib/supabase';
import { MEAL_LABELS, MEAL_ORDER, BRISTOL_INFO } from '@/lib/constants';
import { todayStr } from '@/lib/analytics';
import { usePremium } from '@/lib/premium';

const MEAL_ICONS: Record<MealType, typeof Coffee> = {
  desayuno: Coffee,
  almuerzo: Sun,
  cena: Moon,
  snacks: Cookie,
};

const SYMPTOM_FIELDS = [
  { key: 'bloating', label: 'Hinchazón', emoji: '🫧' },
  { key: 'pain', label: 'Dolor abdominal', emoji: '💢' },
  { key: 'reflux', label: 'Reflujo', emoji: '🔥' },
  { key: 'gas', label: 'Gases', emoji: '💨' },
] as const;

interface Props {
  onSaved: () => void;
}

export function EntryForm({ onSaved }: Props) {
  const { } = usePremium();
  const [date, setDate] = useState(todayStr());
  const [mealType, setMealType] = useState<MealType>('desayuno');
  const [foods, setFoods] = useState('');
  const [bloating, setBloating] = useState(false);
  const [pain, setPain] = useState(false);
  const [reflux, setReflux] = useState(false);
  const [gas, setGas] = useState(false);
  const [bristol, setBristol] = useState<number | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const reset = () => {
    setFoods('');
    setBloating(false);
    setPain(false);
    setReflux(false);
    setGas(false);
    setBristol(null);
    setIntensity(3);
    setNotes('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!foods.trim()) return;
    setSaving(true);
    const input: NewEntryInput = {
      entry_date: date,
      meal_type: mealType,
      foods: foods.trim(),
      bloating,
      pain,
      reflux,
      gas,
      bristol_type: bristol,
      intensity,
      notes: notes.trim(),
    };
    const { error } = await supabase.from('digestive_entries').insert(input);
    setSaving(false);
    if (error) {
      alert('No se pudo guardar el registro. Inténtalo nuevamente.');
      return;
    }
    reset();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2500);
    onSaved();
  };

  const intensityColor =
    intensity <= 3 ? 'text-sage-500' : intensity <= 6 ? 'text-amber-500' : 'text-red-500';

  return (
    <form onSubmit={handleSubmit} className="card p-5 sm:p-7 animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-sage-100 flex items-center justify-center">
          <Plus className="w-5 h-5 text-sage-600" />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-sage-800">Nuevo registro</h2>
          <p className="text-sm text-sage-500">Registra tu comida y cómo te sentiste</p>
        </div>
      </div>

      {/* Date + Meal type */}
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-clean"
            max={todayStr()}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">Comida</label>
          <div className="grid grid-cols-4 gap-2">
            {MEAL_ORDER.map((m) => {
              const Icon = MEAL_ICONS[m];
              const active = mealType === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMealType(m)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border transition-all ${
                    active
                      ? 'bg-sage-500 border-sage-500 text-white shadow-soft'
                      : 'bg-white/60 border-sage-200 text-sage-600 hover:border-sage-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] font-medium">{MEAL_LABELS[m]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Foods */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-sage-700 mb-1.5">
          ¿Qué comiste?
        </label>
        <textarea
          value={foods}
          onChange={(e) => setFoods(e.target.value)}
          placeholder="Ej: avena con banana, café con leche de almendras, pan integral..."
          className="input-clean min-h-[80px] resize-none"
          rows={3}
        />
      </div>

      {/* Symptoms */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Síntomas digestivos
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SYMPTOM_FIELDS.map((s) => {
            const active = { bloating, pain, reflux, gas }[s.key];
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => {
                  if (s.key === 'bloating') setBloating(!bloating);
                  if (s.key === 'pain') setPain(!pain);
                  if (s.key === 'reflux') setReflux(!reflux);
                  if (s.key === 'gas') setGas(!gas);
                }}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border-2 transition-all active:scale-95 ${
                  active
                    ? 'bg-amber-50 border-amber-400 shadow-soft'
                    : 'bg-white/60 border-sage-200 hover:border-sage-300'
                }`}
              >
                <span className="text-2xl leading-none">{s.emoji}</span>
                <span className={`text-xs font-medium ${active ? 'text-amber-700' : 'text-sage-600'}`}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bristol scale */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-sage-700 mb-2">
          Tipo de evacuación <span className="text-sage-400 font-normal">(Escala de Bristol)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBristol(null)}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
              bristol === null
                ? 'bg-sage-500 border-sage-500 text-white'
                : 'bg-white/60 border-sage-200 text-sage-600 hover:border-sage-300'
            }`}
          >
            Ninguna
          </button>
          {BRISTOL_INFO.map((b) => (
            <button
              key={b.type}
              type="button"
              onClick={() => setBristol(b.type)}
              className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all active:scale-90 ${
                bristol === b.type
                  ? `bg-bristol-${b.type} border-transparent text-white shadow-soft`
                  : 'bg-white/60 border-sage-200 text-sage-600 hover:border-sage-300'
              }`}
              title={b.desc}
            >
              {b.type}
            </button>
          ))}
        </div>
        {bristol !== null && (
          <p className="mt-2 text-xs text-sage-500 animate-fade-in">
            {BRISTOL_INFO.find((b) => b.type === bristol)?.desc}
          </p>
        )}
      </div>

      {/* Intensity slider */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-sage-700">
            Intensidad del malestar
          </label>
          <span className={`text-2xl font-bold font-display ${intensityColor}`}>
            {intensity}<span className="text-sm text-sage-300 font-sans">/10</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={intensity}
          onChange={(e) => setIntensity(Number(e.target.value))}
          className="w-full accent-sage-500 cursor-pointer"
          style={{
            background: `linear-gradient(90deg, #7faa7f 0%, #c9b04a 50%, #d97740 100%)`,
            height: '8px',
            borderRadius: '999px',
            appearance: 'none',
          }}
        />
        <div className="flex justify-between text-[11px] text-sage-400 mt-1.5">
          <span>Sin malestar</span>
          <span>Leve</span>
          <span>Moderado</span>
          <span>Intenso</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-sage-700 mb-1.5">
          Notas <span className="text-sage-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ej: comí rápido, mucho estrés..."
          className="input-clean"
        />
      </div>

      <button
        type="submit"
        disabled={saving || !foods.trim()}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Guardando...
          </>
        ) : justSaved ? (
          <>
            <Check className="w-5 h-5" /> ¡Registro guardado!
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" /> Guardar registro
          </>
        )}
      </button>
    </form>
  );
}
