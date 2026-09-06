import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/infra/error-handler';
import { type AuthenticatedRequest, withAuth } from '@/infra/with-auth';
import transaction from '@/models/transaction';
import { TransactionUpdateRequestSchema } from '@/schemas/transaction';

type RouteContext = { params: Promise<{ id: string }> };

const handleGET = async (
  req: AuthenticatedRequest,
  { params }: RouteContext,
): Promise<NextResponse> => {
  const { id } = await params;
  const result = await transaction.getOneById(id, req.user.id);
  return NextResponse.json(result, { status: 200 });
};

const handlePATCH = async (
  req: AuthenticatedRequest,
  { params }: RouteContext,
): Promise<NextResponse> => {
  const { id } = await params;
  const requestBody = await req.json();
  const payload = TransactionUpdateRequestSchema.parse(requestBody);
  const result = await transaction.updateOne(id, req.user.id, payload);
  return NextResponse.json(result, { status: 200 });
};

const handleDELETE = async (
  req: AuthenticatedRequest,
  { params }: RouteContext,
): Promise<NextResponse> => {
  const { id } = await params;
  await transaction.deleteOne(id, req.user.id);
  return NextResponse.json({}, { status: 200 });
};

export const GET = withErrorHandling(withAuth(handleGET));
export const PATCH = withErrorHandling(withAuth(handlePATCH));
export const DELETE = withErrorHandling(withAuth(handleDELETE));
