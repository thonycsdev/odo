import { Session, SessionLogin, SessionResponse } from "@/schemas/sessions";
import user from "./user";
import { InvalidCredentials } from "@/infra/error-handler";
import crypto from "node:crypto";
import auth from "./auth";
import database from "@/infra/database";
const SESSION_TTL_MS = 60 * 60 * 24 * 30 * 1000; // 30 days

const checkCredentials = async (
  credentials: SessionLogin,
): Promise<SessionResponse> => {
  const userInfo = await user.getUserByEmail(credentials.email);
  if (!userInfo) throw new InvalidCredentials();
  const result = await auth.isValid(
    credentials.password,
    userInfo.password_hash,
  );
  if (!result) throw new InvalidCredentials();
  const expirationDate = new Date(Date.now() + SESSION_TTL_MS);
  const token = createCookieToken();
  const token_hash = auth.hashToken(token);
  const sessionInfo = await createSession({
    user_id: userInfo.id,
    token_hash: token_hash,
    expires_at: expirationDate,
    user_agent: null,
  });
  const response: SessionResponse = {
    user_id: sessionInfo.user_id,
    token: token,
    created_at: sessionInfo.created_at,
    expires_at: sessionInfo.expires_at,
  };
  return response;
};

const createSession = async (sessionData: Partial<Session>) => {
  console.log({ session: sessionData });
  const resultData = await database.query<Session>(
    "INSERT INTO Sessions (token_hash, user_agent,user_id,expires_at) VALUES ($1,$2,$3,$4) RETURNING *",
    [
      sessionData.token_hash,
      sessionData.user_agent,
      sessionData.user_id,
      sessionData.expires_at,
    ],
  );
  return resultData[0];
};

const createCookieToken = () => {
  const token = crypto.randomBytes(48).toString("hex");
  return token;
};

const session = { checkCredentials };

export default session;
