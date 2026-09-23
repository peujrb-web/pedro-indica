'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { SiteSettings } from '@/lib/types';
import { SiteSettingsSchema } from '@/lib/validations';
import {
  Settings,
  Upload,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Search,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Toggle de Pré-visualização
  const [showPreview, setShowPreview] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'default')
          .single();

        if (!error && data) {
          setSettings({ ...defaultSettings, ...data });
        }
      } catch {
        setSettings(defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `brand/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('pedro-indica-assets')
        .upload(filePath, file);

      if (uploadError) {
        // Fallback local se a storage ainda não foi inicializada no Supabase remoto
        const reader = new FileReader();
        reader.onloadend = () => {
          setSettings((prev) => ({ ...prev, logo_url: reader.result as string }));
          setUploadingLogo(false);
        };
        reader.readAsDataURL(file);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('pedro-indica-assets')
        .getPublicUrl(filePath);

      setSettings((prev) => ({ ...prev, logo_url: publicUrlData.publicUrl }));
    } catch {
      setErrorMsg('Falha ao enviar logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    // Validação com Zod
    const validation = SiteSettingsSchema.safeParse(settings);
    if (!validation.success) {
      const firstErr = validation.error.errors[0]?.message || 'Verifique os campos inseridos.';
      setErrorMsg(firstErr);
      setSaving(false);
      return;
    }

    const payload = {
      ...settings,
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert(payload);

      if (!error) {
        await supabase.from('audit_logs').insert({
          action: 'UPDATE_SETTINGS',
          details: { updated_at: payload.updated_at },
        });
      }

      setSuccessMsg('Configurações e textos do site publicados com sucesso!');
    } catch {
      setErrorMsg('Erro inesperado ao salvar configurações.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 glass-card rounded-2xl border border-slate-800">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-brand-cyan mb-3" />
        <p className="text-sm">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-5 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-cyan" />
            Configurações do Site & Marca
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Altere os textos do Hero, Benefícios, Rodapé, Logo da marca e metadados de SEO sem tocar no código.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors border ${
              showPreview
                ? 'bg-cyan-950 text-brand-cyan border-cyan-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Ocultar Prévia' : 'Pré-visualizar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Painel de Pré-visualização ao Vivo */}
      {showPreview && (
        <div className="glass-card p-6 rounded-2xl border border-brand-cyan/40 bg-radial-gradient space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Pré-visualização em tempo real da Landing Page
            </span>
            <span className="text-[11px] text-slate-400">Modo de Teste</span>
          </div>

          {/* Mini Header Preview */}
          <div className="flex items-center justify-between p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="relative h-8 w-28">
              <Image
                src={settings.logo_url || '/logo.png'}
                alt="Logo Preview"
                fill
                className="object-contain object-left"
              />
            </div>
            <span className="text-xs text-brand-cyan font-semibold">Ver grupos ↓</span>
          </div>

          {/* Hero Preview */}
          <div className="text-center py-4 px-2 space-y-3">
            <span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full bg-cyan-950 text-brand-cyan border border-cyan-500/30">
              {settings.hero_badge}
            </span>
            <h2 className="text-lg font-extrabold text-white">{settings.hero_title}</h2>
            <p className="text-xs text-slate-300">{settings.hero_subtitle}</p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-brand-whatsapp text-white shadow-lg">
                <MessageCircle className="w-4 h-4" />
                {settings.cta_text}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {settings.trust_text}
            </p>
          </div>
        </div>
      )}

      {/* Formulário Principal de Configurações */}
      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Bloco 1: Logo da Marca */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <ImageIcon className="w-5 h-5 text-brand-cyan" />
            Logo da Marca "Pedro Indica"
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-40 h-16 rounded-xl bg-slate-900 border border-slate-700 p-2 flex items-center justify-center">
              <Image
                src={settings.logo_url || '/logo.png'}
                alt="Logo Atual"
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-cyan cursor-pointer text-xs font-semibold text-white transition-colors">
                <Upload className="w-4 h-4 text-brand-cyan" />
                <span>{uploadingLogo ? 'Enviando nova logo...' : 'Substituir Logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400">
                Formatos recomendados: PNG ou SVG transparente. Exibida no topo e login admin.
              </p>
            </div>
          </div>
        </div>

        {/* Bloco 2: Seção Hero */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-5 h-5 text-brand-lime" />
            Textos do Hero (Principal)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selo Superior (Badge)
              </label>
              <input
                type="text"
                required
                value={settings.hero_badge || ''}
                onChange={(e) => setSettings({ ...settings, hero_badge: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Texto do Botão CTA
              </label>
              <input
                type="text"
                required
                value={settings.cta_text || ''}
                onChange={(e) => setSettings({ ...settings, cta_text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título Principal Chamativo
              </label>
              <input
                type="text"
                required
                value={settings.hero_title || ''}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Subtítulo Explicativo
              </label>
              <textarea
                rows={2}
                required
                value={settings.hero_subtitle || ''}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Texto de Confiança abaixo do Botão
              </label>
              <input
                type="text"
                required
                value={settings.trust_text || ''}
                onChange={(e) => setSettings({ ...settings, trust_text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 3: Benefícios */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-5 h-5 text-brand-yellow" />
            Seção de 3 Benefícios
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Título da Seção de Benefícios
            </label>
            <input
              type="text"
              required
              value={settings.benefits_title || ''}
              onChange={(e) => setSettings({ ...settings, benefits_title: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Benefício 1 */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-brand-cyan">Benefício 1</span>
              <input
                type="text"
                required
                value={settings.benefit_1_title || ''}
                onChange={(e) => setSettings({ ...settings, benefit_1_title: e.target.value })}
                placeholder="Título 1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <textarea
                rows={2}
                required
                value={settings.benefit_1_desc || ''}
                onChange={(e) => setSettings({ ...settings, benefit_1_desc: e.target.value })}
                placeholder="Descrição 1"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
              />
            </div>

            {/* Benefício 2 */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-brand-yellow">Benefício 2</span>
              <input
                type="text"
                required
                value={settings.benefit_2_title || ''}
                onChange={(e) => setSettings({ ...settings, benefit_2_title: e.target.value })}
                placeholder="Título 2"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <textarea
                rows={2}
                required
                value={settings.benefit_2_desc || ''}
                onChange={(e) => setSettings({ ...settings, benefit_2_desc: e.target.value })}
                placeholder="Descrição 2"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
              />
            </div>

            {/* Benefício 3 */}
            <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-brand-magenta">Benefício 3</span>
              <input
                type="text"
                required
                value={settings.benefit_3_title || ''}
                onChange={(e) => setSettings({ ...settings, benefit_3_title: e.target.value })}
                placeholder="Título 3"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white"
              />
              <textarea
                rows={2}
                required
                value={settings.benefit_3_desc || ''}
                onChange={(e) => setSettings({ ...settings, benefit_3_desc: e.target.value })}
                placeholder="Descrição 3"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 4: Rodapé & Disclaimer */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-5 h-5 text-brand-magenta" />
            Rodapé & Avisos Legais
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Frase do Rodapé
              </label>
              <input
                type="text"
                required
                value={settings.footer_text || ''}
                onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Aviso Legal de Gratuidade
              </label>
              <input
                type="text"
                required
                value={settings.footer_disclaimer || ''}
                onChange={(e) => setSettings({ ...settings, footer_disclaimer: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bloco 5: SEO & Compartilhamento */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Search className="w-5 h-5 text-brand-cyan" />
            Configurações de SEO e Compartilhamento Social
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título Meta SEO (Aparece no Google)
              </label>
              <input
                type="text"
                required
                value={settings.seo_title || ''}
                onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descrição Meta SEO
              </label>
              <textarea
                rows={2}
                required
                value={settings.seo_description || ''}
                onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Botão de Ação Flutuante/Fixo */}
        <div className="pt-2 sticky bottom-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-slate-950 bg-brand-cyan hover:bg-cyan-300 transition-colors shadow-neon-cyan touch-target disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Publicando Alterações...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Publicar Alterações</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
