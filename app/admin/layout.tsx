'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Layers, Settings, LogOut, ExternalLink, ShieldCheck } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    }
  };

  const navItems = [
    { label: 'Grupos de WhatsApp', href: '/admin', icon: Layers },
    { label: 'Configurações & Marca', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-brand-dark/95 border-b border-slate-800 px-4 py-3.5 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="relative h-10 w-32 sm:h-11 sm:w-36 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Pedro Indica Admin"
                fill
                className="object-contain object-left"
              />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] font-extrabold shadow-neon-lime">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Painel Protegido
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-brand-cyan transition-colors px-3 py-1.5 rounded-xl border border-slate-800 hover:border-cyan-500/40 bg-slate-900/60"
            >
              <span>Ver Site Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors px-3 py-1.5 rounded-xl border border-red-500/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-6xl mx-auto flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-950/90 text-brand-cyan border border-cyan-500/50 shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Admin Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
