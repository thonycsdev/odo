import database from '@/infra/database';
import { DatabaseError } from '@/infra/error-handler';
import type { HealthResponse } from '@/schemas/health';
import { HealthResponseSchema, HealthSchema } from '@/schemas/health';

const getDatabaseHealth = async (): Promise<HealthResponse> => {
  const data = await database.query(`
    SELECT
      version(),
      NOW() AS time,
      (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') AS active_connections
  `);
  const row = data[0];
  if (!row) throw new DatabaseError();
  const parsed = HealthSchema.parse(row);
  return HealthResponseSchema.parse(parsed);
};

export const health = { getDatabaseHealth };
