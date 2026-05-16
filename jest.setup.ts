import { config } from "dotenv";

config({ path: ".env.development" });

afterAll(async () => {
  const { default: database } = await import("@/infra/database");
  await database.getPool().end();
});
