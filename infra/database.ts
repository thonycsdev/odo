import { Pool, QueryResultRow } from "pg";

interface IDatabase {
  getPool(): Pool;
  query<T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T[]>;
}

class Database implements IDatabase {
  private static instance: Database;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  getPool(): Pool {
    return this.pool;
  }

  async query<T extends QueryResultRow>(sql: string, params?: unknown[]): Promise<T[]> {
    const result = await this.pool.query<T>(sql, params);
    return result.rows;
  }
}

const database = Database.getInstance();
export default database;