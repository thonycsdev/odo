import bcrypt from "bcrypt";
import environment from "./environment";

const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, getRoundsAmount());
  return hash;
};

const isValid = (password_provided: string, database_password: string) => {};

const getRoundsAmount = () => {
  if (environment.isDevEnvironment()) return 1;
  return 10;
};

const auth = { hashPassword, isValid };

export default auth;
