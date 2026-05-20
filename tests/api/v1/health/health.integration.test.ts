import orchestrator from '@/tests/common/orchestrator';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

describe('GET /api/v1/health', () => {
  let data: Record<string, unknown>;

  beforeAll(async () => {
    await orchestrator.resetDatabase();
    const res = await fetch(`${BASE_URL}/api/v1/health`);
    expect(res.status).toBe(200);
    data = await res.json();
  });

  it('returns the postgres version string', () => {
    expect(typeof data.version).toBe('string');
    expect(data.version).toMatch(/PostgreSQL/i);
  });

  it('returns the current database time as an ISO string', () => {
    expect(typeof data.time).toBe('string');
    expect(new Date(data.time as string).toString()).not.toBe('Invalid Date');
  });

  it('returns the number of active connections as a number', () => {
    expect(typeof data.activeConnections).toBe('number');
    expect(data.activeConnections).toBeGreaterThanOrEqual(1);
  });
});
