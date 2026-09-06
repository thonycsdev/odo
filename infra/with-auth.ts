import type { NextRequest, NextResponse } from 'next/server';
import { type RouterHandler, UnauthorizedError } from '@/infra/error-handler';
import session from '@/models/session';
import type { User } from '@/schemas/users';

export interface AuthenticatedRequest extends NextRequest {
  user: User;
}

export type AuthenticatedHandler<Context = unknown> = (
  req: AuthenticatedRequest,
  context: Context,
) => Promise<NextResponse>;

export function withAuth<Context = unknown>(
  handler: AuthenticatedHandler<Context>,
): RouterHandler<Context> {
  return async (req, context) => {
    const token = req.cookies.get('session_token')?.value;
    if (!token) throw new UnauthorizedError('Token not present');
    const user = await session.getTokenOwner(token);
    const authenticatedRequest = req as AuthenticatedRequest;
    authenticatedRequest.user = user;
    return handler(authenticatedRequest, context);
  };
}
