'use client';

import { Sparkles, MessageCircleCode, ShieldCheck } from 'lucide-react';
import { trackGroupCtaClick } from '@/lib/analytics';

interface HeroProps {
  badge?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ctaText?: string | null;
  trustText?: string | null;
}

export function Hero({
  badge = 'Comunidade de ofertas',
  title = 'Entre nos grupos e receba promoções que valem a pena.',
  subtitle = 'Achados, descontos e cupons selecionados diretamente no seu WhatsApp.',
  ctaText = 'Ver grupos disponíveis',
  trustText = 'Gratuito • Sem spam • Saia quando quiser',
}: HeroProps) {

  const handleCtaClick = () => {
    trackGroupCtaClick('hero_cta');
    const target = document.getElementById('grupos');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-10 pb-12 px-4 text-center max-w-2xl mx-auto overflow-hidden">
      {/* Luz de fundo radial com degradê ambiente */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-brand-cyan/20 via-brand-lime/15 to-brand-magenta/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Badge com Degradê Neon */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-brand-cyan/50 text-brand-cyan text-xs font-extrabold uppercase tracking-widest mb-6 shadow-neon-cyan">
        <Sparkles className="w-4 h-4 text-brand-lime animate-pulse" />
        <span className="bg-gradient-to-r from-brand-cyan to-brand-lime bg-clip-text text-transparent">
          {badge}
        </span>
      </div>

      {/* Título Principal com Degradê Multicor Vibrante */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-5">
        <span className="text-white">Entre nos grupos e receba </span>
        <span className="text-gradient-neon block sm:inline mt-1 sm:mt-0">
          promoções que valem a pena
        </span>
      </h1>

      {/* Subtítulo */}
      <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl mx-auto font-medium">
        {subtitle}
      </p>

      {/* Botão CTA Principal com WhatsApp Icon & Glow */}
      <div className="mb-5">
        <button
          onClick={handleCtaClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-2xl font-extrabold text-base sm:text-lg text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all transform active:scale-95 shadow-neon-lime touch-target border border-emerald-300/40"
        >
          <MessageCircleCode className="w-7 h-7 fill-white text-emerald-700" />
          <span>{ctaText}</span>
        </button>
      </div>

      {/* Texto de Confiança */}
      <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 bg-slate-900/60 px-4 py-1.5 rounded-full border border-slate-800">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{trustText}</span>
      </div>
    </section>
  );
}
