import type { DigestiveEntry } from './supabase';
import { FODMAP_FOODS } from './constants';

export interface TriggerCorrelation {
  food: string;
  category: string;
  occurrences: number;
  avgIntensity: number;
  maxIntensity: number;
  globalAvg: number;
  deltaPct: number;
}

const STOPWORDS = new Set([
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'con', 'sin', 'y', 'o',
  'en', 'al', 'del', 'para', 'por', 'mi', 'que', 'se', 'lo', 'le', 'les', 'su', 'sus',
  'muy', 'poco', 'mucho', 'algo', 'más', 'menos', 'a', 'e', 'i', 'u', 'es', 'son',
  'fui', 'con', 'como', 'no', 'si', 'sí', 'the', 'and', 'with', 'without',
]);

function tokenize(foods: string): string[] {
  return foods
    .toLowerCase()
    .split(/[\s,;.\-•·]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

function matchFodmapCategory(token: string): string | null {
  for (const food of FODMAP_FOODS) {
    if (food.name.toLowerCase().includes(token) || token.includes(food.name.toLowerCase().split(' ')[0])) {
      return food.category;
    }
  }
  return null;
}

export function analyzeTriggers(entries: DigestiveEntry[]): TriggerCorrelation[] {
  if (entries.length === 0) return [];

  const globalAvg =
    entries.reduce((sum, e) => sum + e.intensity, 0) / entries.length;

  const foodMap = new Map<string, { intensities: number[]; max: number; category: string }>();

  for (const entry of entries) {
    const tokens = tokenize(entry.foods);
    for (const token of tokens) {
      const category = matchFodmapCategory(token) ?? 'Otros';
      const existing = foodMap.get(token) ?? { intensities: [], max: 0, category };
      existing.intensities.push(entry.intensity);
      existing.max = Math.max(existing.max, entry.intensity);
      foodMap.set(token, existing);
    }
  }

  const correlations: TriggerCorrelation[] = [];
  for (const [food, data] of foodMap.entries()) {
    if (data.intensities.length < 1) continue;
    const avg = data.intensities.reduce((s, n) => s + n, 0) / data.intensities.length;
    const deltaPct = globalAvg > 0 ? Math.round(((avg - globalAvg) / globalAvg) * 100) : 0;
    correlations.push({
      food: food.charAt(0).toUpperCase() + food.slice(1),
      category: data.category,
      occurrences: data.intensities.length,
      avgIntensity: Math.round(avg * 10) / 10,
      maxIntensity: data.max,
      globalAvg: Math.round(globalAvg * 10) / 10,
      deltaPct,
    });
  }

  return correlations
    .filter((c) => c.occurrences >= 1)
    .sort((a, b) => Math.abs(b.deltaPct) - Math.abs(a.deltaPct))
    .slice(0, 12);
}

export function groupByDate(entries: DigestiveEntry[]): Record<string, DigestiveEntry[]> {
  const map: Record<string, DigestiveEntry[]> = {};
  for (const e of entries) {
    if (!map[e.entry_date]) map[e.entry_date] = [];
    map[e.entry_date].push(e);
  }
  return map;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

export function todayStr(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().split('T')[0];
}
