import { type NextRequest, NextResponse } from "next/server";
import { UnauthorizedError, withErrorHandling } from "@/infra/error-handler";
import { TransactionRequestSchema } from "@/schemas/transaction";
import transaction from "@/models/transaction";

import session from "@/models/session";

const handlePOST = async (req: NextRequest): Promise<NextResponse> => {
  const token = req.cookies.get("session_token")?.value;
  if (!token) throw new UnauthorizedError("Token not present");
  const requestBody = await req.json();
  const payload = TransactionRequestSchema.parse(requestBody);
  const result = await transaction.createOne(payload);
  return NextResponse.json(result, { status: 201 });
};
const handleGET = async (req: NextRequest): Promise<NextResponse> => {
  const token = req.cookies.get("session_token")?.value;
  if (!token) throw new UnauthorizedError("Token not present");
  const loggedUser = await session.getTokenOwner(token);
  const result = await transaction.getManyByUserId(loggedUser.id);
  return NextResponse.json(result, { status: 200 });
};
export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
