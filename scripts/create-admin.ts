#!/usr/bin/env tsx

/**
 * Admin Bootstrap Script for Cozy_Crochets
 * Idempotent, safe initialization of the store owner's admin credentials.
 *
 * Requirements:
 * - Reads ADMIN_BOOTSTRAP_EMAIL (default: cozycrochetrasika@gmail.com)
 * - Reads ADMIN_BOOTSTRAP_PASSWORD from .env.local (NEVER PRINTED TO STDOUT/LOGS)
 * - If account already exists, exits safely with code 0
 * - Never commits or displays passwords
 */

import fs from 'fs';
import path from 'path';
import { bootstrapAdmin, getAdminRecord } from '../src/lib/auth/admin-auth';

function loadEnvLocal() {
  const envLocalPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const content = fs.readFileSync(envLocalPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let value = trimmed.slice(eqIdx + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

function main() {
  loadEnvLocal();

  const email = (
    process.env.ADMIN_BOOTSTRAP_EMAIL || 'cozycrochetrasika@gmail.com'
  ).trim();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD?.trim();

  const existingRecord = getAdminRecord();
  if (existingRecord && existingRecord.email.toLowerCase() === email.toLowerCase()) {
    console.log(
      `[Admin Bootstrap] Admin account for "${email}" is already initialized. Exiting safely (idempotent).`
    );
    process.exit(0);
  }

  if (!password) {
    console.warn(
      `[Admin Bootstrap] WARNING: ADMIN_BOOTSTRAP_PASSWORD was not found in environment or .env.local.`
    );
    console.warn(
      `[Admin Bootstrap] Please define ADMIN_BOOTSTRAP_PASSWORD in .env.local to initialize the account.`
    );
    // Exit safely without breaking deployment pipelines
    process.exit(0);
  }

  const result = bootstrapAdmin(email, password);

  if (result.status === 'already_exists') {
    console.log(
      `[Admin Bootstrap] Admin account for "${email}" already exists. Exiting safely.`
    );
  } else {
    console.log(
      `[Admin Bootstrap] Successfully initialized admin account for "${email}".`
    );
  }

  process.exit(0);
}

main();
