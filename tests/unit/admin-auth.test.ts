import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
  validatePasswordStrength,
  bootstrapAdmin,
  verifyAdminPassword,
  changeAdminPassword,
  setStorePathForTesting,
} from '../../src/lib/auth/admin-auth';
import {
  BUSINESS_CONFIG,
  getGeneralWhatsAppInquiryUrl,
  getProductWhatsAppInquiryUrl,
} from '../../src/lib/config/business';

describe('Admin Authentication & Credential Hygiene', () => {
  const testStorePath = path.join(process.cwd(), '.data', 'test-admin-store.json');

  before(() => {
    setStorePathForTesting(testStorePath);
    if (fs.existsSync(testStorePath)) {
      fs.unlinkSync(testStorePath);
    }
  });

  after(() => {
    if (fs.existsSync(testStorePath)) {
      fs.unlinkSync(testStorePath);
    }
    setStorePathForTesting(null);
  });
  it('validates password strength according to security standards', () => {
    // Too short
    const short = validatePasswordStrength('Short1!');
    assert.equal(short.isValid, false);
    assert.ok(short.errors.some((e) => e.includes('8 characters')));

    // Missing uppercase
    const noUpper = validatePasswordStrength('lowercase123!');
    assert.equal(noUpper.isValid, false);

    // Missing lowercase
    const noLower = validatePasswordStrength('UPPERCASE123!');
    assert.equal(noLower.isValid, false);

    // Missing number/special
    const noSpecial = validatePasswordStrength('LettersOnlyHere');
    assert.equal(noSpecial.isValid, false);

    // Compliant strong password
    const strong = validatePasswordStrength('SuperSecret2026!');
    assert.equal(strong.isValid, true);
    assert.equal(strong.score, 4);
    assert.equal(strong.errors.length, 0);
  });

  it('idempotently bootstraps admin account and verifies credentials', () => {
    const testEmail = 'cozycrochetrasika@gmail.com';
    const testPass = 'RasikaStrong2026!';

    // First bootstrap
    const res1 = bootstrapAdmin(testEmail, testPass);
    assert.ok(res1.status === 'created' || res1.status === 'already_exists');

    // Repeated bootstrap should be idempotent
    const res2 = bootstrapAdmin(testEmail, testPass);
    assert.equal(res2.status, 'already_exists');

    // Verification check
    const isValid = verifyAdminPassword(testPass);
    assert.equal(isValid, true);

    const isInvalid = verifyAdminPassword('WrongPassword123!');
    assert.equal(isInvalid, false);
  });

  it('allows safe password change with current password validation', () => {
    const currentPass = 'RasikaStrong2026!';
    const newPass = 'UpdatedSecurePass2026$';

    // Attempt with incorrect current password
    const fail = changeAdminPassword('IncorrectPass!', newPass);
    assert.equal(fail.success, false);
    assert.ok(fail.error?.includes('incorrect'));

    // Attempt with weak new password
    const weakFail = changeAdminPassword(currentPass, 'weak');
    assert.equal(weakFail.success, false);

    // Successful password update
    const ok = changeAdminPassword(currentPass, newPass);
    assert.equal(ok.success, true);
    assert.equal(verifyAdminPassword(newPass), true);

    // Revert back for consistency
    changeAdminPassword(newPass, currentPass);
  });
});

describe('Centralized Business Configuration & Verified Contacts', () => {
  it('has verified production owner contacts', () => {
    assert.equal(BUSINESS_CONFIG.email, 'cozycrochetrasika@gmail.com');
    assert.equal(BUSINESS_CONFIG.primaryPhoneNormalized, '+916000989651');
    assert.equal(BUSINESS_CONFIG.alternatePhoneNormalized, '+916003016159');
    assert.ok(BUSINESS_CONFIG.instagramUrl.includes('cozystitches_byrasika'));
  });

  it('generates valid WhatsApp URLs with normalized phone digits', () => {
    const generalUrl = getGeneralWhatsAppInquiryUrl();
    assert.ok(generalUrl.startsWith('https://wa.me/916000989651?text='));

    const productUrl = getProductWhatsAppInquiryUrl('Crochet Tulip', 49900);
    assert.ok(productUrl.startsWith('https://wa.me/916000989651?text='));
    assert.ok(productUrl.includes('Crochet%20Tulip'));
    assert.ok(productUrl.includes('499'));
  });
});
