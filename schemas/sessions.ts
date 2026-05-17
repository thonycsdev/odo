import { z } from "zod";

export const SessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  token_hash: z.string(),
  created_at: z.coerce.date(),
  expires_at: z.coerce.date(),
  user_agent: z.string().nullable(),
});

export type Session = z.infer<typeof SessionSchema>;

export const SessionLoginSchema = z.object({
  email: z.email(),
  password: z.string().max(34).min(4),
});

export const SessionResponseSchema = z.object({
  user_id: z.string(),
  token: z.string(),
  created_at: z.coerce.date(),
  expires_at: z.coerce.date(),
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;

export type SessionLogin = z.infer<typeof SessionLoginSchema>;
