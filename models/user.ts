import database from "@/infra/database";
import { BadRequestError } from "@/infra/error-handler";
import auth from "./auth";

export type CreateUserRequest = {
  email: string;
  password: string;
  name: string;
  member_id: string | null;
};

export type CreateUserResponse = {
  id: string;
  email: string;
  name: string;
  member_id: string | null;
  created_at: string;
};

const createNewUser = async (
  data: CreateUserRequest,
): Promise<CreateUserResponse> => {
  await checkIfEmailIsRegistered(data.email);
  await checkIfMemberIDIsRegistered(data.member_id);
  const password_hashed = await auth.hashPassword(data.password);
  const createdUser = await database.query(
    "INSERT INTO Users (email, password_hash,name, member_id) VALUES ($1,$2,$3,$4) RETURNING *",
    [data.email, password_hashed, data.name, data.member_id],
  );
  return {
    id: createdUser[0].id,
    email: createdUser[0].email,
    name: createdUser[0].name,
    member_id: createdUser[0].member_id,
    created_at: createdUser[0].created_at,
  };
};

const checkIfEmailIsRegistered = async (email: string) => {
  const user = await getUserByEmail(email);
  if (user) throw new BadRequestError("email already registered");
};

const getUserByEmail = async (email: string) => {
  const user = await database.query(
    "SELECT * FROM Users u WHERE u.email = $1",
    [email],
  );
  return user[0];
};

const getUserByMemberID = async (member_id: string) => {
  const user = await database.query(
    "SELECT * FROM Users u WHERE u.member_id = $1",
    [member_id],
  );
  return user[0];
};

const checkIfMemberIDIsRegistered = async (member_id: string | null) => {
  if (!member_id || member_id.trim().length === 0) return;
  const user = await getUserByMemberID(member_id);
  if (user) throw new BadRequestError("member_id already registered");
};

const user = { createNewUser };

export default user;
