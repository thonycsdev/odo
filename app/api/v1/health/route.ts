import { NextResponse } from 'next/server';
import { handle } from '@/infra/error-handler';
import { health } from '@/models/health';

export async function GET(): Promise<NextResponse> {
  try {
    const data = await health.getDatabaseHealth();
    return NextResponse.json(data);
  } catch (err) {
    const errorData = handle(err);
    return NextResponse.json(errorData, { status: errorData.status });
  }
}
