import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/infra/error-handler';
import { type AuthenticatedRequest, withAuth } from '@/infra/with-auth';
import transaction from '@/models/transaction';
import { TransactionCreateRequestSchema } from '@/schemas/transaction';

const handlePOST = async (req: AuthenticatedRequest): Promise<NextResponse> => {
  const requestBody = await req.json();
  const payload = TransactionCreateRequestSchema.parse(requestBody);
  const result = await transaction.createOne({
    ...payload,
    user_id: req.user.id,
  });
  return NextResponse.json(result, { status: 201 });
};
const handleGET = async (req: AuthenticatedRequest): Promise<NextResponse> => {
  const result = await transaction.getManyByUserId(req.user.id);
  return NextResponse.json(result, { status: 200 });
};
export const GET = withErrorHandling(withAuth(handleGET));
export const POST = withErrorHandling(withAuth(handlePOST));
