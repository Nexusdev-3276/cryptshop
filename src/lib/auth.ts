import { cookies } from "next/headers";
import crypto from "node:crypto";
import { kvGet, kvSet, kvDel, randomToken, hashToken, timingSafeEqual } from "./store";

export const SESSION_COOKIE = "cs_session";
export const ADMIN_COOKIE = "cs_admin";
export const SESSION_TTL = 60 * 60 * 24 * 30; // 30 days
export const ADMIN_TTL = 60 * 60 * 8; // 8 hours

const ADMIN_SIGNING_SECRET = process.env.ADMIN_SECRET || "dev-admin-secret-change-me";

function signAdminSession(expiresAt: number) {
  const payload = `admin:${expiresAt}`;
  const sig = crypto.createHmac("sha256", ADMIN_SIGNING_SECRET).update(payload).digest("hex");
  return `${expiresAt}.${sig}`;
}

function verifyAdminSession(value: string): boolean {
  const [expStr, sig] = value.split(".");
  const expiresAt = Number(expStr);
  if (!expiresAt || !sig) return false;
  if (Date.now() > expiresAt) return false;
  const expected = crypto.createHmac("sha256", ADMIN_SIGNING_SECRET).update(`admin:${expiresAt}`).digest("hex");
  return timingSafeEqual(sig, expected);
}

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
  const expiresAt = Date.now() + ADMIN_TTL * 1000;
  return signAdminSession(expiresAt);
}

export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return verifyAdminSession(value);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export { randomToken, hashToken, timingSafeEqual };
