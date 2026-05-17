import database from "@/infra/database";
import { BadRequestError } from "@/infra/error-handler";
import {
  CreateUserRequest,
  CreateUserRequestSchema,
  CreateUserResponse,
  CreateUserResponseSchema,
  User,
} from "@/schemas/users";
import auth from "./auth";

export type { CreateUserRequest, CreateUserResponse };

const createNewUser = async (data: unknown): Promise<CreateUserResponse> => {
  const parsed = CreateUserRequestSchema.parse(data);
  await Promise.all([
    checkIfEmailIsRegistered(parsed.email),
    checkIfMemberIDIsRegistered(parsed.member_id ?? null),
  ]);
  const password_hashed = await auth.hashPassword(parsed.password);
  const createdUser = await database.query(
    "INSERT INTO Users (email, password_hash,name, member_id) VALUES ($1,$2,$3,$4) RETURNING *",
    [parsed.email, password_hashed, parsed.name, parsed.member_id ?? null],
  );
  return CreateUserResponseSchema.parse(createdUser[0]);
};

const checkIfEmailIsRegistered = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user) throw new BadRequestError("email already registered");
};

const getUserByEmail = async (email: string) => {
  const user = await database.query<User>(
    "SELECT * FROM Users WHERE email = $1",
    [email],
  );
  return user[0] ?? null;
};

const getUserByMemberID = async (member_id: string) => {
  const user = await database.query<User>(
    "SELECT * FROM Users WHERE member_id = $1",
    [member_id],
  );
  return user[0];
};

const checkIfMemberIDIsRegistered = async (member_id: string | null) => {
  if (!member_id || member_id.trim().length === 0) return;
  const user = await getUserByMemberID(member_id);
  if (user) throw new BadRequestError("member_id already registered");
};

const user = { createNewUser, getUserByEmail };

export default user;
