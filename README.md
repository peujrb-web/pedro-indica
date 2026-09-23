# Pedro Indica — Aplicação Web & Landing Page de Conversão para Grupos de WhatsApp

Aplicação web completa, rápida e **mobile-first** desenvolvida para a marca **Pedro Indica**. O objetivo da plataforma é centralizar e divulgar links de convite para grupos do WhatsApp em uma landing page persuasiva, maximizando o número de novos membros, com um **painel administrativo seguro** para gerenciar todo o conteúdo, imagens, logos e ordens sem necessidade de alterar o código.

---

## 🚀 Stack Tecnológica

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, TypeScript)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com identidade visual escura (`#090b10`) e destaques neon em ciano (`#00f0ff`), verde-limão (`#10b981`), amarelo (`#facc15`) e magenta (`#ec4899`).
- **Backend & Autenticação**: [Supabase](https://supabase.com/) (`@supabase/ssr`, PostgreSQL, Auth via e-mail/senha, Row Level Security e Storage).
- **Validação & Segurança**: Zod, Row Level Security (RLS), Middleware de sessão no servidor, sanitização XSS/SQLi, rate limiting e cabeçalhos HTTP de segurança (`CSP`, `X-Frame-Options`, `X-Content-Type-Options`).
- **Analytics**: Sistema de rastreamento de eventos centralizado (`group_card_view`, `group_cta_click`, `group_join_click`).
- **Deploy**: Preparado para implantação direta na [Vercel](https://vercel.com/).

---

## 🎨 Identidade Visual e Recursos Públicos

- **Logo inicial**: Copiada para `public/logo.png` (exibida de forma nítida e responsiva no topo e tela de login).
- **Landing Page Publica**:
  - **Header**: Logo responsiva, tagline "Promoções, cupons e oportunidades para você economizar." e âncora discreta "Ver grupos".
  - **Hero**: Selo "Comunidade de ofertas", título persuasivo, subtítulo explicativo, CTA com ícone oficial do WhatsApp (toque com altura mínima de 48px) e selo de confiança ("Gratuito • Sem spam • Saia quando quiser").
  - **Lista de Grupos**: Layout responsivo (1 coluna no mobile 360–430px; 2/3 colunas em telas maiores). Cards com destaque visual para "Mais popular", imagem customizável, descrição, badge e botão com `target="_blank" rel="noopener noreferrer"`.
  - **Benefícios**: Seção com 3 pontos curtos com ícones ilustrativos.
  - **Rodapé**: Marca, disclaimer legal ("Os grupos são gratuitos. Não enviamos mensagens privadas solicitando pagamentos") e link discreto para a área administrativa (`/admin/login`).

---

## 🔒 Painel Administrativo (`/admin`)

- Protegido via Supabase Auth + Middleware Next.js no servidor.
- **CRUD Completo de Grupos**: Criar, editar, ativar/desativar, reordenar (mover ordem) e excluir com modal de confirmação.
- **Validação de Links**: Bloqueia cadastro duplicado do mesmo link de convite e exige formato válido de URL HTTPS do WhatsApp (`chat.whatsapp.com` ou `wa.me`).
- **Gestão de Imagens & Marca**: Upload de imagem/ícone individual para grupos e substituição da logo oficial pelo painel.
- **Gestão de Conteúdo & SEO**: Edição de títulos, chamadas, benefícios, rodapé e metadados SEO.
- **Pré-visualização**: Botão "Pré-visualizar Alterações" para conferir a landing page antes de publicar.
- **Logs de Auditoria**: Registro em banco de todas as ações administrativas (`CREATE_GROUP`, `UPDATE_GROUP`, `DELETE_GROUP`, `UPDATE_SETTINGS`).

---

## 🛠️ Guia de Configuração Passo a Passo

### 1. Clonar e Instalar Dependências

```bash
git clone <repository-url>
cd pedro-indica
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha as variáveis em `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

> **IMPORTANTE DE SEGURANÇA**: Nunca coloque a `SUPABASE_SERVICE_ROLE_KEY` no arquivo `.env` do cliente ou no código enviado ao navegador. O projeto utiliza Row Level Security (RLS) no banco de dados.

---

### 3. Configurar o Supabase (Migrations & Seed)

1. Acesse o painel do seu projeto no [Supabase Dashboard](https://app.supabase.com/).
2. Vá em **SQL Editor** e execute o conteúdo do arquivo:
   - `supabase/migrations/20260919_initial_schema.sql` (Cria as tabelas `groups`, `site_settings`, `user_roles`, `audit_logs`, funções RLS e buckets).
3. Em seguida, no mesmo SQL Editor, execute o script de seed:
   - `supabase/seed.sql` (Cadastra as configurações padrões e os **6 grupos iniciais de WhatsApp com links únicos e válidos**).

---

### 4. Criar o Primeiro Administrador com Segurança

Existem duas formas seguras de criar o primeiro usuário administrador:

#### Opção A: Pelo Dashboard do Supabase (Recomendado)
1. No Supabase Dashboard, acesse **Authentication** -> **Users** -> **Add user**.
2. Escolha **Create user** com e-mail (ex: `admin@pedroindica.com.br`) e uma senha forte.
3. Como configuramos a trigger `on_auth_user_created` no script SQL, o primeiro usuário cadastrado se torna automaticamente um `admin` na tabela `public.user_roles`.

#### Opção B: Caso deseje conceder a role de Admin a um usuário existente via SQL
Execute o comando no SQL Editor:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('ID_DO_USUARIO_NO_AUTH_USERS', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

---

### 5. Executar em Modo de Desenvolvimento Local

```bash
npm run dev
```

Acesse a página pública em [http://localhost:3000](http://localhost:3000) e o painel administrativo em [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## ⚡ Deploy na Vercel

1. Faça o push do código para o seu repositório no GitHub/GitLab.
2. Na Vercel, clique em **Add New Project** e importe o repositório.
3. Nas configurações do projeto na Vercel, adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**. A Vercel detectará automaticamente a configuração do Next.js App Router.

---

## 🛡️ Medidas de Segurança Implementadas

1. **Row Level Security (RLS)**:
   - Visitantes têm acesso somente para leitura de grupos ativos (`is_active = true`) e configurações do site.
   - Qualquer operação de criação, edição ou remoção é bloqueada para usuários não autenticados ou sem permissão de `admin`.
2. **Sessões HTTP-Only**: Gerenciadas via `@supabase/ssr` com cookies seguros.
3. **Middleware de Proteção de Rota**: Intercepta tentativas de acesso não autorizado a `/admin/*`.
4. **Validação Zod no Servidor**: URLs de convite tratadas com Expressão Regular para garantir que pertencem unicamente ao domínio `chat.whatsapp.com` ou `wa.me`.
5. **Prevenção contra Links Duplicados**: Constraint `UNIQUE(invite_link)` no banco de dados e validação prévia na UI.
6. **Cabeçalhos de Segurança (HTTP Headers)**: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.

---

## 📊 Analytics e Eventos

A aplicação inclui um módulo pronto e centralizado em `lib/analytics.ts` que registra:
- `group_card_view`: disparado ao visualizar os cards na página.
- `group_cta_click`: disparado ao clicar nos botões do Hero.
- `group_join_click`: disparado ao clicar para entrar em um grupo do WhatsApp.

Pronto para integrar diretamente com Google Tag Manager, Google Analytics 4, Plausible ou PostHog.
