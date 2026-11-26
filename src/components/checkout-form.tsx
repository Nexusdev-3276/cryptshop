"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { COUNTRY_LIST, CRYPTO_CODES } from "@/lib/currency";
import { formatCrypto, formatMoney } from "@/lib/format";
import type { CountryCode, CryptoCode } from "@/lib/types";
import { useShop } from "./shop-provider";

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  address2: "",
  postalCode: "",
  city: "",
  note: "",
};

const CRYPTO_NAMES: Record<CryptoCode, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  SOL: "Solana",
};

export function CheckoutForm() {
  const {
    lines,
    ready,
    subtotal,
    shipping,
    total,
    country,
    countryCode,
    setCountryCode,
    rates,
    clear,
  } = useShop();
  const router = useRouter();

  const [form, setForm] = useState(EMPTY);
  const [payment, setPayment] = useState<CryptoCode>("BTC");
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof typeof EMPTY) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!terms) {
      setError("Veuillez accepter les conditions de vente.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((line) => ({ slug: line.slug, qty: line.qty })),
          customer: form,
          country: countryCode,
          payment,
        }),
      });
      const data = (await response.json()) as { order?: unknown; error?: string };
      if (!response.ok || !data.order) {
        throw new Error(data.error || "La commande n'a pas pu être enregistrée.");
      }
      sessionStorage.setItem("cryptshop:last-order", JSON.stringify(data.order));
      clear();
      router.push("/commande/confirmation");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Une erreur est survenue.");
      setLoading(false);
    }
  }

  if (!ready) return <p className="muted">Chargement…</p>;

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <h2>Votre panier est vide.</h2>
        <p>Ajoutez au moins un produit avant de passer commande.</p>
        <Link href="/boutique" className="btn btn-primary">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <form className="checkout-layout" onSubmit={submit}>
      <div className="checkout-main">
        <section className="form-section">
          <h2>Coordonnées</h2>
          <div className="field-grid">
            <label className="field">
              <span>Prénom</span>
              <input value={form.firstName} onChange={update("firstName")} required autoComplete="given-name" maxLength={60} />
            </label>
            <label className="field">
              <span>Nom</span>
              <input value={form.lastName} onChange={update("lastName")} required autoComplete="family-name" maxLength={60} />
            </label>
            <label className="field">
              <span>E-mail</span>
              <input type="email" value={form.email} onChange={update("email")} required autoComplete="email" maxLength={120} />
            </label>
            <label className="field">
              <span>Téléphone</span>
              <input type="tel" value={form.phone} onChange={update("phone")} required autoComplete="tel" maxLength={40} />
            </label>
          </div>
        </section>

        <section className="form-section">
          <h2>Adresse de livraison</h2>
          <div className="field-grid">
            <label className="field field-full">
              <span>Adresse</span>
              <input value={form.address} onChange={update("address")} required autoComplete="street-address" maxLength={160} />
            </label>
            <label className="field field-full">
              <span>Complément (optionnel)</span>
              <input value={form.address2} onChange={update("address2")} autoComplete="address-line2" maxLength={160} />
            </label>
            <label className="field">
              <span>Code postal</span>
              <input value={form.postalCode} onChange={update("postalCode")} required autoComplete="postal-code" maxLength={20} />
            </label>
            <label className="field">
              <span>Ville</span>
              <input value={form.city} onChange={update("city")} required autoComplete="address-level2" maxLength={80} />
            </label>
            <label className="field field-full">
              <span>Pays</span>
              <select
                value={countryCode}
                onChange={(event) => setCountryCode(event.target.value as CountryCode)}
              >
                {COUNTRY_LIST.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="form-section">
          <h2>Paiement</h2>
          <p className="form-hint">
            Le montant en crypto est calculé au moment de la commande. Aucune donnée bancaire n'est
            demandée.
          </p>
          <div className="pay-options">
            {CRYPTO_CODES.map((code) => (
              <label key={code} className={payment === code ? "pay-option active" : "pay-option"}>
                <input
                  type="radio"
                  name="payment"
                  value={code}
                  checked={payment === code}
                  onChange={() => setPayment(code)}
                />
                <span className="pay-code">{code}</span>
                <span className="pay-text">
                  <strong>{CRYPTO_NAMES[code]}</strong>
                  <span>{formatCrypto(total, rates, code)}</span>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="form-section">
          <h2>Note</h2>
          <label className="field">
            <span>Instructions particulières (optionnel)</span>
            <textarea
              value={form.note}
              onChange={update("note")}
              rows={4}
              maxLength={600}
              placeholder="Étage, code d'accès, précisions sur la commande…"
            />
          </label>
        </section>
      </div>

      <aside className="summary checkout-summary">
        <h2>Votre commande</h2>
        <div className="checkout-lines">
          {lines.map((line) => (
            <div key={line.slug}>
              <span>
                {line.product.name} <span className="muted">× {line.qty}</span>
              </span>
              <span>{formatMoney(line.line, country, rates)}</span>
            </div>
          ))}
        </div>

        <div className="summary-rows">
          <div>
            <span>Sous-total</span>
            <span>{formatMoney(subtotal, country, rates)}</span>
          </div>
          <div>
            <span>Livraison · {country.label}</span>
            <span>{shipping === 0 ? "Offerte" : formatMoney(shipping, country, rates)}</span>
          </div>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <strong>{formatMoney(total, country, rates)}</strong>
        </div>

        <p className="summary-note">
          Soit {formatCrypto(total, rates, payment)} au taux actuel. Le taux est verrouillé au moment
          de la validation.
        </p>

        <label className="check-terms">
          <input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} />
          <span>
            J'accepte les <Link href="/cgv">conditions de vente</Link> et la{" "}
            <Link href="/confidentialite">politique de confidentialité</Link>.
          </span>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" className="btn btn-primary btn-wide" disabled={loading}>
          {loading ? "Enregistrement…" : "Valider la commande"}
        </button>
        <p className="summary-note">
          Les instructions de paiement s'affichent à l'étape suivante. Conservez la référence de
          commande.
        </p>
      </aside>
    </form>
  );
}
