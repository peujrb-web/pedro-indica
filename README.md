# Pedro Indica — Landing Page de Alta Conversão para Grupos de WhatsApp (100% Estático & Local)

Aplicação web completa, ultra-rápida e **mobile-first** desenvolvida para a marca **Pedro Indica**. O objetivo da plataforma é centralizar e divulgar links de convite para grupos do WhatsApp em uma landing page persuasiva, maximizando o número de novos membros, com um **painel administrativo seguro e local** para gerenciar todo o conteúdo, imagens, logos, ordens e senha sem necessidade de banco de dados externo ou configurações complexas.

---

## 🚀 Destaques da Arquitetura 100% Local (Zero Supabase)

- **Zero Dependências Externas**: Sem Supabase, sem banco de dados externo caindo, sem problemas de API Keys.
- **Login Instantâneo**: Autenticação administrativa com sessão via cookie local em `< 10ms`.
- **Senha Padrão Inicial**: `pedro123` (facilmente editável pelo próprio painel em `/admin/settings` ou via variável de ambiente `ADMIN_PASSWORD`).
- **Persistência e Backup**: Dados gerenciados localmente com suporte a restauração de padrões e backup em tempo real.
- **Deploy de 1 Clique na Vercel**: Sem necessidade de variáveis de banco de dados.

---

## 🎨 Identidade Visual e Estilo

- **Logo Pedro Indica em Destaque**: Moldura de vidro temperado (*glassmorphism*) com anel iluminado neon ciano/verde ao redor da logo oficial.
- **Degradês de Cor Neon**: Fundo escuro profundo (`#090b10`) enriquecido com luzes radiais ambiente em ciano (`#00f0ff`), verde-limão (`#10b981`) e magenta (`#ec4899`).
- **Títulos Multicor Vibrantes**: Títulos em degradê dinâmico de alta visibilidade.
- **Cards e Botões com Brilho Neon**: Foco de toque confortável (mínimo 48px de altura de toque) e selo destacado "Mais popular".

---

## ⚡ Como Publicar na Vercel em 1 Clique

1. Faça upload dos arquivos do projeto para o seu repositório no **GitHub**.
2. Acesse **[vercel.com/new](https://vercel.com/new)** e importe o repositório.
3. Clique em **Deploy**!

> Não é necessário configurar nenhuma variável de ambiente obrigatoriamente. O site e o painel administrativo estarão 100% funcionais imediatamente!

---

## 🔐 Acesso Administrativo

- **URL de Login**: `https://seu-site.vercel.app/admin/login`
- **E-mail**: `admin@pedroindica.com.br` (ou qualquer e-mail)
- **Senha Inicial**: `pedro123`

---

## 🛠️ Tecnologias

- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS (Gradientes customizados, glassmorphism e iluminação neon)
- Lucide React Icons
- Zod (Validação de schemas)
