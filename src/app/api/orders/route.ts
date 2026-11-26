import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getProduct } from "@/lib/products";
import { COUNTRIES } from "@/lib/currency";
import { getRates } from "@/lib/rates";
import { shippingFor } from "@/lib/format";
import { notifyOrder } from "@/lib/notify";
import { saveOrder } from "@/lib/upstash";
import { kvGet, kvSet, listPush, randomToken, hashToken } from "@/lib/store";
import { getSessionAccountHash, createAccountSession, SESSION_COOKIE, SESSION_TTL } from "@/lib/auth";
import type { CountryCode, CryptoCode, Customer, OrderItem, PlacedOrder } from "@/lib/types";

const DECIMALS: Record<CryptoCode, number> = { BTC: 8, ETH: 6, SOL: 6 };
const WALLETS: Record<CryptoCode, string | undefined> = {
  BTC: process.env.BTC_ADDRESS,
  ETH: process.env.ETH_ADDRESS,
  SOL: process.env.SOL_ADDRESS,
};

const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 6;
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function paymentUri(code: CryptoCode, address: string, amount: number): string {
  if (code === "BTC") return `bitcoin:${address}?amount=${amount}`;
  if (code === "SOL") return `solana:${address}?amount=${amount}`;
  return `ethereum:${address}`;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez dans quelques minutes." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const body = payload as {
    items?: unknown;
    customer?: Partial<Customer>;
    country?: unknown;
    payment?: unknown;
  };

  const countryCode = body.country as CountryCode;
  if (!COUNTRIES[countryCode]) {
    return NextResponse.json({ error: "Pays de livraison invalide." }, { status: 400 });
  }
  const country = COUNTRIES[countryCode];

  const payment = body.payment as CryptoCode;
  if (!["BTC", "ETH", "SOL"].includes(payment)) {
    return NextResponse.json({ error: "Moyen de paiement invalide." }, { status: 400 });
  }

  if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 20) {
    return NextResponse.json({ error: "Panier invalide." }, { status: 400 });
  }

  const items: OrderItem[] = [];
  let subtotal = 0;

  for (const raw of body.items) {
    const entry = raw as { slug?: unknown; qty?: unknown };
    const product = getProduct(text(entry.slug, 80));
    if (!product) {
      return NextResponse.json({ error: "Un article du panier n'existe plus." }, { status: 400 });
    }
    const qty = Math.floor(Number(entry.qty));
    if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
      return NextResponse.json({ error: "Quantité invalide." }, { status: 400 });
    }
    if (qty > product.stock) {
      return NextResponse.json(
        { error: `Stock insuffisant pour ${product.name} (${product.stock} disponible).` },
        { status: 409 },
      );
    }
    const line = round2(product.price * qty);
    subtotal = round2(subtotal + line);
    items.push({ slug: product.slug, name: product.name, qty, unit: product.price, line });
  }

  const customer: Customer = {
    firstName: text(body.customer?.firstName, 60),
    lastName: text(body.customer?.lastName, 60),
    email: text(body.customer?.email, 120).toLowerCase(),
    phone: text(body.customer?.phone, 40),
    address: text(body.customer?.address, 160),
    address2: text(body.customer?.address2, 160),
    postalCode: text(body.customer?.postalCode, 20),
    city: text(body.customer?.city, 80),
    note: text(body.customer?.note, 600),
  };

  if (
    !customer.firstName ||
    !customer.lastName ||
    !customer.address ||
    !customer.postalCode ||
    !customer.city ||
    !customer.phone ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)
  ) {
    return NextResponse.json({ error: "Coordonnées incomplètes ou invalides." }, { status: 400 });
  }

  const shipping = round2(shippingFor(subtotal, country));
  const total = round2(subtotal + shipping);

  const rates = await getRates();
  const rate = rates.crypto[payment];
  const decimals = DECIMALS[payment];
  const amount = Math.ceil((total / rate) * 10 ** decimals) / 10 ** decimals;

  const wallet = WALLETS[payment]?.trim() || null;
  const id = `CS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const order: PlacedOrder = {
    id,
    createdAt: new Date().toISOString(),
    country: countryCode,
    customer,
    items,
    subtotal,
    shipping,
    total,
    payment: {
      currency: payment,
      amount,
      address: wallet,
      uri: wallet ? paymentUri(payment, wallet, amount) : null,
      rate,
    },
  };

  // Link to account (existing session or create one for guest)
  let accountToken: string | null = null;
  let accountHash = await getSessionAccountHash();
  if (!accountHash) {
    accountToken = randomToken(32);
    accountHash = hashToken(accountToken);
    await kvSet(`account:${accountHash}`, { createdAt: new Date().toISOString(), orders: [order.id] });
    const sessionId = await createAccountSession(accountHash);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_TTL,
      path: "/",
    });
  } else {
    const account = await kvGet<{ createdAt: string; orders: string[] }>(`account:${accountHash}`);
    const orders = account?.orders ?? [];
    if (!orders.includes(order.id)) orders.push(order.id);
    await kvSet(`account:${accountHash}`, { createdAt: account?.createdAt ?? new Date().toISOString(), orders });
  }

  await kvSet(`order:${order.id}`, { ...order, accountHash });
  await listPush("orders", order.id);
  await kvSet(`orderAccount:${order.id}`, accountHash);

  await Promise.allSettled([notifyOrder(order), saveOrder(order)]);

  return NextResponse.json({ order, accountToken });
}
