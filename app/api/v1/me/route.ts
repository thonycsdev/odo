import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/infra/error-handler';
import { type AuthenticatedRequest, withAuth } from '@/infra/with-auth';

const handleGET = async (req: AuthenticatedRequest): Promise<NextResponse> => {
  return NextResponse.json({ email: req.user.email }, { status: 200 });
};

export const GET = withErrorHandling(withAuth(handleGET));
