import { z } from 'zod';

const SessionDbSchema = z
  .object({
    id: z.string().uuid(),
    user_id: z.string().uuid(),
    token_hash: z.string(),
    created_at: z.coerce.date(),
    expires_at: z.coerce.date(),
    user_agent: z.string().nullable(),
  })
  .transform((row) => ({
    id: row.id,
    userId: row.user_id,
    tokenHash: row.token_hash,
    createdAt: row.created_at,
    expiresAt: row.expires_at,
    userAgent: row.user_agent,
  }));

export const SessionSchema = SessionDbSchema;
export type Session = z.infer<typeof SessionDbSchema>;

export const SessionLoginSchema = z.object({
  email: z.email(),
  password: z.string('must have a valid password').max(72).min(8),
});

export const SessionResponseSchema = z.object({
  userId: z.string(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
export type SessionLogin = z.infer<typeof SessionLoginSchema>;
