import { type NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import logger from '@/infra/logger';

interface ApiResponse<T = null> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}
export class DatabaseError extends AppError {
  constructor(message = 'Database Related Error') {
    super(500, message);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message = 'Invalid credentials') {
    super(401, message);
    this.name = 'Invalid credentials';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export function ok<T>(data: T, message = 'Success'): ApiResponse<T> {
  return { success: true, status: 200, message, data };
}

export function fail(status: number, message: string): ApiResponse {
  return { success: false, status, message };
}

export function handle(error: unknown): ApiResponse {
  if (error instanceof ZodError) {
    logger.info({ err: error }, error.name);
    return fail(422, error.issues.at(0)?.message ?? `Invalid Field`);
  }
  if (error instanceof AppError) {
    logger.error({ err: error }, error.name);
    return fail(error.status, error.message);
  }
  logger.error({ err: error }, 'Unhandled application error');
  return fail(500, 'Internal server error');
}

export type RouterHandler<Context = unknown> = (
  req: NextRequest,
  context: Context,
) => Promise<NextResponse>;

export function withErrorHandling<Context>(
  handler: RouterHandler<Context>,
): RouterHandler<Context> {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx);
    } catch (e) {
      const data = handle(e);
      return NextResponse.json(data, { status: data.status });
    }
  };
}
