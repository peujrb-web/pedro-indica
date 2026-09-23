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
      className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
        isPopular ? 'glass-card-popular shadow-neon-lime' : 'glass-card hover:border-slate-700'
      }`}
    >
      {/* Badge Popular ou Badge Customizada */}
      {(group.badge || isPopular) && (
        <div className="absolute -top-3 right-4 z-10">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
              isPopular
                ? 'bg-gradient-to-r from-emerald-500 to-lime-400 text-slate-950 shadow-md'
                : 'bg-cyan-950 text-brand-cyan border border-cyan-500/40'
            }`}
          >
            {isPopular && <Star className="w-3 h-3 fill-slate-950" />}
            {group.badge || 'Mais popular'}
          </span>
        </div>
      )}

      {/* Conteúdo do Card */}
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          {/* Imagem/Ícone do Grupo */}
          <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-700 flex items-center justify-center">
            {group.image_url ? (
              <Image
                src={group.image_url}
                alt={group.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-white leading-snug line-clamp-2 pr-16">
              {group.title}
            </h3>
            {group.description && (
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
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
          className={`w-full inline-flex items-center justify-center gap-2 px-4 rounded-xl font-bold text-sm transition-all touch-target ${
            isPopular
              ? 'bg-brand-whatsapp hover:bg-brand-whatsappHover text-white shadow-lg'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
          }`}
        >
          <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
          <span>Entrar no grupo</span>
          <ArrowUpRight className="w-4 h-4 opacity-70" />
        </a>
      </div>
    </div>
  );
}
