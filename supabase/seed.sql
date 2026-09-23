-- Seed SQL com as configurações padrão e os 6 grupos de WhatsApp iniciais

-- Configurações iniciais do site
INSERT INTO public.site_settings (
  id,
  logo_url,
  hero_badge,
  hero_title,
  hero_subtitle,
  cta_text,
  trust_text,
  benefits_title,
  benefit_1_title,
  benefit_1_desc,
  benefit_2_title,
  benefit_2_desc,
  benefit_3_title,
  benefit_3_desc,
  footer_text,
  footer_disclaimer,
  seo_title,
  seo_description
) VALUES (
  'default',
  '/logo.png',
  'Comunidade de ofertas',
  'Entre nos grupos e receba promoções que valem a pena.',
  'Achados, descontos e cupons selecionados diretamente no seu WhatsApp.',
  'Ver grupos disponíveis',
  'Gratuito • Sem spam • Saia quando quiser',
  'Por que fazer parte da nossa comunidade?',
  'Ofertas selecionadas',
  'Só compartilhamos oportunidades que merecem sua atenção.',
  'Direto no WhatsApp',
  'As melhores promoções chegam sem você precisar procurar.',
  'Grupos organizados',
  'Entre apenas nos temas que realmente interessam a você.',
  'Boas oportunidades, no momento certo.',
  'Os grupos são gratuitos. Não enviamos mensagens privadas solicitando pagamentos.',
  'Pedro Indica - Promoções, Cupons e Oportunidades no WhatsApp',
  'Receba em primeira mão ofertas imperdíveis e cupons de desconto selecionados no seu WhatsApp.'
) ON CONFLICT (id) DO NOTHING;

-- Os 6 Grupos iniciais obrigatórios
INSERT INTO public.groups (title, description, invite_link, badge, is_popular, is_active, sort_order)
VALUES 
  (
    'Grupo 1 - Ofertas Diárias',
    'Principais cupons de desconto e achados imperdíveis de tecnologia, casa e moda.',
    'https://chat.whatsapp.com/DexDPbamt3LHxb1qMZbqZl',
    'Mais popular',
    TRUE,
    TRUE,
    1
  ),
  (
    'Grupo 2 - Cupons Exclusivos',
    'Cupons testados e atualizados a todo momento para grandes lojas online.',
    'https://chat.whatsapp.com/II7RwnGiu5oFyIWbMwnDdA',
    'Vagas limitadas',
    FALSE,
    TRUE,
    2
  ),
  (
    'Grupo 3 - Achadinhos do Pedro',
    'Promoções relâmpago e menor preço histórico garimpados diariamente.',
    'https://chat.whatsapp.com/DtTTihP0wNq9YrBQaAVniP',
    'Seleção VIP',
    FALSE,
    TRUE,
    3
  ),
  (
    'Grupo 4 - Eletrônicos & Tech',
    'Smartphones, notebooks, fones e gadgets com super descontos.',
    'https://chat.whatsapp.com/CcBPwQ7QNDCHw4l8P2w4bV',
    'Tecnologia',
    FALSE,
    TRUE,
    4
  ),
  (
    'Grupo 5 - Casa & Utilitários',
    'Eletrodomésticos, decoração e itens para o lar com preços especiais.',
    'https://chat.whatsapp.com/K31ICDiu9K35QnfhZHxdps',
    'Casa & Lar',
    FALSE,
    TRUE,
    5
  ),
  (
    'Grupo 6 - Bug de Preço & Relâmpago',
    'Erros de precificação e ofertas ultra rápidas que duram poucos minutos.',
    'https://chat.whatsapp.com/LXHsVJ7jojr81z39KGlsfM',
    'Alerta urgente',
    FALSE,
    TRUE,
    6
  )
ON CONFLICT (invite_link) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;
