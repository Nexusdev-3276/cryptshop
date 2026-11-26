import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { kvGet, listRange, listPush } from "@/lib/store";

export async function GET(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");
  if (orderId) {
    const messages = await listRange(`chat:${orderId}`, 0, -1);
    return NextResponse.json({ messages });
  }

  const ids = await listRange<string>("orders", 0, -1);
  const threads: { orderId: string; count: number; last?: unknown }[] = [];
  for (const id of ids) {
    const msgs = await listRange(`chat:${id}`, 0, -1);
    if (msgs.length > 0) {
      threads.push({ orderId: id, count: msgs.length, last: msgs[msgs.length - 1] });
    }
  }
  return NextResponse.json({ threads });
}
