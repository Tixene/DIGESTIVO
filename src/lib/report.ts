import type { DigestiveEntry } from './supabase';
import { analyzeTriggers, groupByDate, formatDate } from './analytics';
import { MEAL_LABELS, BRISTOL_INFO } from './constants';

function bristolLabel(t: number | null): string {
  if (t === null) return '—';
  return BRISTOL_INFO.find((b) => b.type === t)?.label ?? String(t);
}

export function generateReportPDF(entries: DigestiveEntry[], userName: string): void {
  const sorted = [...entries].sort((a, b) => a.entry_date.localeCompare(b.entry_date));
  const grouped = groupByDate(sorted);
  const triggers = analyzeTriggers(sorted);
  const dates = Object.keys(grouped).sort();

  const avgIntensity =
    sorted.length > 0
      ? (sorted.reduce((s, e) => s + e.intensity, 0) / sorted.length).toFixed(1)
      : '0';

  const symptomCounts = {
    bloating: sorted.filter((e) => e.bloating).length,
    pain: sorted.filter((e) => e.pain).length,
    reflux: sorted.filter((e) => e.reflux).length,
    gas: sorted.filter((e) => e.gas).length,
  };

  const topTriggers = triggers.filter((t) => t.deltaPct > 0).slice(0, 5);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Reporte Clínico - Diario Digestivo</title>
<style>
  @page { margin: 24mm 18mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #283d28; line-height: 1.5; }
  .header { text-align: center; padding: 28px 0 20px; border-bottom: 2px solid #7faa7f; margin-bottom: 28px; }
  .header h1 { font-size: 22px; color: #477047; letter-spacing: 0.5px; }
  .header .sub { font-size: 13px; color: #5c8c5c; margin-top: 6px; }
  .meta { display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-bottom: 24px; padding: 12px 16px; background: #f4f8f4; border-radius: 8px; }
  .meta div { display: flex; gap: 6px; }
  .meta strong { color: #477047; }
  .section { margin-bottom: 28px; }
  .section h2 { font-size: 15px; color: #477047; border-left: 4px solid #7faa7f; padding-left: 10px; margin-bottom: 14px; }
  .stats { display: flex; gap: 12px; flex-wrap: wrap; }
  .stat { flex: 1; min-width: 110px; padding: 14px; background: #f4f8f4; border-radius: 8px; text-align: center; }
  .stat .num { font-size: 24px; font-weight: 700; color: #477047; }
  .stat .lbl { font-size: 11px; color: #666; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th { text-align: left; padding: 8px 10px; background: #e6f0e6; color: #477047; font-weight: 600; border-bottom: 2px solid #cfe0cf; }
  td { padding: 8px 10px; border-bottom: 1px solid #eef4ee; vertical-align: top; }
  tr:nth-child(even) td { background: #fafdf9; }
  .symptoms { font-size: 11px; }
  .symptom-tag { display: inline-block; padding: 2px 6px; border-radius: 4px; margin: 1px; background: #fde8e8; color: #a04040; }
  .intensity-bar { display: inline-block; width: 50px; height: 8px; background: #eee; border-radius: 4px; overflow: hidden; vertical-align: middle; }
  .intensity-fill { height: 100%; background: ${'linear-gradient(90deg, #7faa7f, #e0a040, #d97740)'}; }
  .trigger-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eef4ee; font-size: 12px; }
  .trigger-name { font-weight: 600; color: #477047; }
  .trigger-delta { font-weight: 700; }
  .positive { color: #d97740; }
  .footer { margin-top: 36px; padding-top: 16px; border-top: 1px solid #cfe0cf; font-size: 10px; color: #999; text-align: center; }
  .disclaimer { margin-top: 20px; padding: 12px 16px; background: #fff8e8; border-radius: 8px; font-size: 11px; color: #8a6d3b; border: 1px solid #f3e4c4; }
</style>
</head>
<body>
  <div class="header">
    <h1>REPORTE CLÍNICO DE SÍNTOMAS DIGESTIVOS</h1>
    <div class="sub">Diario Clínico · Síndrome de Intestino Irritable (SII) / SIBO</div>
  </div>

  <div class="meta">
    <div><strong>Paciente:</strong> ${escapeHtml(userName || 'Sin nombre')}</div>
    <div><strong>Generado:</strong> ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
    <div><strong>Período:</strong> ${dates[0] ? formatDate(dates[0]) : '—'} — ${dates[dates.length - 1] ? formatDate(dates[dates.length - 1]) : '—'}</div>
  </div>

  <div class="section">
    <h2>Resumen General</h2>
    <div class="stats">
      <div class="stat"><div class="num">${sorted.length}</div><div class="lbl">Registros</div></div>
      <div class="stat"><div class="num">${dates.length}</div><div class="lbl">Días con datos</div></div>
      <div class="stat"><div class="num">${avgIntensity}</div><div class="lbl">Intensidad promedio</div></div>
      <div class="stat"><div class="num">${symptomCounts.bloating}</div><div class="lbl">Hinchazón</div></div>
      <div class="stat"><div class="num">${symptomCounts.pain}</div><div class="lbl">Dolor</div></div>
      <div class="stat"><div class="num">${symptomCounts.gas}</div><div class="lbl">Gases</div></div>
      <div class="stat"><div class="num">${symptomCounts.reflux}</div><div class="lbl">Reflujo</div></div>
    </div>
  </div>

  ${
    topTriggers.length > 0
      ? `
  <div class="section">
    <h2>Principales Desencadenantes Detectados</h2>
    <p style="font-size:12px;color:#666;margin-bottom:10px">Alimentos cuya ingesta se asocia a mayor intensidad de síntomas:</p>
    ${topTriggers
      .map(
        (t) =>
          `<div class="trigger-row"><span class="trigger-name">${escapeHtml(t.food)} <span style="font-weight:400;color:#999">(${escapeHtml(t.category)})</span></span><span class="trigger-delta positive">+${t.deltaPct}% intensidad · ${t.occurrences} registros</span></div>`
      )
      .join('')}
  </div>`
      : ''
  }

  <div class="section">
    <h2>Detalle Diario de Comidas y Síntomas</h2>
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Comida</th>
          <th>Alimentos</th>
          <th>Síntomas</th>
          <th>Bristol</th>
          <th>Intensidad</th>
        </tr>
      </thead>
      <tbody>
        ${sorted
          .map((e) => {
            const symptoms: string[] = [];
            if (e.bloating) symptoms.push('Hinchazón');
            if (e.pain) symptoms.push('Dolor');
            if (e.reflux) symptoms.push('Reflujo');
            if (e.gas) symptoms.push('Gases');
            return `<tr>
              <td>${formatDate(e.entry_date)}</td>
              <td>${MEAL_LABELS[e.meal_type] ?? e.meal_type}</td>
              <td>${escapeHtml(e.foods || '—')}</td>
              <td class="symptoms">${symptoms.length ? symptoms.map((s) => `<span class="symptom-tag">${s}</span>`).join('') : '<span style="color:#999">Sin síntomas</span>'}</td>
              <td>${bristolLabel(e.bristol_type)}</td>
              <td><div class="intensity-bar"><div class="intensity-fill" style="width:${(e.intensity / 10) * 100}%"></div></div> <strong>${e.intensity}/10</strong></td>
            </tr>`;
          })
          .join('')}
      </tbody>
    </table>
  </div>

  <div class="disclaimer">
    <strong>Nota clínica:</strong> Este reporte es una herramienta de apoyo generada a partir del autorregistro del paciente. No constituye un diagnóstico médico. Los datos de correlación de desencadenantes son orientativos y deben interpretarse por un profesional de la salud en el contexto clínico completo del paciente.
  </div>

  <div class="footer">
    Generado por GutLog · Diario Clínico de Síntomas Digestivos<br>
    ${new Date().toLocaleString('es-ES')}
  </div>
</body>
</html>`;

  const w = window.open('', '_blank');
  if (!w) {
    alert('Por favor permite las ventanas emergentes para generar el reporte PDF.');
    return;
  }
  w.document.write(html);
  w.document.close();
  setTimeout(() => {
    w.focus();
    w.print();
  }, 400);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
