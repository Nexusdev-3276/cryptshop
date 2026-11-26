"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { useShop } from "./shop-provider";

export function ProductPurchase({ product }: { product: Product }) {
  const { add } = useShop();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const max = Math.max(1, Math.min(10, product.stock));

  function addToCart() {
    add(product.slug, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function buyNow() {
    add(product.slug, qty);
    router.push("/commande");
  }

  return (
    <div className="purchase">
      <div className="purchase-row">
        <div className="qty" aria-label="Quantité">
          <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Diminuer la quantité">
            −
          </button>
          <span>{qty}</span>
          <button type="button" onClick={() => setQty(Math.min(max, qty + 1))} aria-label="Augmenter la quantité">
            +
          </button>
        </div>
        <button type="button" className="btn btn-primary" onClick={addToCart} disabled={product.stock === 0}>
          Ajouter au panier
        </button>
      </div>
      <button type="button" className="btn btn-outline btn-wide" onClick={buyNow} disabled={product.stock === 0}>
        Commander maintenant
      </button>
      <p className={added ? "added-note visible" : "added-note"} aria-live="polite">
        {added ? "Ajouté au panier." : ""}
      </p>
    </div>
  );
}
