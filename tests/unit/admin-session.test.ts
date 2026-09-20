import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createAdminSession, verifyAdminSession } from '../../src/lib/auth/admin-session';

test('admin sessions reject forgery, tampering, expiry, and missing configuration', async () => {
  const previous = process.env.ADMIN_SESSION_SECRET;
  try {
    process.env.ADMIN_SESSION_SECRET = 'test-only-signing-secret-never-use-in-production';
    const now = Date.now();
    const token = await createAdminSession(now);
    assert.equal(await verifyAdminSession(token, now), true);
    assert.equal(await verifyAdminSession('admin', now), false);
    assert.equal(await verifyAdminSession(token.replace(/^\d/, '0'), now), false);
    assert.equal(await verifyAdminSession(token, now + 3600000), false);
    process.env.ADMIN_SESSION_SECRET = 'different-test-only-signing-secret-123456789';
    assert.equal(await verifyAdminSession(token, now), false);
    delete process.env.ADMIN_SESSION_SECRET;
    assert.equal(await verifyAdminSession(token, now), false);
    await assert.rejects(createAdminSession(now));
  } finally {
    if (previous === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = previous;
  }
});
