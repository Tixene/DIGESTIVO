import { useState } from 'react';
import { X, Check, Crown, Shield, Sparkles, CreditCard, Lock, FileText, BookOpen } from 'lucide-react';
import { usePremium } from '@/lib/premium';

const PRICE = '$2.990'; // CLP / mes — ajustable a tu moneda local

export function PaywallModal() {
  const { paywallOpen, setPaywallOpen, setIsPremium } = usePremium();
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  if (!paywallOpen) return null;

  const handlePay = () => {
    setProcessing(true);
    // Simulación del checkout de Mercado Pago
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => {
        setIsPremium(true);
        setPaywallOpen(false);
        setDone(false);
      }, 1400);
    }, 1800);
  };

  const handleClose = () => {
    if (processing) return;
    setPaywallOpen(false);
    setDone(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-sage-900/40 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-lift overflow-hidden animate-slide-up max-h-[92vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con colores Mercado Pago */}
        <div className="relative bg-gradient-to-br from-mp-deep via-mp-blue to-mp-blue px-6 pt-7 pb-8 text-white">
          <button
            onClick={handleClose}
            disabled={processing}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-5 h-5 text-mp-yellow" />
            <span className="text-sm font-semibold tracking-wide uppercase opacity-90">GutLog Premium</span>
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight mb-1.5">
            Identifica tus disparadores de dolor
          </h2>
          <p className="text-sm text-white/80">
            Suscríbete a Premium por {PRICE}/mes a través de Mercado Pago para identificar tus disparadores de dolor y exportar reportes médicos.
          </p>
        </div>

        {/* Benefits */}
        <div className="px-6 py-5">
          <div className="space-y-3">
            {[
              { icon: FileText, title: 'Reporte Clínico PDF', desc: 'Informe profesional para tu gastroenterólogo' },
              { icon: Sparkles, title: 'Análisis de Desencadenantes con IA', desc: 'Descubre qué alimentos aumentan tus síntomas' },
              { icon: BookOpen, title: 'Guía de Alimentos FODMAP', desc: 'Semáforo inteligente de más de 60 alimentos' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-sage-100 flex items-center justify-center">
                  <b.icon className="w-4.5 h-4.5 text-sage-600" />
                </div>
                <div>
                  <div className="font-medium text-sage-700 text-sm">{b.title}</div>
                  <div className="text-xs text-sage-500">{b.desc}</div>
                </div>
                <Check className="w-4 h-4 text-sage-500 mt-2.5 ml-auto flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Mercado Pago Checkout simulation */}
        <div className="px-6 pb-6">
          <div className="rounded-2xl border border-sage-100 bg-cream-50 p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-sage-600">Suscripción mensual</span>
              <span className="font-display text-xl font-bold text-sage-800">{PRICE}<span className="text-sm font-sans text-sage-400">/mes</span></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-sage-500 mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Pago seguro y recurrente · Cancela cuando quieras</span>
            </div>

            {/* Botón Mercado Pago */}
            <button
              onClick={handlePay}
              disabled={processing || done}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-mp-blue to-mp-deep hover:opacity-90 active:scale-[0.98] transition-all shadow-soft disabled:opacity-70"
            >
              {processing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Procesando pago...
                </>
              ) : done ? (
                <>
                  <Check className="w-5 h-5" /> ¡Pago aprobado!
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pagar con Mercado Pago
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-[11px] text-sage-400">
              <Lock className="w-3 h-3" />
              <span>Pago protegido por Mercado Pago</span>
            </div>
          </div>

          <p className="text-center text-xs text-sage-400">
            Al suscribirte aceptas el cargo mensual recurrente. Es una simulación de demostración del Checkout de Mercado Pago.
          </p>
        </div>
      </div>
    </div>
  );
}
