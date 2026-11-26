import { NextResponse } from "next/server";
import { getSessionAccountHash } from "@/lib/auth";
import { kvGet } from "@/lib/store";

export async function GET() {
  const accountHash = await getSessionAccountHash();
  if (!accountHash) return NextResponse.json({ account: null }, { status: 401 });
  const account = await kvGet<{ createdAt: string; orders: string[] }>(`account:${accountHash}`);
  return NextResponse.json({ accountHash, account });
}
