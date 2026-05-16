import database from "@/infra/database"

const getDatabaseHealth = async () => {
    const data = await database.query<{
    version: string;
    time: string;
    active_connections: string;
  }>(`
    SELECT
      version(),
      NOW() AS time,
      (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') AS active_connections
  `);
    return data[0];
}

export const health = {getDatabaseHealth}