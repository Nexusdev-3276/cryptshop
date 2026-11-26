import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listPush, listRange } from "@/lib/store";
import { getSessionAccountHash, isAdminSession } from "@/lib/auth";

type ChatMessage = {
  id: string;
  orderId: string;
  role: "customer" | "admin" | "system";
  text: string;
  createdAt: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId requis." }, { status: 400 });

  const accountHash = await getSessionAccountHash();
  const admin = await isAdminSession();
  if (!accountHash && !admin) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const messages = await listRange<ChatMessage>(`chat:${orderId}`, 0, -1);
  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  let body: { orderId?: string; text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide." }, { status: 400 });
  }
  const orderId = (body.orderId || "").trim();
  const text = (body.text || "").trim();
  if (!orderId || !text) return NextResponse.json({ error: "orderId et text requis." }, { status: 400 });
  if (text.length > 2000) return NextResponse.json({ error: "Message trop long." }, { status: 400 });

  const accountHash = await getSessionAccountHash();
  const admin = await isAdminSession();
  if (!accountHash && !admin) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const message: ChatMessage = {
    id: crypto.randomUUID(),
    orderId,
    role: admin ? "admin" : "customer",
    text,
    createdAt: new Date().toISOString(),
  };
  await listPush(`chat:${orderId}`, message);
  return NextResponse.json({ message });
}
