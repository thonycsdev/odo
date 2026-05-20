import { z } from 'zod';

const PhysicalPointsDbSchema = z
  .object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    push_ups: z.number().int().min(0),
    abdominal_crunches: z.number().int().min(0),
    side_kicks: z.number().int().min(0),
    frontal_kicks: z.number().int().min(0),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  })
  .transform((row) => ({
    id: row.id,
    userId: row.user_id,
    pushUps: row.push_ups,
    abdominalCrunches: row.abdominal_crunches,
    sideKicks: row.side_kicks,
    frontalKicks: row.frontal_kicks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

export const PhysicalPointsSchema = PhysicalPointsDbSchema;
export type PhysicalPoints = z.infer<typeof PhysicalPointsDbSchema>;
