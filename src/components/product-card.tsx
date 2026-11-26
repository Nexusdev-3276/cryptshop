"use client";

import Link from "next/link";
import { formatMoney, shippingFor } from "@/lib/format";
import type { Product } from "@/lib/types";
import { Price } from "./price";
import { ProductMedia } from "./product-media";
import { useShop } from "./shop-provider";

export function ProductCard({ product }: { product: Product }) {
  const { add, country, rates } = useShop();
  const shipping = shippingFor(product.price, country);

  return (
    <article className="product-card">
      <Link href={`/produit/${product.slug}`} className="product-media-link" aria-label={product.name}>
        <ProductMedia src={product.image} name={product.name} brand={product.brand} />
      </Link>
      <div className="product-body">
        <span className="product-meta">{product.brand}</span>
        <Link href={`/produit/${product.slug}`} className="product-title">
          <h3>{product.name}</h3>
        </Link>
        <p className="product-tagline">{product.tagline}</p>
        <Price eur={product.price} />
        <p className="ship-line">
          {shipping === 0 ? (
            <>
              Livraison <strong>GRATUITE</strong>
            </>
          ) : (
            <>
              Livraison <strong>{formatMoney(shipping, country, rates)}</strong>
            </>
          )}
        </p>
        <span className={product.stock > 0 ? "stock stock-ok" : "stock"}>
          {product.stock > 0 ? "En stock" : "Sur commande"}
        </span>
        <button
          type="button"
          className="btn-add"
          onClick={() => add(product.slug)}
          disabled={product.stock === 0}
        >
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
