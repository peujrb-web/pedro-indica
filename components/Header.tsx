'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';

interface HeaderProps {
  logoUrl?: string | null;
}

export function Header({ logoUrl }: HeaderProps) {
  const finalLogoUrl = logoUrl || '/logo.png';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-brand-dark/85 border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo Pedro Indica com Destaque Neon e Aura */}
        <div className="flex items-center gap-3">
          <Link href="/" className="logo-container group">
            <div className="relative h-10 w-32 sm:h-12 sm:w-36 flex-shrink-0">
              <Image
                src={finalLogoUrl}
                alt="Pedro Indica"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          <p className="hidden md:block text-xs text-slate-300 border-l border-slate-700/80 pl-3 max-w-xs leading-tight">
            Promoções, cupons e oportunidades para você economizar.
          </p>
        </div>

        {/* Botão Âncora para Ver Grupos */}
        <Link
          href="#grupos"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-brand-cyan to-brand-lime hover:from-cyan-300 hover:to-emerald-300 transition-all py-2 px-4 rounded-full shadow-neon-cyan active:scale-95 touch-target"
        >
          <span>Ver grupos</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-slate-950" />
        </Link>
      </div>
    </header>
  );
}
