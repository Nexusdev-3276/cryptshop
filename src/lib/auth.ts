import { cookies } from "next/headers";
import { kvGet, kvSet, kvDel, randomToken, hashToken, timingSafeEqual } from "./store";

export const SESSION_COOKIE = "cs_session";
export const ADMIN_COOKIE = "cs_admin";
export const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
export const ADMIN_TTL = 60 * 60 * 8; // 8 hours

export async function createAccountSession(accountHash: string) {
  const sessionId = randomToken(24);
  await kvSet(`session:${sessionId}`, { accountHash, createdAt: new Date().toISOString() }, SESSION_TTL);
  return sessionId;
}

export async function getSessionAccountHash(): Promise<string | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  const session = await kvGet<{ accountHash: string }>(`session:${sessionId}`);
  return session?.accountHash ?? null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) await kvDel(`session:${sessionId}`);
  cookieStore.delete(SESSION_COOKIE);
}

export async function createAdminSession() {
  const sessionId = randomToken(24);
  await kvSet(`adminsession:${sessionId}`, { createdAt: new Date().toISOString() }, ADMIN_TTL);
  return sessionId;
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!sessionId) return false;
  const session = await kvGet<{ createdAt: string }>(`adminsession:${sessionId}`);
  return Boolean(session);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ADMIN_COOKIE)?.value;
  if (sessionId) await kvDel(`adminsession:${sessionId}`);
  cookieStore.delete(ADMIN_COOKIE);
}

export { randomToken, hashToken, timingSafeEqual };
