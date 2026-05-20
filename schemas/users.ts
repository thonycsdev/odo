import { z } from 'zod';

const UserDbSchema = z
  .object({
    id: z.string().uuid(),
    name: z.string().max(255),
    member_id: z.string().max(100).nullable(),
    email: z.string().email().max(255),
    password_hash: z.string().max(255),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  })
  .transform((row) => ({
    id: row.id,
    name: row.name,
    memberId: row.member_id,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

export const UserSchema = UserDbSchema;
export type User = z.infer<typeof UserDbSchema>;

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
  memberId: z.string().max(100).nullable(),
  createdAt: z.coerce.date(),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
