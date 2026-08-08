import { useState, useMemo } from 'react';
import { Search, Lock, FileText, Download, Loader2, Brain, TrendingUp, TrendingDown, AlertTriangle, BookOpen, Check, X, Circle } from 'lucide-react';
import type { DigestiveEntry } from '@/lib/supabase';
import { analyzeTriggers } from '@/lib/analytics';
import { generateReportPDF } from '@/lib/report';
import { FODMAP_FOODS, FODMAP_LEVELS, type FodmapFood } from '@/lib/constants';
import { usePremium } from '@/lib/premium';

interface Props {
  entries: DigestiveEntry[];
  userName: string;
}

export function PremiumSections({ entries, userName }: Props) {
  return (
    <div className="space-y-6">
      <ReportSection entries={entries} userName={userName} />
      <AIAnalysisSection entries={entries} />
      <FodmapGuideSection />
    </div>
  );
}

function LockedOverlay({ title, desc }: { title: string; desc: string }) {
  const { showPaywall } = usePremium();
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-b from-white/60 via-white/70 to-white/90 backdrop-blur-[2px] rounded-3xl">
      <div className="w-14 h-14 rounded-2xl bg-mp-blue/10 flex items-center justify-center mb-3">
        <Lock className="w-6 h-6 text-mp-blue" />
      </div>
      <h4 className="font-display text-lg font-semibold text-sage-800 mb-1">{title}</h4>
      <p className="text-sm text-sage-500 text-center max-w-xs px-4 mb-4">{desc}</p>
      <button onClick={showPaywall} className="btn-primary text-sm">
        Desbloquear con Premium
      </button>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  locked,
  children,
  lockTitle,
  lockDesc,
}: {
  icon: typeof FileText;
  title: string;
  subtitle: string;
  locked: boolean;
  children: React.ReactNode;
  lockTitle: string;
  lockDesc: string;
}) {
  return (
    <section className={`card p-5 sm:p-7 animate-fade-in ${locked ? 'premium-lock' : ''}`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl bg-mp-blue/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-mp-blue" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-sage-800">{title}</h3>
          <p className="text-sm text-sage-500">{subtitle}</p>
        </div>
      </div>
      <div className={`relative ${locked ? 'min-h-[200px]' : ''}`}>
        {locked && <LockedOverlay title={lockTitle} desc={lockDesc} />}
        <div className={locked ? 'blur-sm pointer-events-none select-none' : ''}>{children}</div>
      </div>
    </section>
  );
}

function ReportSection({ entries, userName }: { entries: DigestiveEntry[]; userName: string }) {
  const { isPremium } = usePremium();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (entries.length === 0) {
      alert('Necesitas al menos un registro para generar el reporte.');
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      generateReportPDF(entries, userName);
      setGenerating(false);
    }, 600);
  };

  return (
    <SectionCard
      icon={FileText}
      title="Reporte Clínico para el Gastroenterólogo"
      subtitle="Informe PDF con cruce de alimentos y síntomas"
      locked={!isPremium}
      lockTitle="Reporte Clínico Premium"
      lockDesc="Genera un informe profesional en PDF para tu médico, con el cruce de comidas y síntomas que más te afectaron."
    >
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <StatBox value={entries.length} label="Registros" />
          <StatBox value={new Set(entries.map((e) => e.entry_date)).size} label="Días con datos" />
          <StatBox
            value={entries.length > 0 ? (entries.reduce((s, e) => s + e.intensity, 0) / entries.length).toFixed(1) : '0'}
            label="Intensidad prom."
          />
        </div>
        <p className="text-sm text-sage-500">
          El reporte incluye un resumen general, los principales desencadenantes detectados y el detalle día por día de comidas y síntomas, listo para llevar a tu consulta.
        </p>
        <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full">
          {generating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Generando reporte...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" /> Generar reporte PDF
            </>
          )}
        </button>
      </div>
    </SectionCard>
  );
}

