import { type NextRequest, NextResponse } from 'next/server';
import { handle } from '@/infra/error-handler';
import session from '@/models/session';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    await session.logoutUser(req);
    return NextResponse.json({}, { status: 200 });
  } catch (err) {
    const data = handle(err);
    return NextResponse.json(data, { status: data.status });
  }
}
