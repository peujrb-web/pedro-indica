export interface Group {
  id: string;
  title: string;
  description: string | null;
  invite_link: string;
  image_url: string | null;
  badge: string | null;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  logo_url: string | null;
  hero_badge: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  cta_text: string | null;
  trust_text: string | null;
  benefits_title: string | null;
  benefit_1_title: string | null;
  benefit_1_desc: string | null;
  benefit_2_title: string | null;
  benefit_2_desc: string | null;
  benefit_3_title: string | null;
  benefit_3_desc: string | null;
  footer_text: string | null;
  footer_disclaimer: string | null;
  seo_title: string | null;
  seo_description: string | null;
  seo_og_image: string | null;
  updated_at?: string;
}

export interface AuditLog {
  id: string;
  admin_id: string | null;
  action: string;
  details: Record<string, any> | null;
  created_at: string;
}
