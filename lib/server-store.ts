import { Group, SiteSettings } from './types';
import { initialGroups, initialSiteSettings } from './data/initial-data';
import crypto from 'crypto';

// Armazenamento em memória do servidor com fallback sincronizado
let currentSiteSettings: SiteSettings = { ...initialSiteSettings };
let currentGroups: Group[] = [...initialGroups];

// Senha padrão hash SHA-256 do servidor (padrão: "pedro123")
function hashPassword(pass: string): string {
  return crypto.createHash('sha256').update(pass.trim()).digest('hex');
}

let activeAdminPasswordHash: string = hashPassword(process.env.ADMIN_PASSWORD || 'pedro123');

// Limite de tentativas de login por IP para prevenção contra força bruta
const loginAttempts = new Map<string, { count: number; lockUntil: number }>();

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

export function verifyAdminPassword(password: string): boolean {
  const inputHash = hashPassword(password);
  return inputHash === activeAdminPasswordHash;
}

export function updateAdminPassword(currentPassword: string, newPassword: string): { success: boolean; error?: string } {
  if (!verifyAdminPassword(currentPassword)) {
    return { success: false, error: 'A senha atual informada está incorreta.' };
  }
  if (newPassword.trim().length < 4) {
    return { success: false, error: 'A nova senha deve ter no mínimo 4 caracteres.' };
  }
  activeAdminPasswordHash = hashPassword(newPassword);
  return { success: true };
}

export function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.lockUntil > now) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.lockUntil - now) / 1000),
    };
  }

  return { allowed: true };
}

export function registerFailedLogin(ip: string) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { count: 0, lockUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    record.lockUntil = now + 15 * 60 * 1000; // Bloqueia por 15 minutos após 5 tentativas
    record.count = 0;
  }

  loginAttempts.set(ip, record);
}

export function resetLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}
