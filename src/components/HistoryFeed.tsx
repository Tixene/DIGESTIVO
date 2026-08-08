import { Coffee, Sun, Moon, Cookie, Wind, Flame, Droplet, Circle, Calendar } from 'lucide-react';
import type { DigestiveEntry, MealType } from '@/lib/supabase';
import { MEAL_LABELS, BRISTOL_INFO } from '@/lib/constants';
import { groupByDate, formatDate, formatShortDate } from '@/lib/analytics';

const MEAL_ICONS: Record<MealType, typeof Coffee> = {
  desayuno: Coffee,
  almuerzo: Sun,
  cena: Moon,
  snacks: Cookie,
};

interface Props {
  entries: DigestiveEntry[];
  loading: boolean;
}

export function HistoryFeed({ entries, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card p-5 animate-pulse">
            <div className="h-4 w-32 bg-sage-100 rounded mb-4" />
            <div className="h-20 bg-sage-50 rounded-2xl" />
          </div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="card p-10 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-sage-100 flex items-center justify-center mb-4">
          <Calendar className="w-7 h-7 text-sage-400" />
        </div>
        <h3 className="font-display text-lg font-semibold text-sage-700 mb-1.5">
          Aún no hay registros
        </h3>
        <p className="text-sm text-sage-500 max-w-xs mx-auto">
          Cuando registres tus comidas y síntomas, aparecerán aquí ordenados por día para que lleves un control simple.
        </p>
      </div>
    );
  }

  const grouped = groupByDate(entries);
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-5">
      {dates.map((date) => {
        const dayEntries = grouped[date].sort((a, b) => a.created_at.localeCompare(b.created_at));
        const avgIntensity = Math.round(
          (dayEntries.reduce((s, e) => s + e.intensity, 0) / dayEntries.length) * 10
        ) / 10;
        const hasSymptoms = dayEntries.some((e) => e.bloating || e.pain || e.reflux || e.gas);

        return (
          <div key={date} className="animate-slide-up">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage-400" />
                <h3 className="font-display text-base font-semibold text-sage-700 capitalize">
                  {formatDate(date)}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {hasSymptoms && (
                  <span className="chip bg-amber-50 text-amber-600 text-xs">
                    {avgIntensity}/10 malestar
                  </span>
                )}
                <span className="text-xs text-sage-400">{formatShortDate(date)}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {dayEntries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function EntryCard({ entry }: { entry: DigestiveEntry }) {
  const Icon = MEAL_ICONS[entry.meal_type];
  const symptoms: { label: string; icon: typeof Wind }[] = [];
  if (entry.bloating) symptoms.push({ label: 'Hinchazón', icon: Wind });
  if (entry.pain) symptoms.push({ label: 'Dolor', icon: Flame });
  if (entry.reflux) symptoms.push({ label: 'Reflujo', icon: Flame });
  if (entry.gas) symptoms.push({ label: 'Gases', icon: Wind });

  const intensityColor =
    entry.intensity <= 3
      ? 'bg-sage-400'
      : entry.intensity <= 6
      ? 'bg-amber-400'
      : 'bg-red-400';

  const bristolInfo = entry.bristol_type !== null
    ? BRISTOL_INFO.find((b) => b.type === entry.bristol_type)
    : null;

  return (
    <div className="card p-4 hover:shadow-card transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-sage-100 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-sage-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-sage-700 text-sm">
              {MEAL_LABELS[entry.meal_type]}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-sage-200" />
                <div className="w-16 h-1.5 rounded-full bg-sage-100 overflow-hidden">
                  <div
                    className={`h-full ${intensityColor}`}
                    style={{ width: `${(entry.intensity / 10) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-sage-600">{entry.intensity}/10</span>
            </div>
          </div>
          <p className="text-sm text-sage-600 mb-2 break-words">{entry.foods || 'Sin alimentos registrados'}</p>

          {(symptoms.length > 0 || bristolInfo) && (
            <div className="flex flex-wrap items-center gap-1.5">
              {symptoms.map((s, i) => (
                <span
                  key={i}
                  className="chip bg-amber-50 text-amber-600 border border-amber-200 text-xs"
                >
                  <s.icon className="w-3 h-3" />
                  {s.label}
                </span>
              ))}
              {bristolInfo && (
                <span className="chip bg-sage-50 text-sage-600 border border-sage-200 text-xs">
                  <Droplet className="w-3 h-3" />
                  Bristol {bristolInfo.type}
                </span>
              )}
            </div>
          )}

          {entry.notes && (
            <p className="mt-2 text-xs text-sage-400 italic flex items-center gap-1.5">
              <Circle className="w-2.5 h-2.5" />
              {entry.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
