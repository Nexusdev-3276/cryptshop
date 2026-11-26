import type { PlacedOrder } from "./types";

/**
 * Historique facultatif des commandes sur Upstash Redis (offre gratuite).
 * Le site fonctionne sans : la notification Telegram reste la source principale.
 */
export async function saveOrder(order: PlacedOrder): Promise<void> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return;

  try {
    await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["LPUSH", "cryptshop:orders", JSON.stringify(order)],
        ["LTRIM", "cryptshop:orders", "0", "499"],
      ]),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // L'historique ne doit jamais bloquer une commande.
  }
}
