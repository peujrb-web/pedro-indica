'use client';

import Image from 'next/image';
import { Group } from '@/lib/types';
import { MessageCircle, Star, ArrowUpRight } from 'lucide-react';
import { trackGroupJoinClick } from '@/lib/analytics';

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const isPopular = group.is_popular || group.badge?.toLowerCase().includes('popular');

  const handleJoin = () => {
    trackGroupJoinClick(group.id, group.title, group.invite_link);
  };

  return (
    <div
      className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 ${
        isPopular ? 'glass-card-popular' : 'glass-card hover:border-brand-cyan/50 hover:shadow-neon-cyan'
      }`}
    >
      {/* Badge Popular ou Badge Customizada */}
      {(group.badge || isPopular) && (
        <div className="absolute -top-3.5 right-4 z-10">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider ${
              isPopular
                ? 'bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-400 text-slate-950 shadow-neon-lime'
                : 'bg-cyan-950 text-brand-cyan border border-cyan-500/50 shadow-neon-cyan'
            }`}
          >
            {isPopular && <Star className="w-3.5 h-3.5 fill-slate-950" />}
            {group.badge || 'Mais popular'}
          </span>
        </div>
      )}

      {/* Conteúdo do Card */}
      <div>
        <div className="flex items-start gap-4 mb-3">
          {/* Imagem/Ícone do Grupo */}
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
            {group.image_url ? (
              <Image
                src={group.image_url}
                alt={group.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base font-extrabold text-white leading-snug line-clamp-2 pr-12">
              {group.title}
            </h3>
            {group.description && (
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed font-medium">
                {group.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Botão CTA do Grupo */}
      <div className="mt-4 pt-2">
        <a
          href={group.invite_link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleJoin}
          className={`w-full inline-flex items-center justify-center gap-2 px-4 rounded-xl font-bold text-sm transition-all touch-target active:scale-95 ${
            isPopular
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-neon-lime'
              : 'bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-brand-cyan'
          }`}
        >
          <MessageCircle className="w-5 h-5 text-emerald-300 fill-emerald-300/20" />
          <span>Entrar no grupo</span>
          <ArrowUpRight className="w-4 h-4 opacity-80" />
        </a>
      </div>
    </div>
  );
}
