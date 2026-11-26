"use client";

import Link from "next/link";
import { COUNTRIES, COUNTRY_LIST, CRYPTO_CODES } from "@/lib/currency";
import { formatCrypto, formatMoney, shippingFor } from "@/lib/format";
import type { CountryCode } from "@/lib/types";
import { useShop } from "./shop-provider";
import { ProductMedia } from "./product-media";

export function CartView() {
  const {
    lines,
    ready,
    setQty,
    remove,
    subtotal,
    shipping,
    total,
    country,
    countryCode,
    setCountryCode,
    rates,
  } = useShop();

  if (!ready) {
    return <p className="muted">Chargement du panier…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <h2>Votre panier est vide.</h2>
        <p>Manettes, PC assemblés et trottinettes : tout le catalogue est disponible.</p>
        <Link href="/boutique" className="btn btn-primary">
          Voir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {lines.map((line) => (
          <div className="cart-line" key={line.slug}>
            <Link href={`/produit/${line.slug}`} className="cart-thumb" aria-label={line.product.name}>
              <ProductMedia src={line.product.image} name={line.product.name} brand={line.product.brand} />
            </Link>

            <div className="cart-line-info">
              <span className="product-meta">
                {line.product.brand} <span aria-hidden="true">/</span> {line.product.platform}
              </span>
              <Link href={`/produit/${line.slug}`} className="cart-line-name">
                {line.product.name}
              </Link>
              <p className="cart-line-stock">En stock</p>
              <p className="cart-line-ship">
                {shippingFor(line.line, country) === 0
                  ? "Livraison GRATUITE"
                  : `Livraison ${formatMoney(shippingFor(line.line, country), country, rates)}`}
              </p>
              <div className="cart-line-actions">
                <div className="qty">
                  <button
                    type="button"
                    onClick={() => setQty(line.slug, line.qty - 1)}
                    aria-label={`Diminuer la quantité de ${line.product.name}`}
                  >
                    −
                  </button>
                  <span>{line.qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(line.slug, line.qty + 1)}
                    aria-label={`Augmenter la quantité de ${line.product.name}`}
                  >
                    +
                  </button>
                </div>
                <button type="button" className="link-button" onClick={() => remove(line.slug)}>
                  Retirer
                </button>
              </div>
            </div>

            <div className="cart-line-price">{formatMoney(line.line, country, rates)}</div>
          </div>
        ))}

        <Link href="/boutique" className="text-link cart-continue">
          Continuer mes achats
        </Link>
      </div>

      <aside className="summary">
        <h2>Récapitulatif</h2>

        <label className="field">
          <span>Pays de livraison</span>
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

        <div className="summary-rows">
          <div>
            <span>Sous-total</span>
            <span>{formatMoney(subtotal, country, rates)}</span>
          </div>
          <div>
            <span>Livraison</span>
            <span>{shipping === 0 ? "Offerte" : formatMoney(shipping, country, rates)}</span>
          </div>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <strong>{formatMoney(total, country, rates)}</strong>
        </div>

        <div className="summary-crypto">
          <span className="summary-crypto-label">Équivalent crypto</span>
          {CRYPTO_CODES.map((code) => (
            <div key={code}>
              <span>{code}</span>
              <span>{formatCrypto(total, rates, code)}</span>
            </div>
          ))}
        </div>

        <Link href="/commande" className="btn btn-primary btn-wide">
          Passer commande
        </Link>
        <p className="summary-note">
          Paiement en Bitcoin, Ethereum ou Solana. Les frais de port sont offerts dès{" "}
          {formatMoney(COUNTRIES[countryCode].freeFrom, country, rates)}.
        </p>
      </aside>
    </div>
  );
}
