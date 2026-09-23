'use client';

import { useState, useEffect } from 'react';
import { Group, SiteSettings } from '@/lib/types';
import { initialGroups, initialSiteSettings } from '@/lib/data/initial-data';
import { getStoredGroups, getStoredSettings } from '@/lib/local-storage';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GroupCard } from '@/components/GroupCard';
import { Benefits } from '@/components/Benefits';
import { Footer } from '@/components/Footer';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { Sparkles } from 'lucide-react';

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  useEffect(() => {
    // Sincronizar dados gerenciados pelo painel administrativo
    const storedSettings = getStoredSettings();
    const storedGroups = getStoredGroups();

    setSettings(storedSettings);
    
    // Filtrar apenas grupos ativos e ordenar por sort_order
    const activeGroups = storedGroups
      .filter((g) => g.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);

    setGroups(activeGroups.length > 0 ? activeGroups : initialGroups);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-radial-gradient">
      {/* Rastreamento de Analytics */}
      <AnalyticsTracker groups={groups} />

      {/* Cabeçalho */}
      <Header logoUrl={settings.logo_url} />

      {/* Main Content */}
      <main className="flex-1">
        {/* Seção Hero */}
        <Hero
          badge={settings.hero_badge}
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
          ctaText={settings.cta_text}
          trustText={settings.trust_text}
        />

        {/* Seção Lista de Grupos */}
        <section id="grupos" className="py-8 px-4 max-w-4xl mx-auto scroll-mt-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-brand-lime uppercase tracking-widest bg-emerald-950/60 px-4 py-1.5 rounded-full border border-emerald-500/40 mb-3 shadow-neon-lime">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canais de transmissao</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Escolha seu grupo
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              Selecione os temas de seu interesse e entre agora no WhatsApp
            </p>
          </div>

          {/* Grid de Cards (1 col no mobile, 2 ou 3 cols em desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </section>

        {/* Seção de Benefícios */}
        <Benefits
          title={settings.benefits_title}
          b1Title={settings.benefit_1_title}
          b1Desc={settings.benefit_1_desc}
          b2Title={settings.benefit_2_title}
          b2Desc={settings.benefit_2_desc}
          b3Title={settings.benefit_3_title}
          b3Desc={settings.benefit_3_desc}
        />
      </main>

      {/* Rodapé */}
      <Footer
        logoUrl={settings.logo_url}
        footerText={settings.footer_text}
        footerDisclaimer={settings.footer_disclaimer}
      />
    </div>
  );
}
