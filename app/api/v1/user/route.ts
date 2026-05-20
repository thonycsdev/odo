import { type NextRequest, NextResponse } from 'next/server';
import { handle } from '@/infra/error-handler';
import user from '@/models/user';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const userData = await req.json();
    const createdUser = await user.createNewUser(userData);
    return NextResponse.json(createdUser, { status: 201 });
  } catch (err) {
    const data = handle(err);
    return NextResponse.json(data, { status: data.status });
  }
}
