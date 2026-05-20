import { type NextRequest, NextResponse } from 'next/server';
import { handle } from '@/infra/error-handler';
import environment from '@/models/environment';
import session from '@/models/session';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const credentials = await req.json();
    const authenticationInfo = await session.checkCredentials(credentials);
    const response = NextResponse.json(authenticationInfo, { status: 200 });
    response.cookies.set('session_token', authenticationInfo.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: !environment.isDevEnvironment(),
      path: '/',
      expires: new Date(authenticationInfo.expiresAt),
    });
    return response;
  } catch (err) {
    const data = handle(err);
    return NextResponse.json(data, { status: data.status });
  }
}
