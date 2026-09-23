'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  logoUrl?: string | null;
}

export function Header({ logoUrl }: HeaderProps) {
  const finalLogoUrl = logoUrl || '/logo.png';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-brand-dark/90 border-b border-slate-800/80 px-4 py-3.5">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo Pedro Indica com Exibição Limpa, Elegante e Redimensionada */}
        <div className="flex items-center gap-3">
          <Link href="/" className="relative h-12 w-40 sm:h-14 sm:w-48 flex-shrink-0 transition-transform hover:scale-105">
            <Image
              src={finalLogoUrl}
              alt="Pedro Indica"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          <p className="hidden md:block text-xs font-semibold text-slate-300 border-l border-slate-700/80 pl-3 max-w-xs leading-tight">
            Promoções, cupons e oportunidades para você economizar.
          </p>
        </div>

        {/* Botão Âncora para Ver Grupos */}
        <Link
          href="#grupos"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-brand-cyan to-brand-lime hover:from-cyan-300 hover:to-emerald-300 transition-all py-2.5 px-4 sm:px-5 rounded-full shadow-neon-lime active:scale-95 touch-target"
        >
          <span>Ver grupos</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-slate-950" />
        </Link>
      </div>
    </header>
  );
}
