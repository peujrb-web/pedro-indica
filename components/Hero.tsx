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
    <section className="relative pt-8 pb-10 px-4 text-center max-w-2xl mx-auto overflow-hidden">
      {/* Background glow circle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Badge */}
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-brand-cyan text-xs font-semibold uppercase tracking-wider mb-5 shadow-neon-cyan">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{badge}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-4">
        {title?.split(' promoções ').map((part, index) => (
          index === 0 ? (
            <span key={index}>
              {part}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-brand-cyan to-magenta">
                promoções
              </span>
            </span>
          ) : (
            <span key={index}> {part}</span>
          )
        )) || title}
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-xl mx-auto">
        {subtitle}
      </p>

      {/* CTA Button */}
      <div className="mb-4">
        <button
          onClick={handleCtaClick}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-white bg-brand-whatsapp hover:bg-brand-whatsappHover transition-all transform active:scale-95 shadow-neon-lime touch-target border border-emerald-400/30"
        >
          <MessageCircleCode className="w-6 h-6 fill-white text-emerald-600" />
          <span>{ctaText}</span>
        </button>
      </div>

      {/* Trust Text */}
      <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{trustText}</span>
      </div>
    </section>
  );
}
