/**
 * Centralizador de eventos de analytics da aplicação.
 * Preparado para integrar com Google Analytics (gtag), Plausible, PostHog, etc.
 */

export type AnalyticsEventName = 'group_card_view' | 'group_cta_click' | 'group_join_click';

interface AnalyticsPayload {
  groupId?: string;
  groupTitle?: string;
  inviteLink?: string;
  source?: string;
  [key: string]: any;
}

export function trackAnalyticsEvent(eventName: AnalyticsEventName, payload?: AnalyticsPayload) {
  if (typeof window === 'undefined') return;

  const eventData = {
    event: eventName,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  // Registra no console para ambiente de desenvolvimento/inspeção
  console.log(`[Analytics Event] ${eventName}:`, eventData);

  // Integração genérica com window.dataLayer (GTM/GA4) se disponível
  if (Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push(eventData);
  }

  // Exemplo de integração personalizada com gtag se disponível
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', eventName, payload);
  }
}

export function trackGroupCardView(groupId: string, groupTitle: string) {
  trackAnalyticsEvent('group_card_view', { groupId, groupTitle });
}

export function trackGroupCtaClick(source: string = 'hero') {
  trackAnalyticsEvent('group_cta_click', { source });
}

export function trackGroupJoinClick(groupId: string, groupTitle: string, inviteLink: string) {
  trackAnalyticsEvent('group_join_click', { groupId, groupTitle, inviteLink });
}
