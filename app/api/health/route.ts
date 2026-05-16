import { handle, ok } from "@/infra/error-handler";
import { health } from "@/models/health";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { version, time, active_connections } =
      await health.getDatabaseHealth();

    return NextResponse.json({
      version,
      time,
      active_connections: Number(active_connections),
    });
  } catch (err) {
    return NextResponse.json(handle(err));
  }
}
