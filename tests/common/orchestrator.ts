import { runner } from "node-pg-migrate";
import path from "path";
import database from "@/infra/database";

const dropSchema = async () => {
  await database.query("DROP SCHEMA public CASCADE");
  await database.query("CREATE SCHEMA public");
};

const runMigrations = async () => {
  const client = await database.getPool().connect();
  try {
    await runner({
      dbClient: client,
      dir: path.resolve(process.cwd(), "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
    });
  } finally {
    client.release();
  }
};

const resetDatabase = async () => {
  await dropSchema();
  await runMigrations();
};

const orchestrator = { dropSchema, runMigrations, resetDatabase };

export default orchestrator;
