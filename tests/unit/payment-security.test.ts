import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  hashVerificationCode,
  verifyPaymentCode,
  MAX_VERIFICATION_ATTEMPTS,
} from '../../src/lib/payments/security';

describe('Payment Security & SHA-256 Code Verification', () => {
  const testCode = '841920';

  test('generates deterministic SHA-256 hash for 6-digit confirmation code', async () => {
    const hash1 = await hashVerificationCode(testCode);
    const hash2 = await hashVerificationCode(' 841920 '); // trimmed
    assert.strictEqual(hash1, hash2, 'Hashes should be identical after trimming');
    assert.strictEqual(hash1.length, 64, 'SHA-256 hex string should be 64 characters');
  });

  test('successful code verification with remaining attempts calculation', async () => {
    const storedHash = await hashVerificationCode(testCode);
    const result = await verifyPaymentCode(testCode, storedHash, 0);

    assert.strictEqual(result.valid, true, 'Code should be valid');
    assert.strictEqual(result.rateLimited, false, 'Should not be rate-limited');
    assert.strictEqual(result.remainingAttempts, 4, 'Remaining attempts should be 4');
  });

  test('failed verification increments attempts and decrements remaining', async () => {
    const storedHash = await hashVerificationCode(testCode);
    const result = await verifyPaymentCode('111111', storedHash, 1);

    assert.strictEqual(result.valid, false, 'Wrong code should be invalid');
    assert.strictEqual(result.rateLimited, false, 'Should not be rate-limited yet');
    assert.strictEqual(result.remainingAttempts, 3, 'Remaining attempts should be 3');
  });

  test('rate-limiting blocks attempts when MAX_VERIFICATION_ATTEMPTS reached', async () => {
    const storedHash = await hashVerificationCode(testCode);
    const result = await verifyPaymentCode(testCode, storedHash, MAX_VERIFICATION_ATTEMPTS);

    assert.strictEqual(result.valid, false, 'Should fail when max attempts exceeded');
    assert.strictEqual(result.rateLimited, true, 'Should be rate-limited');
    assert.strictEqual(result.remainingAttempts, 0, 'No remaining attempts');
    assert.match(result.message, /Too many failed/);
  });
});
