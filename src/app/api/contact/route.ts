import { NextResponse } from "next/server";
import { notifyMessage } from "@/lib/notify";

const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Trop de messages. Réessayez plus tard." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const body = payload as { name?: unknown; email?: unknown; message?: unknown };
  const name = text(body.name, 80);
  const email = text(body.email, 120).toLowerCase();
  const message = text(body.message, 2000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: "Champs incomplets ou invalides." }, { status: 400 });
  }

  await notifyMessage(name, email, message);
  return NextResponse.json({ ok: true });
}
