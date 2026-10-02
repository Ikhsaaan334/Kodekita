import { NextResponse } from "next/server";
import { availabilityMap } from "@/lib/runner";

export const dynamic = "force-dynamic";

export async function GET() {
  const map = await availabilityMap();
  return NextResponse.json(map);
}
