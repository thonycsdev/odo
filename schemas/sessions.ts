import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  token_hash: z.instanceof(Buffer),
  created_at: z.coerce.date(),
  expires_at: z.coerce.date(),
  user_agent: z.string().nullable(),
});

export type Session = z.infer<typeof SessionSchema>;
