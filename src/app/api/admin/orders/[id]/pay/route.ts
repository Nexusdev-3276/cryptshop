import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/auth";
import { kvGet, kvSet } from "@/lib/store";
import { notifyPaymentConfirmed } from "@/lib/notify";
import type { PlacedOrder } from "@/lib/types";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const order = await kvGet<PlacedOrder>(`order:${id}`);
  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  if (order.payment.status === "paid") {
    return NextResponse.json({ error: "Déjà payé" }, { status: 400 });
  }

  const updated: PlacedOrder = {
    ...order,
    payment: {
      ...order.payment,
      status: "paid",
      txHash: `manual-${Date.now()}`,
    },
  };

  await kvSet(`order:${id}`, updated);
  await notifyPaymentConfirmed(updated);

  return NextResponse.json({ order: updated });
}