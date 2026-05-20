import { z } from 'zod';

const HealthDbSchema = z
  .object({
    version: z.string(),
    time: z.coerce.date(),
    active_connections: z.coerce.number(),
  })
  .transform((row) => ({
    version: row.version,
    time: row.time,
    activeConnections: row.active_connections,
  }));

export const HealthSchema = HealthDbSchema;
export type DatabaseHealthData = z.infer<typeof HealthDbSchema>;

export const HealthResponseSchema = z.object({
  version: z.string(),
  time: z.coerce.date(),
  activeConnections: z.number(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;