import { createHash, randomBytes } from "node:crypto";

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const memory = new Map<string, unknown>();
const memoryLists = new Map<string, unknown[]>();

function hasUpstash() {
  return Boolean(UPSTASH_URL && UPSTASH_TOKEN);
}

async function upstash(command: string[]) {
  if (!hasUpstash()) throw new Error("upstash not configured");
  const response = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });
  if (!response.ok) throw new Error(`upstash ${response.status}`);
  const data = (await response.json()) as { result?: unknown; error?: string };
  if (data.error) throw new Error(data.error);
  return data.result;
}

export async function kvGet<T>(key: string): Promise<T | null> {
  if (hasUpstash()) {
    const result = await upstash(["GET", key]);
    if (result === null || result === undefined) return null;
    try {
      return JSON.parse(String(result)) as T;
    } catch {
      return result as T;
    }
  }
  return (memory.get(key) as T) ?? null;
}

export async function kvSet(key: string, value: unknown, ttlSeconds?: number) {
  if (hasUpstash()) {
    const cmd = ttlSeconds
      ? ["SET", key, JSON.stringify(value), "EX", String(ttlSeconds)]
      : ["SET", key, JSON.stringify(value)];
    await upstash(cmd);
    return;
  }
  memory.set(key, value);
  if (ttlSeconds) {
    setTimeout(() => memory.delete(key), ttlSeconds * 1000);
  }
}

export async function kvDel(key: string) {
  if (hasUpstash()) {
    await upstash(["DEL", key]);
    return;
  }
  memory.delete(key);
}

export async function listPush(key: string, value: unknown) {
  if (hasUpstash()) {
    await upstash(["RPUSH", key, JSON.stringify(value)]);
    return;
  }
  const list = memoryLists.get(key) ?? [];
  list.push(value);
  memoryLists.set(key, list);
}

export async function listRange<T>(key: string, start = 0, stop = -1): Promise<T[]> {
  if (hasUpstash()) {
    const result = await upstash(["LRANGE", key, String(start), String(stop)]);
    if (!Array.isArray(result)) return [];
    return result.map((item) => {
      try {
        return JSON.parse(String(item)) as T;
      } catch {
        return item as T;
      }
    });
  }
  const list = memoryLists.get(key) ?? [];
  const end = stop === -1 ? list.length : stop + 1;
  return list.slice(start, end) as T[];
}

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function timingSafeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  const { timingSafeEqual: tse } = require("node:crypto");
  return tse(bufA, bufB);
}
