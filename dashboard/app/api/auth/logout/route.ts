import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BASE_URL = process.env.DASHBOARD_URL!;

export async function POST() {
  const session = await getSession();
  session.destroy();
  return NextResponse.redirect(new URL("/", BASE_URL));
}