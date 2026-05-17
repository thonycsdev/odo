import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255),
  member_id: z.string().max(100).nullable(),
  email: z.string().email().max(255),
  password_hash: z.string().max(255),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const CreateUserRequestSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(255),
  member_id: z.string().max(100).nullable().optional(),
});

export const CreateUserResponseSchema = UserSchema.pick({
  id: true,
  email: true,
  name: true,
  member_id: true,
  created_at: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
