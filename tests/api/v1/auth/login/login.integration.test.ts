import crypto from 'node:crypto';
import { faker } from '@faker-js/faker';
import setCookieParser from 'set-cookie-parser';
import database from '@/infra/database';
import orchestrator from '@/tests/common/orchestrator';

const BASE_URL = 'http://localhost:3000';

beforeAll(async () => {
  await orchestrator.resetDatabase();
});

const postLogin = (body: Record<string, unknown>): Promise<Response> =>
  fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/v1/auth/login', () => {
  describe('Anonymous User', () => {
    test('With incorrect `email`, but correct `password`', async () => {
      await orchestrator.createUser({ password: 'correctpassword' });

      const response = await postLogin({
        email: 'wrong@example.com',
        password: 'correctpassword',
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Invalid credentials');
    });

    test('With correct `email`, but incorrect `password`', async () => {
      const correctEmail = faker.internet.email();
      await orchestrator.createUser({ email: correctEmail });

      const response = await postLogin({
        email: correctEmail,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Invalid credentials');
    });

    test('With incorrect `email` and incorrect `password`', async () => {
      await orchestrator.createUser();

      const response = await postLogin({
        email: 'nobody@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      const responseBody = await response.json();
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Invalid credentials');
    });

    test('With missing `email`', async () => {
      const response = await postLogin({ password: 'somepassword' });
      expect(response.status).toBe(422);
    });

    test('With missing `password`', async () => {
      const response = await postLogin({ email: 'user@example.com' });
      expect(response.status).toBe(422);
    });

    test('With empty body', async () => {
      const response = await postLogin({});
      expect(response.status).toBe(422);
    });

    test('With correct `email` and correct `password`', async () => {
      const correctEmail = faker.internet.email();
      const correctPassword = faker.internet.password({ length: 12 });
      const createdUser = await orchestrator.createUser({
        email: correctEmail,
        password: correctPassword,
      });

      const response = await postLogin({
        email: correctEmail,
        password: correctPassword,
      });

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(responseBody).toEqual({
        token: responseBody.token,
        user_id: createdUser.id,
        created_at: responseBody.created_at,
        expires_at: responseBody.expires_at,
      });

      const SESSION_TTL_MS = 60 * 60 * 24 * 30 * 1000; // 30 days
      const createdAt = new Date(responseBody.created_at);
      createdAt.setMilliseconds(0);
      createdAt.setSeconds(0);
      const expiresAt = new Date(responseBody.expires_at);
      expiresAt.setMilliseconds(0);
      expiresAt.setSeconds(0);
      expect(expiresAt.getTime() - createdAt.getTime()).toBe(SESSION_TTL_MS);

      const cookies = setCookieParser(response, { map: true });
      expect(cookies.session_token.name).toBe('session_token');
      expect(cookies.session_token.value).toBe(responseBody.token);
      expect(cookies.session_token.path).toBe('/');
      expect(cookies.session_token.httpOnly).toBe(true);
      expect(cookies.session_token.sameSite?.toLowerCase()).toBe('lax');

      const tokenHash = crypto
        .createHash('sha256')
        .update(responseBody.token)
        .digest('hex');
      const rows = await database.query(
        'SELECT * FROM sessions WHERE token_hash = $1',
        [tokenHash],
      );
      expect(rows.length).toBe(1);
      expect(rows[0].token_hash).not.toBe(responseBody.token);
    });
  });
});
