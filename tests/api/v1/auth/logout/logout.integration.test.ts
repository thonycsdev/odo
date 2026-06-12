import setCookieParser from 'set-cookie-parser';
import database from '@/infra/database';
import auth from '@/models/auth';
import type { Session } from '@/schemas/sessions';
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
  describe('Authenticated User', () => {
    test('should clear the session_token cookie', async () => {
      const userData = await orchestrator.createUser();

      const loginResponse = await postLogin({
        email: userData.email,
        password: userData.password,
      });
      const loginCookies = setCookieParser(loginResponse, { map: true });
      const sessionCookie = `session_token=${loginCookies.session_token.value}`;

      const logoutResponse = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Cookie: sessionCookie },
      });

      expect(logoutResponse.status).toBe(200);
      const logoutCookies = setCookieParser(logoutResponse, { map: true });
      expect(logoutCookies.session_token.value).toBe('');
      expect(logoutCookies.session_token.expires?.getTime()).toBeLessThan(
        Date.now(),
      );
    });

    test('POST should change expiration date to NOW - 2 Days', async () => {
      const userData = await orchestrator.createUser();

      const userLogin = await postLogin({
        email: userData.email,
        password: userData.password,
      });
      const cookies = setCookieParser(userLogin, { map: true });
      const sessionCookie = `session_token=${cookies.session_token.value}`;
      const response = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Cookie: sessionCookie },
      });
      expect(response.status).toBe(200);

      const rows = await database.query<Session>(
        'SELECT * FROM sessions s WHERE s.token_hash = $1',
        [auth.hashToken(cookies.session_token.value)],
      );
      expect(rows[0].expires_at.getTime()).toBeLessThan(
        new Date(Date.now()).getTime(),
      );
      const THREE_DAYS_MS = 60 * 60 * 24 * 3 * 1000;
      expect(rows[0].expires_at.getTime()).toBeGreaterThan(
        new Date(Date.now() - THREE_DAYS_MS).getTime(),
      );
    });
  });
});
