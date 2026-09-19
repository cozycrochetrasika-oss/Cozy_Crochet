import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface AdminCredentialRecord {
  email: string;
  hash: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_STORE_PATH = path.join(process.cwd(), '.data', 'admin-store.json');
let customStorePath: string | null = null;

export function getStorePath(): string {
  return customStorePath || DEFAULT_STORE_PATH;
}

export function setStorePathForTesting(p: string | null) {
  customStorePath = p;
}

function ensureDirectoryExists() {
  const dir = path.dirname(getStorePath());
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number; // 0 to 4
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    errors.push('Must be at least 8 characters long');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Must include at least one uppercase letter (A-Z)');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    errors.push('Must include at least one lowercase letter (a-z)');
  }

  if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    score += 1;
  } else {
    errors.push('Must include at least one number or special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score,
  };
}

export function getAdminRecord(): AdminCredentialRecord | null {
  try {
    if (!fs.existsSync(getStorePath())) {
      return null;
    }
    const raw = fs.readFileSync(getStorePath(), 'utf-8');
    return JSON.parse(raw) as AdminCredentialRecord;
  } catch (err) {
    console.error('Failed to read admin credentials record:', err);
    return null;
  }
}

export function bootstrapAdmin(
  email: string,
  plainPassword: string
): { status: 'created' | 'already_exists'; email: string } {
  ensureDirectoryExists();
  const existing = getAdminRecord();

  if (existing && existing.email.toLowerCase() === email.toLowerCase()) {
    return { status: 'already_exists', email: existing.email };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(plainPassword, salt);
  const now = new Date().toISOString();

  const record: AdminCredentialRecord = {
    email: email.toLowerCase(),
    hash,
    salt,
    createdAt: now,
    updatedAt: now,
  };

  fs.writeFileSync(getStorePath(), JSON.stringify(record, null, 2), 'utf-8');
  return { status: 'created', email: record.email };
}

export function verifyAdminPassword(plainPassword: string): boolean {
  const record = getAdminRecord();
  if (!record) return false;
  const computed = hashPassword(plainPassword, record.salt);
  return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(record.hash));
}

export function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): { success: boolean; error?: string } {
  const record = getAdminRecord();
  if (!record) {
    return { success: false, error: 'Admin account has not been initialized.' };
  }

  if (!verifyAdminPassword(currentPassword)) {
    return { success: false, error: 'Current password is incorrect.' };
  }

  const strength = validatePasswordStrength(newPassword);
  if (!strength.isValid) {
    return { success: false, error: strength.errors[0] };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(newPassword, salt);

  const updated: AdminCredentialRecord = {
    ...record,
    hash,
    salt,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(getStorePath(), JSON.stringify(updated, null, 2), 'utf-8');
  return { success: true };
}
