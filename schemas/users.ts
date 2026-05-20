import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  member_id: z.string().max(100).nullable(),
  email: z.string().email().max(255),
  password_hash: z.string().max(255),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserRequestSchema = z.object({
  email: z.email().max(255),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(255),
  memberId: z.string().max(100).nullable().optional(),
});

export const CreateUserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.email().max(255),
  name: z.string().max(255),
  member_id: z.string().max(100).nullable(),
  created_at: z.coerce.date(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
