'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Key, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Acesso negado. Credenciais incorretas.');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError('Erro de conexão ao autenticar.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-4 relative bg-radial-gradient">
      {/* Botão voltar para a Landing Page */}
      <Link
        href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o site público</span>
      </Link>

      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header com Logo Limpa e Redimensionada */}
        <div className="text-center mb-6">
          <div className="relative h-14 w-44 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="Pedro Indica"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-brand-cyan text-xs font-bold shadow-neon-cyan">
            <Lock className="w-3.5 h-3.5" />
            <span>Painel Administrativo</span>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-950/90 border border-red-500/50 text-red-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulário de Autenticação */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              E-mail do Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@dominio.com"
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 focus:border-brand-cyan rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-brand-cyan to-brand-lime hover:from-cyan-300 hover:to-emerald-300 transition-all shadow-neon-cyan touch-target disabled:opacity-50 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar no Painel</span>
            )}
          </button>
        </form>

        <p className="text-[11px] text-center text-slate-500 mt-6 border-t border-slate-800/80 pt-4">
          Acesso restrito exclusivamente para administradores autorizados.
        </p>
      </div>
    </div>
  );
}
