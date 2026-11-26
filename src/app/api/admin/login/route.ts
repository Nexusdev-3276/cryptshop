import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { timingSafeEqual } from "@/lib/store";
import { createAdminSession, ADMIN_COOKIE, ADMIN_TTL } from "@/lib/auth";

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return NextResponse.json({ error: "ADMIN_SECRET non configuré." }, { status: 500 });
  }

  let body: { secret?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }
  const secret = (body.secret || "").trim();
  if (!secret || !timingSafeEqual(secret, adminSecret)) {
    return NextResponse.json({ error: "Secret invalide." }, { status: 401 });
  }

  const sessionId = await createAdminSession();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: ADMIN_TTL,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}
