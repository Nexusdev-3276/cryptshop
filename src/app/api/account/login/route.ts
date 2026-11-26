import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { kvGet } from "@/lib/store";
import { createAccountSession, SESSION_COOKIE, SESSION_TTL, hashToken } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }
  const token = (body.token || "").trim();
  if (!token) return NextResponse.json({ error: "Code requis." }, { status: 400 });

  const accountHash = hashToken(token);
  const account = await kvGet<{ createdAt: string }>(`account:${accountHash}`);
  if (!account) return NextResponse.json({ error: "Code invalide." }, { status: 401 });

  const sessionId = await createAccountSession(accountHash);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
  return NextResponse.json({ ok: true });
}
