import { z } from "zod";

export const PhysicalPointsSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  push_ups: z.number().int().min(0),
  abdominal_crunches: z.number().int().min(0),
  side_kicks: z.number().int().min(0),
  frontal_kicks: z.number().int().min(0),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type PhysicalPoints = z.infer<typeof PhysicalPointsSchema>;
