import crypto from 'node:crypto';
import database from '@/infra/database';
import { DatabaseError, InvalidCredentialsError } from '@/infra/error-handler';
import {
  type Session,
  SessionLoginSchema,
  type SessionResponse,
  SessionSchema,
} from '@/schemas/sessions';
import auth from './auth';
import user from './user';

const SESSION_TTL_MS = 60 * 60 * 24 * 30 * 1000; // 30 days

const checkCredentials = async (data: unknown): Promise<SessionResponse> => {
  const credentials = SessionLoginSchema.parse(data);
  const userInfo = await user.getUserByEmail(credentials.email);
  if (!userInfo) throw new InvalidCredentialsError();
  const result = await auth.isValid(
    credentials.password,
    userInfo.passwordHash,
  );
  if (!result) throw new InvalidCredentialsError();
  const expirationDate = new Date(Date.now() + SESSION_TTL_MS);
  const token = createCookieToken();
  const tokenHash = auth.hashToken(token);
  const sessionInfo = await createSession({
    userId: userInfo.id,
    tokenHash,
    expiresAt: expirationDate,
    userAgent: null,
  });

  if (!sessionInfo)
    throw new DatabaseError('Error while creating a new session');

  const response: SessionResponse = {
    userId: sessionInfo.userId,
    token,
    createdAt: sessionInfo.createdAt,
    expiresAt: sessionInfo.expiresAt,
  };
  return response;
};

const createSession = async (
  sessionData: Partial<Session>,
): Promise<Session | null> => {
  const rows = await database.query<{ [key: string]: unknown }>(
    'INSERT INTO sessions (token_hash, user_agent, user_id, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [
      sessionData.tokenHash,
      sessionData.userAgent,
      sessionData.userId,
      sessionData.expiresAt,
    ],
  );
  const row = rows[0];
  return row ? SessionSchema.parse(row) : null;
};

const createCookieToken = (): string => {
  const token = crypto.randomBytes(48).toString('hex');
  return token;
};

const session = { checkCredentials };

export default session;
