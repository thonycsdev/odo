import { type NextRequest, NextResponse } from "next/server";
import { handle, UnauthorizedError } from "@/infra/error-handler";
import session from "@/models/session";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const token = req.cookies.get("session_token")?.value;
    if (!token) throw new UnauthorizedError("Token not present");

    const user = await session.getTokenOwner(token);
    return NextResponse.json({ email: user.email }, { status: 200 });
  } catch (err) {
    const data = handle(err);
    return NextResponse.json(data, { status: data.status });
  }
}
