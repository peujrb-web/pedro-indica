import { Group, SiteSettings } from './types';
import { initialGroups, initialSiteSettings } from './data/initial-data';

// Armazenamento em memória do servidor com fallback sincronizado
let currentSiteSettings: SiteSettings = { ...initialSiteSettings };
let currentGroups: Group[] = [...initialGroups];

export function getPublicContent() {
  return {
    settings: currentSiteSettings,
    groups: currentGroups
      .filter((g) => g.is_active)
      .sort((a, b) => a.sort_order - b.sort_order),
  };
}

export function getAllAdminContent() {
  return {
    settings: currentSiteSettings,
    groups: currentGroups.sort((a, b) => a.sort_order - b.sort_order),
  };
}

export function updatePublicContent(newSettings?: Partial<SiteSettings>, newGroups?: Group[]) {
  if (newSettings) {
    currentSiteSettings = { ...currentSiteSettings, ...newSettings, updated_at: new Date().toISOString() };
  }
  if (newGroups) {
    currentGroups = [...newGroups];
  }
  return { settings: currentSiteSettings, groups: currentGroups };
}
