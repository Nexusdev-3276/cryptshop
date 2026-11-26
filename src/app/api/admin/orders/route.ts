import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { kvGet, listRange } from "@/lib/store";
import type { PlacedOrder } from "@/lib/types";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Non autorisé." }, { status: 401 });

  const ids = await listRange<string>("orders", 0, -1);
  const orders: PlacedOrder[] = [];
  for (const id of ids.reverse()) {
    const order = await kvGet<PlacedOrder>(`order:${id}`);
    if (order) orders.push(order);
  }
  return NextResponse.json({ orders });
}
