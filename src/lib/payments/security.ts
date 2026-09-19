/**
 * Security utilities for Manual UPI / WhatsApp payment confirmation.
 * The 6-digit confirmation code is strictly a reference identifier, NOT proof of payment.
 * Banking receipt must be independently verified by the admin before marking as paid.
 * Only the SHA-256 hash is stored, with rate-limiting on verification attempts.
 */

export const MAX_VERIFICATION_ATTEMPTS = 5;

/**
 * Computes SHA-256 hash of a string using Web Crypto API.
 */
export async function hashVerificationCode(code: string): Promise<string> {
  const normalized = code.trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface VerificationResult {
  valid: boolean;
  rateLimited: boolean;
  remainingAttempts: number;
  message: string;
}

/**
 * Verifies an entered 6-digit confirmation code against its stored SHA-256 hash.
 * Enforces rate-limiting up to MAX_VERIFICATION_ATTEMPTS.
 */
export async function verifyPaymentCode(
  enteredCode: string,
  storedHash: string,
  currentAttempts: number
): Promise<VerificationResult> {
  if (currentAttempts >= MAX_VERIFICATION_ATTEMPTS) {
    return {
      valid: false,
      rateLimited: true,
      remainingAttempts: 0,
      message: 'Too many failed verification attempts. This order requires manual bank statement review.',
    };
  }

  const computedHash = await hashVerificationCode(enteredCode);
  const valid = computedHash === storedHash;

  const nextAttempts = currentAttempts + 1;
  const remaining = Math.max(0, MAX_VERIFICATION_ATTEMPTS - nextAttempts);

  if (valid) {
    return {
      valid: true,
      rateLimited: false,
      remainingAttempts: remaining,
      message: 'Verification code confirmed. Store operator must verify funds in banking before fulfilling.',
    };
  }

  return {
    valid: false,
    rateLimited: nextAttempts >= MAX_VERIFICATION_ATTEMPTS,
    remainingAttempts: remaining,
    message: `Invalid verification code. ${remaining} attempts remaining.`,
  };
}
