import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { kvSet } from "@/lib/store";
import { createAccountSession, SESSION_COOKIE, SESSION_TTL, hashToken, randomToken } from "@/lib/auth";

export async function POST() {
  const token = randomToken(32);
  const accountHash = hashToken(token);
  await kvSet(`account:${accountHash}`, { createdAt: new Date().toISOString(), orders: [] });
  const sessionId = await createAccountSession(accountHash);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_TTL,
    path: "/",
  });
  return NextResponse.json({ token, accountHash });
}