function AIAnalysisSection({ entries }: { entries: DigestiveEntry[] }) {
  const { isPremium } = usePremium();
  const correlations = useMemo(() => analyzeTriggers(entries), [entries]);

  return (
    <SectionCard
      icon={Brain}
      title="Análisis de Desencadenantes con IA"
      subtitle="Correlaciones entre alimentos y síntomas"
      locked={!isPremium}
      lockTitle="Análisis con IA Premium"
      lockDesc="Descubre qué alimentos aumentan tus síntomas y en qué porcentaje, con un análisis inteligente de tus registros."
    >
      {entries.length < 2 ? (
        <div className="text-center py-8">
          <Brain className="w-10 h-10 text-sage-200 mx-auto mb-3" />
          <p className="text-sm text-sage-500">
            Necesitas al menos un par de registros para que la IA pueda detectar patrones.
          </p>
        </div>
      ) : correlations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-sage-500">
            Aún no hay suficientes datos para identificar desencadenantes. Sigue registrando tus comidas.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-sage-50 rounded-2xl p-4 border border-sage-100">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-sage-600">
                <span className="font-semibold">Análisis inteligente:</span> Basado en tus {entries.length} registros, estos son los alimentos que más se asocian con tus malestares digestivos.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {correlations.map((c, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-sage-100 hover:border-sage-200 transition-colors"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    c.deltaPct > 0 ? 'bg-red-50' : 'bg-sage-50'
                  }`}
                >
                  {c.deltaPct > 0 ? (
                    <TrendingUp className="w-5 h-5 text-red-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-sage-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sage-700 text-sm">{c.food}</span>
                    <span className="text-xs text-sage-400">· {c.category}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-sage-500">
                      {c.occurrences} registro{c.occurrences !== 1 ? 's' : ''} · prom. {c.avgIntensity}/10
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-lg font-bold font-display ${
                      c.deltaPct > 0 ? 'text-red-500' : 'text-sage-500'
                    }`}
                  >
                    {c.deltaPct > 0 ? '+' : ''}{c.deltaPct}%
                  </span>
                  <p className="text-[10px] text-sage-400 uppercase tracking-wide">vs. promedio</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-sage-400 italic mt-3">
            * Análisis orientativo basado en tus registros. No sustituye el diagnóstico médico profesional.
          </p>
        </div>
      )}
    </SectionCard>
  );
}

function FodmapGuideSection() {
  const { isPremium } = usePremium();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'moderate' | 'high'>('all');

  const filtered = useMemo(() => {
    let list = FODMAP_FOODS;
    if (filter !== 'all') list = list.filter((f) => f.level === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    return list;
  }, [query, filter]);

  return (
    <SectionCard
      icon={BookOpen}
      title="Guía de Alimentos FODMAP"
      subtitle="Semáforo inteligente para Colon Irritable"
      locked={!isPremium}
      lockTitle="Guía FODMAP Premium"
      lockDesc="Consulta más de 60 alimentos con semáforo verde, amarillo y rojo según la dieta baja en FODMAPs para el SII."
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-sage-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar alimento... (ej: leche, cebolla, arroz)"
            className="input-clean pl-11"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {([
            { key: 'all', label: 'Todos', color: 'bg-sage-500 border-sage-500 text-white' },
            { key: 'low', label: 'Aptos', color: 'bg-sage-100 border-sage-300 text-sage-700' },
            { key: 'moderate', label: 'Moderados', color: 'bg-amber-100 border-amber-300 text-amber-700' },
            { key: 'high', label: 'Prohibidos', color: 'bg-red-100 border-red-300 text-red-700' },
          ] as const).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === f.key ? f.color : 'bg-white/60 border-sage-200 text-sage-500 hover:border-sage-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="max-h-[420px] overflow-y-auto scrollbar-thin space-y-2 pr-1">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-sage-400 py-8">
              No se encontraron alimentos para "{query}"
            </p>
          ) : (
            filtered.map((food, i) => <FoodRow key={i} food={food} />)
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-sage-400 pt-2 border-t border-sage-100">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sage-500" /> Apto</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Moderado</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Prohibido</span>
        </div>
      </div>
    </SectionCard>
  );
}

function FoodRow({ food }: { food: FodmapFood }) {
  const level = FODMAP_LEVELS[food.level];
  const Icon = food.level === 'low' ? Check : food.level === 'high' ? X : Circle;
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-sage-100 hover:border-sage-200 transition-colors">
      <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${level.color} border`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sage-700 text-sm">{food.name}</span>
          <span className="text-xs text-sage-400">· {food.category}</span>
        </div>
        <p className="text-xs text-sage-500 mt-0.5">{food.note}</p>
      </div>
      <span className={`chip ${level.color} border text-xs flex-shrink-0`}>
        <span className={`w-2 h-2 rounded-full ${level.dot}`} />
        {level.label}
      </span>
    </div>
  );
}

function StatBox({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center p-3 rounded-2xl bg-sage-50 border border-sage-100">
      <div className="text-2xl font-bold font-display text-sage-600">{value}</div>
      <div className="text-[11px] text-sage-400 uppercase tracking-wide mt-0.5">{label}</div>
    </div>
  );
}
