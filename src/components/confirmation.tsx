"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COUNTRIES } from "@/lib/currency";
import { formatMoney } from "@/lib/format";
import type { PlacedOrder } from "@/lib/types";
import { useShop } from "./shop-provider";
import { Chat } from "./chat";

const NETWORKS = { BTC: "Bitcoin", ETH: "Ethereum", SOL: "Solana" } as const;

export function Confirmation() {
  const { rates } = useShop();
  const [order, setOrder] = useState<PlacedOrder | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [accountToken, setAccountToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cryptshop:last-order");
      if (raw) setOrder(JSON.parse(raw) as PlacedOrder);
      const token = sessionStorage.getItem("cryptshop:last-account-token");
      if (token) setAccountToken(token);
    } catch {
      setOrder(null);
    }
    setLoaded(true);
  }, []);

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
          width: 220,
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

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  if (!loaded) return <p className="muted">Chargement…</p>;

  if (!order) {
    return (
      <div className="empty-state">
        <h2>Aucune commande récente.</h2>
        <p>Cette page affiche les instructions de paiement juste après la validation du panier.</p>
        <Link href="/boutique" className="btn btn-primary">
          Voir la boutique
        </Link>
      </div>
    );
  }

  const orderCountry = COUNTRIES[order.country];
  const amount = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(order.payment.amount);
  const network = NETWORKS[order.payment.currency];

  return (
    <div className="confirmation">
      <div className="confirm-head">
        <p className="eyebrow">Commande enregistrée</p>
        <h1>{order.id}</h1>
        <p>
          Merci {order.customer.firstName}. Votre commande est réservée. Envoyez le montant
          ci-dessous pour lancer la préparation.
        </p>
      </div>

      <div className="confirm-grid">
        <section className="pay-panel">
          <h2>Paiement {order.payment.currency}</h2>
          <p className="pay-amount">
            {amount} <span>{order.payment.currency}</span>
          </p>
          <p className="pay-fiat">
            soit {formatMoney(order.total, orderCountry, rates)} · réseau {network}
          </p>

          {order.payment.address ? (
            <>
              <div className="copy-field">
                <span>Adresse {network}</span>
                <code>{order.payment.address}</code>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => copy(order.payment.address as string, "address")}
                >
                  {copied === "address" ? "Copié" : "Copier"}
                </button>
              </div>

              <div className="copy-field">
                <span>Montant exact</span>
                <code>
                  {amount} {order.payment.currency}
                </code>
                <button
                  type="button"
                  className="copy-button"
                  onClick={() => copy(String(order.payment.amount), "amount")}
                >
                  {copied === "amount" ? "Copié" : "Copier"}
                </button>
              </div>

              {qr ? (
                <div className="qr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt={`QR code de paiement ${order.payment.currency}`} />
                  <span>Scannez avec votre portefeuille</span>
                </div>
              ) : null}

              <p className="pay-warning">
                Envoyez uniquement {order.payment.currency} sur le réseau {network}. Un autre réseau
                ou un montant insuffisant peut entraîner la perte des fonds. Conservez votre
                référence {order.id}.
              </p>
            </>
          ) : (
            <p className="pay-warning">
              L'adresse de paiement n'est pas encore configurée. Contactez-nous avec la référence{" "}
              {order.id} : nous vous envoyons l'adresse et le montant exact avant tout paiement.
            </p>
          )}

          <p className="pay-note">
            La commande est préparée dès réception du paiement. Le taux appliqué est celui affiché
            au moment de la validation.
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
              <span>
                {order.shipping === 0 ? "Offerte" : formatMoney(order.shipping, orderCountry, rates)}
              </span>
            </div>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>{formatMoney(order.total, orderCountry, rates)}</strong>
          </div>

          <h3>Livraison</h3>
          <address>
            {order.customer.firstName} {order.customer.lastName}
            <br />
            {order.customer.address}
            {order.customer.address2 ? (
              <>
                <br />
                {order.customer.address2}
              </>
            ) : null}
            <br />
            {order.customer.postalCode} {order.customer.city}
            <br />
            {orderCountry.label}
          </address>

          <h3>Contact</h3>
          <p className="order-contact">
            {order.customer.email}
            <br />
            {order.customer.phone}
          </p>

          {order.customer.note ? (
            <>
              <h3>Note</h3>
              <p className="order-contact">{order.customer.note}</p>
            </>
          ) : null}
        </section>
      </div>

      {accountToken ? (
        <section className="order-panel" style={{ marginTop: 20 }}>
          <h2>Votre compte sécurisé</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 10 }}>
            Conservez ce code : il vous permet d'accéder à vos commandes et au chat avec le vendeur.
            Aucun mot de passe n'est stocké.
          </p>
          <div className="copy-field">
            <span>Code d'accès</span>
            <code>{accountToken}</code>
            <button
              type="button"
              className="copy-button"
              onClick={() => copy(accountToken, "token")}
            >
              {copied === "token" ? "Copié" : "Copier"}
            </button>
          </div>
        </section>
      ) : null}

      {order ? <Chat orderId={order.id} /> : null}

      <div className="confirm-actions">
        <button type="button" className="btn btn-outline" onClick={() => window.print()}>
          Imprimer les instructions
        </button>
        <Link href="/boutique" className="btn btn-primary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
