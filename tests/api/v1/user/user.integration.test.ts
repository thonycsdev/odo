import { faker } from '@faker-js/faker';
import type { CreateUserRequest } from '@/models/user';
import orchestrator from '@/tests/common/orchestrator';

const BASE_URL = 'http://localhost:3000';
beforeAll(async () => {
  await orchestrator.resetDatabase();
});
const buildRequest = (
  overrides: Partial<CreateUserRequest> = {},
): CreateUserRequest => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: faker.person.fullName(),
  memberId: null,
  ...overrides,
});

const postUser = (body: CreateUserRequest): Promise<Response> =>
  fetch(`${BASE_URL}/api/v1/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

describe('POST /api/v1/user', () => {
  it('creates a user with null memberId', async () => {
    const res = await postUser(buildRequest({ memberId: null }));
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBeDefined();
  });

  it('creates a user with a memberId', async () => {
    const res = await postUser(
      buildRequest({ memberId: faker.string.alphanumeric(10) }),
    );
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.member_id).toBeDefined();
  });

  it('returns the correct fields and does not expose password_hash', async () => {
    const request = buildRequest();
    const res = await postUser(request);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBeDefined();
    expect(body.email).toBe(request.email);
    expect(body.name).toBe(request.name);
    expect(body.created_at).toBeDefined();
    expect(body.password_hash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const request = buildRequest();
    await postUser(request);

    const res = await postUser(buildRequest({ email: request.email }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });

  it('rejects duplicate memberId', async () => {
    const memberId = faker.string.alphanumeric(10);
    await postUser(buildRequest({ memberId }));

    const res = await postUser(buildRequest({ memberId }));
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.success).toBe(false);
  });
});
