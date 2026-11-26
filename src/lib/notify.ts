import type { PlacedOrder } from "./types";

function orderText(order: PlacedOrder): string {
  const c = order.customer;
  const lines = [
    `NOUVELLE COMMANDE — ${order.id}`,
    new Date(order.createdAt).toLocaleString("fr-BE", { timeZone: "Europe/Brussels" }),
    "",
    "CLIENT",
    `${c.firstName} ${c.lastName}`,
    c.email,
    c.phone,
    "",
    `LIVRAISON — ${order.country}`,
    c.address,
    c.address2 ? c.address2 : "",
    `${c.postalCode} ${c.city}`,
    "",
    "ARTICLES",
    ...order.items.map((item) => `${item.qty} × ${item.name} — ${item.line.toFixed(2)} EUR`),
    "",
    `Sous-total : ${order.subtotal.toFixed(2)} EUR`,
    `Livraison : ${order.shipping.toFixed(2)} EUR`,
    `TOTAL : ${order.total.toFixed(2)} EUR`,
    "",
    `Paiement : ${order.payment.amount} ${order.payment.currency}`,
    `Taux : 1 ${order.payment.currency} = ${order.payment.rate.toFixed(2)} EUR`,
    `Adresse : ${order.payment.address ?? "NON CONFIGURÉE — contacter le client"}`,
  ];

  if (c.note) {
    lines.push("", `Note : ${c.note}`);
  }

  return lines.filter((line) => line !== "").join("\n");
}

export async function notifyOrder(order: PlacedOrder): Promise<void> {
  const text = orderText(order);
  const tasks: Promise<unknown>[] = [];

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    tasks.push(
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (discord) {
    tasks.push(
      fetch(discord, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.slice(0, 1900) }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  await Promise.allSettled(tasks);
}

export async function notifyMessage(name: string, email: string, message: string): Promise<void> {
  const text = [
    "NOUVEAU MESSAGE — formulaire de contact",
    "",
    `Nom : ${name}`,
    `E-mail : ${email}`,
    "",
    message,
  ].join("\n");

  const tasks: Promise<unknown>[] = [];
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    tasks.push(
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (discord) {
    tasks.push(
      fetch(discord, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text.slice(0, 1900) }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  await Promise.allSettled(tasks);
}
