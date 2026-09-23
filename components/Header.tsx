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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-brand-dark/80 border-b border-slate-800/60 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-28 sm:h-11 sm:w-32 flex-shrink-0">
            <Image
              src={finalLogoUrl}
              alt="Pedro Indica"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <p className="hidden md:block text-xs text-slate-400 border-l border-slate-700 pl-3 max-w-xs">
            Promoções, cupons e oportunidades para você economizar.
          </p>
        </div>

        {/* Anchor Link */}
        <Link
          href="#grupos"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-cyan hover:text-cyan-300 transition-colors py-1.5 px-3 rounded-full bg-cyan-950/40 border border-cyan-500/30"
        >
          <span>Ver grupos</span>
          <ChevronDown className="w-4 h-4 animate-bounce text-brand-cyan" />
        </Link>
      </div>
    </header>
  );
}
