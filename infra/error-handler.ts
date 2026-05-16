interface ApiResponse<T = null> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

export class AppError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(400, message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export function ok<T>(data: T, message = "Success"): ApiResponse<T> {
  return { success: true, status: 200, message, data };
}

export function fail(status: number, message: string): ApiResponse {
  return { success: false, status, message };
}

export function handle(error: unknown): ApiResponse {
  console.error(error);
  if (error instanceof AppError) {
    return fail(error.status, error.message);
  }
  return fail(500, "Internal server error");
}
