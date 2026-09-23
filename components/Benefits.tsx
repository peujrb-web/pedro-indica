'use client';

import { CheckCircle2, Zap, Layers } from 'lucide-react';

interface BenefitsProps {
  title?: string | null;
  b1Title?: string | null;
  b1Desc?: string | null;
  b2Title?: string | null;
  b2Desc?: string | null;
  b3Title?: string | null;
  b3Desc?: string | null;
}

export function Benefits({
  title = 'Por que fazer parte da nossa comunidade?',
  b1Title = 'Ofertas selecionadas',
  b1Desc = 'Só compartilhamos oportunidades que merecem sua atenção.',
  b2Title = 'Direto no WhatsApp',
  b2Desc = 'As melhores promoções chegam sem você precisar procurar.',
  b3Title = 'Grupos organizados',
  b3Desc = 'Entre apenas nos temas que realmente interessam a você.',
}: BenefitsProps) {
  const benefitsList = [
    {
      icon: CheckCircle2,
      color: 'text-brand-cyan',
      bg: 'bg-cyan-950/40 border-cyan-500/30',
      title: b1Title,
      desc: b1Desc,
    },
    {
      icon: Zap,
      color: 'text-brand-yellow',
      bg: 'bg-yellow-950/40 border-yellow-500/30',
      title: b2Title,
      desc: b2Desc,
    },
    {
      icon: Layers,
      color: 'text-brand-magenta',
      bg: 'bg-pink-950/40 border-pink-500/30',
      title: b3Title,
      desc: b3Desc,
    },
  ];

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto border-t border-slate-800/80">
      <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-8">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {benefitsList.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="glass-card p-5 rounded-2xl flex flex-col items-start gap-3 border border-slate-800"
            >
              <div className={`p-3 rounded-xl border ${item.bg}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
