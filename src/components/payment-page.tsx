"use client";

import { useEffect, useState } from "react";
import { COUNTRIES } from "@/lib/currency";
import { formatMoney, formatCrypto } from "@/lib/format";
import type { PlacedOrder, CountryCode, CryptoCode } from "@/lib/types";
import { useShop } from "./shop-provider";

const NETWORKS = { BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana" } as const;

type PaymentInfo = {
  address: string;
  uri: string;
  amount: number;
  currency: CryptoCode;
  rate: number;
  expiresAt: string;
  status: "pending" | "paid" | "expired";
  txHash?: string;
};

export function PaymentPageClient({ orderId }: { orderId: string }) {
  const { rates, country, countryCode } = useShop();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [payment, setPayment] = useState<PaymentInfo | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState<"pending" | "paid" | "expired">("pending");

  async function load() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Commande introuvable");
      const data = await res.json();
      setOrder(data.order);
    } catch {
      setOrder(null);
    }
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, [orderId]);

  useEffect(() => {
    if (!order?.payment.uri) return;
    let active = true;
    import("qrcode")
      .then((module) => {
        const lib = module as unknown as {
          toDataURL?: (text: string, options: object) => Promise<string>;
          default?: { toDataURL?: (text: string, options: object) => Promise<string> };
        };
        const generate = lib.toDataURL ?? lib.default?.toDataURL;
        if (!generate) throw new Error("QR indisponible");
        return generate(order.payment.uri as string, {
          margin: 1,
          width: 280,
          color: { dark: "#111214", light: "#ffffff" },
        });
      })
      .then((url) => {
        if (active) setQr(url);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const update = () => {
      const now = Date.now();
      const expires = new Date(order.payment.expiresAt).getTime();
      const diff = Math.max(0, Math.ceil((expires - now) / 1000));
      setTimeLeft(diff);
      if (diff === 0 && order.payment.status === "pending") {
        setStatus("expired");
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    setPayment({
      address: order.payment.address ?? "",
      uri: order.payment.uri ?? "",
      amount: order.payment.amount,
      currency: order.payment.currency,
      rate: order.payment.rate,
      expiresAt: order.payment.expiresAt,
      status: order.payment.status,
      txHash: order.payment.txHash,
    });
    setStatus(order.payment.status);
  }, [order]);

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  async function refreshStatus() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      }
    } catch {
      // ignore
    }
  }

  if (!loaded) return <p className="muted">Chargement…</p>;

  if (!order) {
    return (
      <div className="empty-state">
        <h2>Commande introuvable</h2>
        <p>Cette commande n'existe pas ou a expiré.</p>
        <a href="/boutique" className="btn btn-primary">
          Retour à la boutique
        </a>
      </div>
    );
  }

  const orderCountry = COUNTRIES[order.country as CountryCode];
  const network = NETWORKS[order.payment.currency];
  const amountStr = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: order.payment.currency === "BTC" ? 8 : 6,
    maximumFractionDigits: order.payment.currency === "BTC" ? 8 : 6,
  }).format(order.payment.amount);

  const isPending = status === "pending";
  const isPaid = status === "paid";
  const isExpired = status === "expired";

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="confirmation">
      <div className="confirm-head">
        <p className="eyebrow">Paiement en {order.payment.currency}</p>
        <h1>{order.id}</h1>
        <p>Envoyez le montant exact ci-dessous pour valider votre commande.</p>
      </div>

      <div className="confirm-grid">
        <section className="pay-panel" style={{ position: "relative" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2>{network}</h2>
            {isPending && (
              <span className="hero-badge" style={{ background: "#fff3e0", color: "#e65100" }}>
                {formatTime(timeLeft)}
              </span>
            )}
            {isPaid && (
              <span className="hero-badge" style={{ background: "#e8f5e9", color: "#2e7d32" }}>
                ✅ Payé
              </span>
            )}
            {isExpired && (
              <span className="hero-badge" style={{ background: "#fbe9e7", color: "#c62828" }}>
                ❌ Expiré
              </span>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>
              Montant à payer
            </div>
            <div className="pay-amount" style={{ fontSize: 36 }}>
              {amountStr} <span style={{ fontSize: 16 }}>{order.payment.currency}</span>
            </div>
            <div className="pay-fiat">
              ≈ {formatMoney(order.total, orderCountry, rates)} · réseau {network}
            </div>
          </div>

          {payment?.address ? (
            <>
              <div className="copy-field" style={{ marginBottom: 16 }}>
                <span>Adresse {network} (usage unique)</span>
                <code style={{ wordBreak: "break-all" }}>{payment.address}</code>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => copy(payment.address as string, "address")}
                  style={{ marginTop: 8 }}
                >
                  {copied === "address" ? "✅ Copié" : "📋 Copier l'adresse"}
                </button>
              </div>

              <div className="copy-field" style={{ marginBottom: 16 }}>
                <span>Montant exact à envoyer</span>
                <code>{amountStr} {order.payment.currency}</code>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => copy(amountStr, "amount")}
                  style={{ marginTop: 8 }}
                >
                  {copied === "amount" ? "✅ Copié" : "📋 Copier le montant"}
                </button>
              </div>

              {qr && (
                <div className="qr" style={{ marginBottom: 20, textAlign: "center" }}>
                  <img
                    src={qr}
                    alt={`QR code de paiement ${order.payment.currency}`}
                    style={{ width: 220, height: 220, background: "#fff", padding: 10, borderRadius: 8, border: "1px solid var(--line)" }}
                  />
                  <p style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
                    Scannez avec votre portefeuille {network}
                  </p>
                </div>
              )}

              <div style={{ background: "#fff3e0", border: "1px solid #ffb74d", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, color: "#e65100" }}>
                  <strong>⚠️ Important :</strong> Envoyez <strong>uniquement</strong> {order.payment.currency} sur le
                  réseau {network}. Un autre réseau ou un montant insuffisant peut entraîner la perte des fonds.
                  Conservez votre référence <strong>{order.id}</strong>.
                </p>
              </div>

              {isPending && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={refreshStatus}
                  style={{ width: "100%", marginBottom: 12 }}
                >
                  🔄 Vérifier le paiement
                </button>
              )}

              {isPaid && (
                <div style={{ background: "#e8f5e9", border: "1px solid #4caf50", borderRadius: 8, padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#2e7d32" }}>
                    <strong>✅ Paiement confirmé !</strong> Votre commande est en cours de préparation. Le code Steam vous
                    sera transmis via le chat ci-dessous.
                  </p>
                </div>
              )}

              {isExpired && (
                <div style={{ background: "#fbe9e7", border: "1px solid #ef5350", borderRadius: 8, padding: 16 }}>
                  <p style={{ margin: 0, fontSize: 13, color: "#c62828" }}>
                    <strong>❌ Temps écoulé.</strong> Cette facture a expiré. Créez une nouvelle commande pour réessayer.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{ background: "#fff3e0", border: "1px solid #ffb74d", borderRadius: 8, padding: 16, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#e65100" }}>
                L'adresse de paiement n'est pas encore configurée. Contactez le support avec la référence{" "}
                <strong>{order.id}</strong>.
              </p>
            </div>
          )}

          <p className="pay-note">
            Le taux appliqué est celui affiché au moment de la création de la commande. La facture expire dans 60 minutes.
          </p>
        </section>

        <section className="order-panel">
          <h2>Détail de la commande</h2>
          <div className="checkout-lines">
            {order.items.map((item) => (
              <div key={item.slug}>
                <span>
                  {item.name} <span className="muted">× {item.qty}</span>
                </span>
                <span>{formatMoney(item.line, orderCountry, rates)}</span>
              </div>
            ))}
          </div>

          <div className="summary-rows">
            <div>
              <span>Sous-total</span>
              <span>{formatMoney(order.subtotal, orderCountry, rates)}</span>
            </div>
            <div>
              <span>Livraison</span>
              <span>{order.shipping === 0 ? "Offerte" : formatMoney(order.shipping, orderCountry, rates)}</span>
            </div>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatMoney(order.total, orderCountry, rates)}</strong>
          </div>

          <h3 style={{ marginTop: 20 }}>Livraison</h3>
          <address style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text)" }}>
            {order.customer.firstName} {order.customer.lastName}
            <br />
            {order.customer.address}
            {order.customer.address2 ? <><br />{order.customer.address2}</> : null}
            <br />
            {order.customer.postalCode} {order.customer.city}
            <br />
            {orderCountry.label}
          </address>

          <h3 style={{ marginTop: 16 }}>Contact</h3>
          <p className="order-contact">
            {order.customer.email || "—"}<br />
            {order.customer.phone || "—"}
          </p>

          {order.customer.note ? (
            <>
              <h3 style={{ marginTop: 16 }}>Note</h3>
              <p className="order-contact">{order.customer.note}</p>
            </>
          ) : null}

          {isPaid && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--line)" }}>
              <h3>💬 Chat avec le vendeur</h3>
              <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>
                Le paiement est confirmé. Utilisez ce chat pour recevoir votre code Steam.
              </p>
              <iframe
                src={`/chat-embed?orderId=${order.id}`}
                style={{ width: "100%", height: 350, border: "1px solid var(--line)", borderRadius: 8 }}
                title="Chat vendeur"
              />
            </div>
          )}
        </section>
      </div>

      <div className="confirm-actions">
        <a href="/boutique" className="btn btn-primary">
          Continuer mes achats
        </a>
      </div>
    </div>
  );
}