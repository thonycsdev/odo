import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import environment from './environment';

const hashPassword = async (password: string): Promise<string> => {
  const hash = await bcrypt.hash(password, getRoundsAmount());
  return hash;
};

const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const isValid = async (
  passwordProvided: string,
  databasePassword: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(passwordProvided, databasePassword);
  return result;
};

const getRoundsAmount = (): number => {
  if (environment.isDevEnvironment()) return 1;
  return 10;
};

const auth = { hashPassword, isValid, hashToken };

export default auth;
