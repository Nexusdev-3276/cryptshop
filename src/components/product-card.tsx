import Link from "next/link";
import type { Product } from "@/lib/types";
import { Price } from "./price";
import { ProductMedia } from "./product-media";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/produit/${product.slug}`} className="product-card">
      <ProductMedia src={product.image} name={product.name} brand={product.brand} />
      <div className="product-body">
        <span className="product-meta">
          {product.brand} <span aria-hidden="true">/</span> {product.platform}
        </span>
        <h3>{product.name}</h3>
        <p className="product-tagline">{product.tagline}</p>
        <div className="product-foot">
          <Price eur={product.price} />
          <span className={product.stock > 0 ? "stock stock-ok" : "stock"}>
            {product.stock > 0 ? "En stock" : "Sur commande"}
          </span>
        </div>
      </div>
    </Link>
  );
}
