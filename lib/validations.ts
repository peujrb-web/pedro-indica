import { z } from 'zod';

// Regex estrito para validação de URLs públicas do WhatsApp
const whatsappUrlRegex = /^https:\/\/(chat\.whatsapp\.com|wa\.me)\/[a-zA-Z0-9_-]+$/;

export const GroupSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres'),
  description: z.string().nullable().optional(),
  invite_link: z
    .string()
    .url('Informe uma URL válida')
    .regex(whatsappUrlRegex, 'Informe um link válido do WhatsApp (ex: https://chat.whatsapp.com/...)'),
  image_url: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  is_popular: z.boolean().default(false),
  is_active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

export const SiteSettingsSchema = z.object({
  logo_url: z.string().nullable().optional(),
  hero_badge: z.string().min(1, 'O selo é obrigatório'),
  hero_title: z.string().min(3, 'O título é obrigatório'),
  hero_subtitle: z.string().min(3, 'O subtítulo é obrigatório'),
  cta_text: z.string().min(2, 'O texto do CTA é obrigatório'),
  trust_text: z.string().min(2, 'O texto de confiança é obrigatório'),
  benefits_title: z.string().min(2, 'O título de benefícios é obrigatório'),
  benefit_1_title: z.string().min(2, 'Título do benefício 1 é obrigatório'),
  benefit_1_desc: z.string().min(2, 'Descrição do benefício 1 é obrigatória'),
  benefit_2_title: z.string().min(2, 'Título do benefício 2 é obrigatório'),
  benefit_2_desc: z.string().min(2, 'Descrição do benefício 2 é obrigatória'),
  benefit_3_title: z.string().min(2, 'Título do benefício 3 é obrigatório'),
  benefit_3_desc: z.string().min(2, 'Descrição do benefício 3 é obrigatória'),
  footer_text: z.string().min(2, 'Texto do rodapé é obrigatório'),
  footer_disclaimer: z.string().min(2, 'Aviso do rodapé é obrigatório'),
  seo_title: z.string().min(2, 'Título SEO é obrigatório'),
  seo_description: z.string().min(2, 'Descrição SEO é obrigatória'),
  seo_og_image: z.string().nullable().optional(),
});

export type GroupFormData = z.infer<typeof GroupSchema>;
export type SiteSettingsFormData = z.infer<typeof SiteSettingsSchema>;
