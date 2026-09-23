'use client';

import { useState, useEffect } from 'react';
import { SiteSettings } from '@/lib/types';
import { SiteSettingsSchema } from '@/lib/validations';
import { initialSiteSettings } from '@/lib/data/initial-data';
import {
  getStoredSettings,
  saveStoredSettings,
  getStoredAdminPassword,
  saveStoredAdminPassword
} from '@/lib/local-storage';
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
  ShieldCheck,
  Key,
  RotateCcw
} from 'lucide-react';
import Image from 'next/image';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(initialSiteSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Alteração de Senha
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggle de Pré-visualização
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const loaded = getStoredSettings();
    setSettings(loaded);
    setLoading(false);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSettings((prev) => ({ ...prev, logo_url: reader.result as string }));
      setUploadingLogo(false);
      setSuccessMsg('Logo carregada! Clique em "Publicar Alterações" para salvar.');
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    // Validação Zod
    const validation = SiteSettingsSchema.safeParse(settings);
    if (!validation.success) {
      const firstErr = validation.error.errors[0]?.message || 'Verifique os campos inseridos.';
      setErrorMsg(firstErr);
      setSaving(false);
      return;
    }

    // Processar nova senha se preenchida
    if (newPassword || confirmPassword) {
      if (newPassword.length < 4) {
        setErrorMsg('A nova senha deve ter pelo menos 4 caracteres.');
        setSaving(false);
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('As senhas digitadas não coincidem.');
        setSaving(false);
        return;
      }
      saveStoredAdminPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
    }

    // Salvar configurações no LocalStorage
    saveStoredSettings(settings);
    setSuccessMsg('Configurações do site e marca salvas com sucesso!');
    setSaving(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleResetSettingsDefaults = () => {
    if (confirm('Restaurar os textos e logo para a configuração padrão?')) {
      setSettings(initialSiteSettings);
      saveStoredSettings(initialSiteSettings);
      setSuccessMsg('Configurações restauradas para o padrão!');
      setTimeout(() => setSuccessMsg(null), 3000);
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
          <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
            Altere os textos do Hero, Benefícios, Rodapé, Logo da marca e Senha de Acesso.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetSettingsDefaults}
            title="Restaurar padrão"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Padrão</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all border ${
              showPreview
                ? 'bg-cyan-950 text-brand-cyan border-cyan-500/50 shadow-neon-cyan'
                : 'bg-slate-900 text-slate-200 border-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPreview ? 'Ocultar Prévia' : 'Pré-visualizar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Alertas */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Painel de Pré-visualização ao Vivo */}
      {showPreview && (
        <div className="glass-card p-6 rounded-2xl border border-brand-cyan/50 bg-radial-gradient space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-lime" />
              Pré-visualização em tempo real da Landing Page
            </span>
            <span className="text-[11px] text-slate-400">Modo de Teste</span>
          </div>

          {/* Mini Header Preview */}
          <div className="flex items-center justify-between p-3 bg-slate-950/90 rounded-xl border border-slate-800">
            <div className="logo-container py-0.5 px-2">
              <div className="relative h-8 w-28">
                <Image
                  src={settings.logo_url || '/logo.png'}
                  alt="Logo Preview"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <span className="text-xs text-brand-cyan font-bold">Ver grupos ↓</span>
          </div>

          {/* Hero Preview */}
          <div className="text-center py-4 px-2 space-y-3">
            <span className="inline-block text-[10px] font-extrabold px-3 py-1 rounded-full bg-cyan-950 text-brand-cyan border border-cyan-500/40">
              {settings.hero_badge}
            </span>
            <h2 className="text-lg font-extrabold text-white">{settings.hero_title}</h2>
            <p className="text-xs text-slate-300">{settings.hero_subtitle}</p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-neon-lime">
                <MessageCircle className="w-4 h-4" />
                {settings.cta_text}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 flex items-center justify-center gap-1">
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
            Logo Oficial da Marca "Pedro Indica"
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="logo-container p-3">
              <div className="relative w-40 h-16">
                <Image
                  src={settings.logo_url || '/logo.png'}
                  alt="Logo Atual"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-brand-cyan cursor-pointer text-xs font-bold text-white transition-colors shadow-sm">
                <Upload className="w-4 h-4 text-brand-cyan" />
                <span>{uploadingLogo ? 'Carregando nova logo...' : 'Substituir Logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </label>
              <p className="text-[11px] text-slate-400">
                Formatos suportados: PNG, SVG ou JPG. Exibida com moldura iluminada no topo e login.
              </p>
            </div>
          </div>
        </div>

        {/* Bloco 2: Alteração de Senha */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Key className="w-5 h-5 text-brand-lime" />
            Alterar Senha do Administrador
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nova Senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a nova senha..."
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl px-4 py-2.5 text-sm text-white outline-none"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Deixe os campos de senha em branco se desejar manter a senha atual.
          </p>
        </div>

        {/* Bloco 3: Seção Hero */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <Sparkles className="w-5 h-5 text-brand-yellow" />
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

        {/* Bloco 4: Benefícios */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-5 h-5 text-brand-magenta" />
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
              <span className="text-xs font-extrabold text-brand-cyan">Benefício 1</span>
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
              <span className="text-xs font-extrabold text-brand-yellow">Benefício 2</span>
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
              <span className="text-xs font-extrabold text-brand-magenta">Benefício 3</span>
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

        {/* Bloco 5: Rodapé & Disclaimer */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
            <FileText className="w-5 h-5 text-brand-cyan" />
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

        {/* Botão de Ação */}
        <div className="pt-2 sticky bottom-4">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-brand-cyan to-brand-lime hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-neon-cyan touch-target disabled:opacity-50"
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
