import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { rows } = await db.query<{
    version: string;
    time: string;
    active_connections: string;
  }>(`
    SELECT
      version(),
      NOW() AS time,
      (SELECT count(*) FROM pg_stat_activity WHERE state = 'active') AS active_connections
  `);

  const { version, time, active_connections } = rows[0];

  return NextResponse.json({
    version,
    time,
    active_connections: Number(active_connections),
  });
}
