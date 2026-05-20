import database from '@/infra/database';
import { BadRequestError, DatabaseError } from '@/infra/error-handler';
import {
  type CreateUserRequest,
  CreateUserRequestSchema,
  type CreateUserResponse,
  CreateUserResponseSchema,
  type User,
  UserSchema,
} from '@/schemas/users';
import auth from './auth';

export type { CreateUserRequest, CreateUserResponse };

const createNewUser = async (data: unknown): Promise<CreateUserResponse> => {
  const parsed = CreateUserRequestSchema.parse(data);
  await Promise.all([
    checkIfEmailIsRegistered(parsed.email),
    checkIfMemberIdIsRegistered(parsed.memberId ?? null),
  ]);
  const passwordHashed = await auth.hashPassword(parsed.password);
  const result = await insertNewUser({ ...parsed, password: passwordHashed });
  if (!result) throw new DatabaseError('Erro while creating a new user');
  return CreateUserResponseSchema.parse(result);
};

const insertNewUser = async (
  userData: CreateUserRequest,
): Promise<User | null> => {
  const rows = await database.query<{ [key: string]: unknown }>(
    'INSERT INTO users (email, password_hash, name, member_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [userData.email, userData.password, userData.name, userData.memberId ?? null],
  );
  const row = rows[0];
  return row ? UserSchema.parse(row) : null;
};

const checkIfEmailIsRegistered = async (email: string): Promise<void> => {
  const user = await getUserByEmail(email);
  if (user) throw new BadRequestError('email already registered');
};

const getUserByEmail = async (email: string): Promise<User | null> => {
  const rows = await database.query<{ [key: string]: unknown }>(
    'SELECT * FROM users WHERE email = $1',
    [email],
  );
  const row = rows[0];
  return row ? UserSchema.parse(row) : null;
};

const getUserByMemberId = async (memberId: string): Promise<User | null> => {
  const rows = await database.query<{ [key: string]: unknown }>(
    'SELECT * FROM users WHERE member_id = $1',
    [memberId],
  );
  const row = rows[0];
  return row ? UserSchema.parse(row) : null;
};

const checkIfMemberIdIsRegistered = async (
  memberId: string | null,
): Promise<void> => {
  if (!memberId || memberId.trim().length === 0) return;
  const user = await getUserByMemberId(memberId);
  if (user) throw new BadRequestError('memberId already registered');
};

const user = { createNewUser, getUserByEmail };

export default user;
