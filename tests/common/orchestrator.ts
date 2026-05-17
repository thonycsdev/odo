import { runner } from "node-pg-migrate";
import path from "path";
import database from "@/infra/database";
import user, { CreateUserResponse } from "@/models/user";
import { faker } from "@faker-js/faker";

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

const createUser = async (
  overrides: Partial<{
    email: string;
    password: string;
    name: string;
    member_id: string | null;
  }> = {},
): Promise<CreateUserResponse & { password: string }> => {
  const data = {
    email: overrides.email ?? faker.internet.email(),
    password: overrides.password ?? faker.internet.password({ length: 12 }),
    name: overrides.name ?? faker.person.fullName(),
    member_id: overrides.member_id ?? null,
  };
  const created = await user.createNewUser(data);
  return { ...created, password: data.password };
};

const orchestrator = { dropSchema, runMigrations, resetDatabase, createUser };

export default orchestrator;
