import type { PlacedOrder } from "./types";

function orderText(order: PlacedOrder): string {
  const c = order.customer;
  const lines = [
    `NOUVELLE COMMANDE — ${order.id}`,
    new Date(order.createdAt).toLocaleString("fr-BE", { timeZone: "Europe/Brussels" }),
    "",
    "CLIENT",
    `${c.firstName} ${c.lastName}`,
    c.email || "—",
    c.phone || "—",
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
    `Adresse : ${order.payment.address ?? "NON CONFIGURÉE"}`,
    `Statut : ${order.payment.status ?? "pending"}`,
  ];

  if (c.note) {
    lines.push("", `Note : ${c.note}`);
  }

  return lines.filter((line) => line !== "").join("\n");
}

function orderEmbed(order: PlacedOrder) {
  const c = order.customer;
  const status = order.payment.status ?? "pending";
  const statusColor = status === "paid" ? 0x00ff00 : status === "expired" ? 0xff0000 : 0xffaa00;
  const statusLabel = status === "paid" ? "✅ Payé" : status === "expired" ? "❌ Expiré" : "⏳ En attente";

  return {
    title: `🛒 Nouvelle commande — ${order.id}`,
    color: statusColor,
    timestamp: new Date(order.createdAt).toISOString(),
    fields: [
      { name: "👤 Client", value: `${c.firstName} ${c.lastName}\n${c.email || "—"}\n${c.phone || "—"}`, inline: true },
      { name: "📦 Livraison", value: `${c.address}${c.address2 ? "\n" + c.address2 : ""}\n${c.postalCode} ${c.city}\n${order.country}`, inline: true },
      { name: "💰 Montants", value: `${order.subtotal.toFixed(2)} EUR (sous-total)\n${order.shipping.toFixed(2)} EUR (livraison)\n**${order.total.toFixed(2)} EUR (TOTAL)**`, inline: true },
      { name: "₿ Paiement", value: `${order.payment.amount} ${order.payment.currency}\nTaux: 1 ${order.payment.currency} = ${order.payment.rate.toFixed(2)} EUR\nAdresse: \`${order.payment.address ?? "NON CONFIGURÉE"}\``, inline: true },
      { name: "📋 Articles", value: order.items.map((item) => `${item.qty} × ${item.name} — ${item.line.toFixed(2)} EUR`).join("\n"), inline: false },
      { name: "🔄 Statut", value: statusLabel, inline: true },
    ],
    footer: { text: "Cryptshop" },
  };
}

export async function notifyOrder(order: PlacedOrder): Promise<void> {
  const text = orderText(order);
  const embed = orderEmbed(order);
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
        body: JSON.stringify({ embeds: [embed] }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  await Promise.allSettled(tasks);
}

export async function notifyPaymentConfirmed(order: PlacedOrder): Promise<void> {
  const embed = orderEmbed(order);
  const discord = process.env.DISCORD_WEBHOOK_URL;
  if (discord) {
    await fetch(discord, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
      signal: AbortSignal.timeout(8000),
    });
  }
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