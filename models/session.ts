import crypto from 'node:crypto';
import type { NextRequest } from 'next/server';
import database from '@/infra/database';
import {
  DatabaseError,
  InvalidCredentialsError,
  NotFoundError,
} from '@/infra/error-handler';
import {
  type Session,
  SessionLoginSchema,
  type SessionResponse,
  SessionSchema,
} from '@/schemas/sessions';
import type { User } from '@/schemas/users';
import auth from './auth';
import user from './user';

const SESSION_TTL_MS = 60 * 60 * 24 * 30 * 1000; // 30 days
const TWO_DAYS_MS = 60 * 60 * 24 * 2 * 1000; // 2 days

const checkCredentials = async (data: unknown): Promise<SessionResponse> => {
  const credentials = SessionLoginSchema.parse(data);
  const userInfo = await user.getUserByEmail(credentials.email);
  if (!userInfo) throw new InvalidCredentialsError();
  const result = await auth.isValid(
    credentials.password,
    userInfo.password_hash,
  );
  if (!result) throw new InvalidCredentialsError();
  const sessionInfo = await createSession({
    user_id: userInfo.id,
    user_agent: null,
  });

  if (!sessionInfo)
    throw new DatabaseError('Error while creating a new session');

  const response: SessionResponse = {
    user_id: sessionInfo.user_id,
    token: sessionInfo.token_hash,
    created_at: sessionInfo.created_at,
    expires_at: sessionInfo.expires_at,
  };
  return response;
};

const createSession = async (
  sessionData: Partial<Session>,
): Promise<Session | null> => {
  const expirationDate = new Date(Date.now() + SESSION_TTL_MS);
  const token = createCookieToken();
  const token_hash = auth.hashToken(token);
  const rows = await database.query<{ [key: string]: unknown }>(
    'INSERT INTO sessions (token_hash, user_agent, user_id, expires_at) VALUES ($1, $2, $3, $4) RETURNING *',
    [token_hash, sessionData.user_agent, sessionData.user_id, expirationDate],
  );
  const row = rows[0];
  row.token_hash = token;
  const result = SessionSchema.parse(row);
  return result;
};

const getSessionByCookieId = async (
  cookieHashedToken: string,
): Promise<Session | null> => {
  const rows = await database.query<{ [key: string]: unknown }>(
    'SELECT * FROM sessions WHERE token_hash = $1',
    [cookieHashedToken],
  );
  const row = rows[0];

  return row ? SessionSchema.parse(row) : null;
};

const updateSessionExpiration = async (
  sessionId: string,
  expiresAt: Date,
): Promise<Session | null> => {
  const rows = await database.query(
    'UPDATE sessions SET expires_at = $1 WHERE id = $2 RETURNING *',
    [expiresAt, sessionId],
  );
  const row = rows[0];
  return row ? SessionSchema.parse(row) : null;
};

const createCookieToken = (): string => {
  const token = crypto.randomBytes(48).toString('hex');
  return token;
};

const logoutUser = async (req: NextRequest): Promise<void> => {
  const userCookie = req.cookies.get('session_token');
  if (!userCookie) throw new NotFoundError();

  const tokenHash = auth.hashToken(userCookie.value);
  const userSession = await getSessionByCookieId(tokenHash);

  if (!userSession) throw new NotFoundError();

  const newExpirationDate = new Date(Date.now() - TWO_DAYS_MS);
  const result = await updateSessionExpiration(
    userSession.id,
    newExpirationDate,
  );
  if (!result) throw new DatabaseError('Error to update session information');
};
const getTokenOwner = async (token: string): Promise<User> => {
  const hash = await auth.hashToken(token);
  const session = await getSessionByCookieId(hash);
  if (!session) throw new InvalidCredentialsError('Invalid Token Given');
  const current_user = await user.getUserById(session.user_id);
  if (!current_user)
    throw new InvalidCredentialsError('Invalid Token - User Not Identified');
  return current_user;
};

const session = {
  checkCredentials,
  logoutUser,
  createSession,
  getTokenOwner,
};

export default session;
