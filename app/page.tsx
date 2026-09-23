import { createClient } from '@/lib/supabase/server';
import { Group, SiteSettings } from '@/lib/types';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { GroupCard } from '@/components/GroupCard';
import { Benefits } from '@/components/Benefits';
import { Footer } from '@/components/Footer';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { Sparkles } from 'lucide-react';

export const revalidate = 0; // Garantir dados sempre atualizados

// Fallback padrão com os 6 links de grupos e textos padrão
const defaultGroups: Group[] = [
  {
    id: 'g1',
    title: 'Grupo 1 - Ofertas Diárias',
    description: 'Principais cupons de desconto e achados imperdíveis de tecnologia, casa e moda.',
    invite_link: 'https://chat.whatsapp.com/DexDPbamt3LHxb1qMZbqZl',
    image_url: null,
    badge: 'Mais popular',
    is_popular: true,
    is_active: true,
    sort_order: 1,
  },
  {
    id: 'g2',
    title: 'Grupo 2 - Cupons Exclusivos',
    description: 'Cupons testados e atualizados a todo momento para grandes lojas online.',
    invite_link: 'https://chat.whatsapp.com/II7RwnGiu5oFyIWbMwnDdA',
    image_url: null,
    badge: 'Vagas limitadas',
    is_popular: false,
    is_active: true,
    sort_order: 2,
  },
  {
    id: 'g3',
    title: 'Grupo 3 - Achadinhos do Pedro',
    description: 'Promoções relâmpago e menor preço histórico garimpados diariamente.',
    invite_link: 'https://chat.whatsapp.com/DtTTihP0wNq9YrBQaAVniP',
    image_url: null,
    badge: 'Seleção VIP',
    is_popular: false,
    is_active: true,
    sort_order: 3,
  },
  {
    id: 'g4',
    title: 'Grupo 4 - Eletrônicos & Tech',
    description: 'Smartphones, notebooks, fones e gadgets com super descontos.',
    invite_link: 'https://chat.whatsapp.com/CcBPwQ7QNDCHw4l8P2w4bV',
    image_url: null,
    badge: 'Tecnologia',
    is_popular: false,
    is_active: true,
    sort_order: 4,
  },
  {
    id: 'g5',
    title: 'Grupo 5 - Casa & Utilitários',
    description: 'Eletrodomésticos, decoração e itens para o lar com preços especiais.',
    invite_link: 'https://chat.whatsapp.com/K31ICDiu9K35QnfhZHxdps',
    image_url: null,
    badge: 'Casa & Lar',
    is_popular: false,
    is_active: true,
    sort_order: 5,
  },
  {
    id: 'g6',
    title: 'Grupo 6 - Bug de Preço & Relâmpago',
    description: 'Erros de precificação e ofertas ultra rápidas que duram poucos minutos.',
    invite_link: 'https://chat.whatsapp.com/LXHsVJ7jojr81z39KGlsfM',
    image_url: null,
    badge: 'Alerta urgente',
    is_popular: false,
    is_active: true,
    sort_order: 6,
  },
];

const defaultSettings: SiteSettings = {
  id: 'default',
  logo_url: '/logo.png',
  hero_badge: 'Comunidade de ofertas',
  hero_title: 'Entre nos grupos e receba promoções que valem a pena.',
  hero_subtitle: 'Achados, descontos e cupons selecionados diretamente no seu WhatsApp.',
  cta_text: 'Ver grupos disponíveis',
  trust_text: 'Gratuito • Sem spam • Saia quando quiser',
  benefits_title: 'Por que fazer parte da nossa comunidade?',
  benefit_1_title: 'Ofertas selecionadas',
  benefit_1_desc: 'Só compartilhamos oportunidades que merecem sua atenção.',
  benefit_2_title: 'Direto no WhatsApp',
  benefit_2_desc: 'As melhores promoções chegam sem você precisar procurar.',
  benefit_3_title: 'Grupos organizados',
  benefit_3_desc: 'Entre apenas nos temas que realmente interessam a você.',
  footer_text: 'Boas oportunidades, no momento certo.',
  footer_disclaimer: 'Os grupos são gratuitos. Não enviamos mensagens privadas solicitando pagamentos.',
  seo_title: 'Pedro Indica - Promoções, Cupons e Oportunidades no WhatsApp',
  seo_description: 'Receba em primeira mão ofertas imperdíveis e cupons de desconto selecionados no seu WhatsApp.',
  seo_og_image: null,
};

async function getLandingData() {
  try {
    const supabase = await createClient();

    // Carregar configurações
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    // Carregar grupos ativos ordenados
    const { data: groupsData } = await supabase
      .from('groups')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    const settings: SiteSettings = settingsData ? { ...defaultSettings, ...settingsData } : defaultSettings;
    const groups: Group[] = (groupsData && groupsData.length > 0) ? groupsData : defaultGroups;

    return { settings, groups };
  } catch (error) {
    // Retorna fallback limpo em caso de erro de conexão inicial com o banco
    return { settings: defaultSettings, groups: defaultGroups };
  }
}

export default async function HomePage() {
  const { settings, groups } = await getLandingData();

  return (
    <div className="min-h-screen flex flex-col bg-radial-gradient">
      {/* Rastreamento de Analytics no Cliente */}
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
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-lime uppercase tracking-widest bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Canais de transmissao</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Escolha seu grupo
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
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
