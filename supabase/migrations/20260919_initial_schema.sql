-- Migration SQL para o projeto Pedro Indica
-- Executar este script no SQL Editor do Supabase para configurar as tabelas, RLS e Storage.

-- 1. Tabela de Perfis/Roles dos Usuários
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função auxiliar segura para verificar se usuário logado é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins podem ver perfis" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

-- 2. Tabela de Grupos de WhatsApp
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  invite_link TEXT NOT NULL UNIQUE,
  image_url TEXT,
  badge TEXT,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Restrição de formato de URL de WhatsApp no banco
ALTER TABLE public.groups
  DROP CONSTRAINT IF EXISTS check_whatsapp_link;

ALTER TABLE public.groups
  ADD CONSTRAINT check_whatsapp_link CHECK (
    invite_link ~* '^https:\/\/(chat\.whatsapp\.com|wa\.me)\/[a-zA-Z0-9_-]+$'
  );

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de grupos ativos" ON public.groups
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Administradores gerenciam grupos" ON public.groups
  FOR ALL USING (public.is_admin());

-- 3. Tabela de Configurações da Landing Page / SEO
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  logo_url TEXT,
  hero_badge TEXT DEFAULT 'Comunidade de ofertas',
  hero_title TEXT DEFAULT 'Entre nos grupos e receba promoções que valem a pena.',
  hero_subtitle TEXT DEFAULT 'Achados, descontos e cupons selecionados diretamente no seu WhatsApp.',
  cta_text TEXT DEFAULT 'Ver grupos disponíveis',
  trust_text TEXT DEFAULT 'Gratuito • Sem spam • Saia quando quiser',
  benefits_title TEXT DEFAULT 'Por que fazer parte da nossa comunidade?',
  benefit_1_title TEXT DEFAULT 'Ofertas selecionadas',
  benefit_1_desc TEXT DEFAULT 'Só compartilhamos oportunidades que merecem sua atenção.',
  benefit_2_title TEXT DEFAULT 'Direto no WhatsApp',
  benefit_2_desc TEXT DEFAULT 'As melhores promoções chegam sem você precisar procurar.',
  benefit_3_title TEXT DEFAULT 'Grupos organizados',
  benefit_3_desc TEXT DEFAULT 'Entre apenas nos temas que realmente interessam a você.',
  footer_text TEXT DEFAULT 'Boas oportunidades, no momento certo.',
  footer_disclaimer TEXT DEFAULT 'Os grupos são gratuitos. Não enviamos mensagens privadas solicitando pagamentos.',
  seo_title TEXT DEFAULT 'Pedro Indica - Promoções, Cupons e Oportunidades no WhatsApp',
  seo_description TEXT DEFAULT 'Receba em primeira mão ofertas imperdíveis e cupons de desconto selecionados no seu WhatsApp.',
  seo_og_image TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de configurações" ON public.site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Administradores alteram configurações" ON public.site_settings
  FOR ALL USING (public.is_admin());

-- 4. Tabela de Logs de Auditoria Admin
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins leem audit logs" ON public.audit_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Apenas admins inserem audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- 5. Trigger para criar perfil do primeiro admin automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
