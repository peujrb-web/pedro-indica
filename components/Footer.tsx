'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface FooterProps {
  logoUrl?: string | null;
  footerText?: string | null;
  footerDisclaimer?: string | null;
}

export function Footer({
  logoUrl,
  footerText = 'Boas oportunidades, no momento certo.',
  footerDisclaimer = 'Os grupos são gratuitos. Não enviamos mensagens privadas solicitando pagamentos.',
}: FooterProps) {
  const finalLogoUrl = logoUrl || '/logo.png';

  return (
    <footer className="mt-12 border-t border-slate-800 bg-brand-dark/90 py-8 px-4 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="relative h-10 w-32">
          <Image
            src={finalLogoUrl}
            alt="Pedro Indica"
            fill
            className="object-contain"
          />
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-slate-300 max-w-md">
          {footerText}
        </p>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 max-w-md leading-relaxed">
          {footerDisclaimer}
        </p>

        {/* Discrete Admin Link */}
        <div className="mt-4 pt-4 border-t border-slate-900 w-full flex items-center justify-between text-[11px] text-slate-600">
          <span>&copy; {new Date().getFullYear()} Pedro Indica. Todos os direitos reservados.</span>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 transition-colors py-1 px-2 rounded"
          >
            <Lock className="w-3 h-3" />
            <span>Área Admin</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
