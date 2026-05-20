import path from 'node:path';
import { faker } from '@faker-js/faker';
import { runner } from 'node-pg-migrate';
import database from '@/infra/database';
import user, { type CreateUserResponse } from '@/models/user';

const dropSchema = async (): Promise<void> => {
  await database.query('DROP SCHEMA public CASCADE');
  await database.query('CREATE SCHEMA public');
};

const runMigrations = async (): Promise<void> => {
  const client = await database.getPool().connect();
  try {
    await runner({
      dbClient: client,
      dir: path.resolve(process.cwd(), 'migrations'),
      direction: 'up',
      migrationsTable: 'pgmigrations',
    });
  } finally {
    client.release();
  }
};

const resetDatabase = async (): Promise<void> => {
  await dropSchema();
  await runMigrations();
};

const createUser = async (
  overrides: Partial<{
    email: string;
    password: string;
    name: string;
    memberId: string | null;
  }> = {},
): Promise<CreateUserResponse & { password: string }> => {
  const data = {
    email: overrides.email ?? faker.internet.email(),
    password: overrides.password ?? faker.internet.password({ length: 12 }),
    name: overrides.name ?? faker.person.fullName(),
    memberId: overrides.memberId ?? null,
  };
  const created = await user.createNewUser(data);
  return { ...created, password: data.password };
};

const orchestrator = { dropSchema, runMigrations, resetDatabase, createUser };

export default orchestrator;
