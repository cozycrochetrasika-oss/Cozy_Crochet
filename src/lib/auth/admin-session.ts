export const ADMIN_COOKIE = 'cozy_admin_session';
const lifetime = 60 * 60;

async function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error('Admin session signing is not configured');
  return crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

function hex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function createAdminSession(now = Date.now()) {
  const payload = `${Math.floor(now / 1000) + lifetime}.${crypto.randomUUID()}`;
  const signature = await crypto.subtle.sign('HMAC', await signingKey(), new TextEncoder().encode(payload));
  return `${payload}.${hex(signature)}`;
}

export async function verifyAdminSession(token: string | undefined, now = Date.now()) {
  if (!token || token.length > 200) return false;
  const [expiry, nonce, signature, extra] = token.split('.');
  if (extra || !/^\d+$/.test(expiry) || !nonce || !/^[a-f0-9]{64}$/.test(signature || '')) return false;
  const remaining = Number(expiry) - Math.floor(now / 1000);
  if (remaining <= 0 || remaining > lifetime) return false;
  try {
    const bytes = Uint8Array.from(signature.match(/../g)!, (byte) => parseInt(byte, 16));
    return await crypto.subtle.verify('HMAC', await signingKey(), bytes, new TextEncoder().encode(`${expiry}.${nonce}`));
  } catch {
    return false;
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: lifetime,
};
