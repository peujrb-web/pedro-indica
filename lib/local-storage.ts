import { Group, SiteSettings } from './types';
import { initialGroups, initialSiteSettings } from './data/initial-data';

const GROUPS_STORAGE_KEY = 'pedro_indica_groups_v1';
const SETTINGS_STORAGE_KEY = 'pedro_indica_settings_v1';
const ADMIN_PASSWORD_STORAGE_KEY = 'pedro_indica_admin_pass_v1';

export function getStoredGroups(): Group[] {
  if (typeof window === 'undefined') return initialGroups;
  try {
    const item = localStorage.getItem(GROUPS_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(initialGroups));
      return initialGroups;
    }
    const parsed = JSON.parse(item);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialGroups;
  } catch (e) {
    console.error('Erro ao ler grupos do LocalStorage:', e);
    return initialGroups;
  }
}

export function saveStoredGroups(groups: Group[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (e) {
    console.error('Erro ao salvar grupos no LocalStorage:', e);
  }
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return initialSiteSettings;
  try {
    const item = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!item) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initialSiteSettings));
      return initialSiteSettings;
    }
    const parsed = JSON.parse(item);
    return { ...initialSiteSettings, ...parsed };
  } catch (e) {
    console.error('Erro ao ler configurações do LocalStorage:', e);
    return initialSiteSettings;
  }
}

export function saveStoredSettings(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Erro ao salvar configurações no LocalStorage:', e);
  }
}

export function getStoredAdminPassword(): string {
  if (typeof window === 'undefined') return 'pedro123';
  try {
    return localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || 'pedro123';
  } catch {
    return 'pedro123';
  }
}

export function saveStoredAdminPassword(password: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);
  } catch (e) {
    console.error('Erro ao salvar nova senha:', e);
  }
}
