import auth from '@/models/auth';
import orchestrator from '@/tests/common/orchestrator';

describe('Session Checker Test', () => {
  const BASE_URL = 'http://localhost:3000';

  const postLogin = (body: Record<string, unknown>): Promise<Response> =>
    fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  it('Should Return 200 when cookie is present and valid', async () => {
    const user = await orchestrator.createUser();
    const user_login = await postLogin({
      email: user.email,
      password: user.password,
    });

    const cookie = user_login.headers.get('set-cookie');
    const response = await fetch(`${BASE_URL}/api/v1/me`, {
      method: 'GET',
      headers: {
        Cookie: cookie ?? '',
      },
    });
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.email).toBe(user.email);
  });

  it('Should return 401 when no cookie is present in the request', async () => {
    const session_info = await fetch(`${BASE_URL}/api/v1/me`, {
      method: 'GET',
      headers: {
        Cookie: '',
      },
    });
    expect(session_info.status).toBe(401);
  });
  it('Should Return 401 when cookie is present and but doesnt exists in the database', async () => {
    const cookie = auth.hashToken('INVALID_TOKEN');
    const response = await fetch(`${BASE_URL}/api/v1/me`, {
      method: 'GET',
      headers: {
        Cookie: cookie ?? '',
      },
    });
    expect(response.status).toBe(401);
  });
});
