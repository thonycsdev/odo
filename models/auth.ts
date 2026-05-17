import bcrypt from "bcrypt";
import environment from "./environment";
import crypto from "node:crypto";

const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, getRoundsAmount());
  return hash;
};

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const isValid = async (
  password_provided: string,
  database_password: string,
) => {
  const result = await bcrypt.compare(password_provided, database_password);
  return result;
};

const getRoundsAmount = () => {
  if (environment.isDevEnvironment()) return 1;
  return 10;
};

const auth = { hashPassword, isValid, hashToken };

export default auth;
