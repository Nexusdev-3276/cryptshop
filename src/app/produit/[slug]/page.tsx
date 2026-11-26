import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CryptoPrices } from "@/components/crypto-prices";
import { DeliveryEstimate } from "@/components/delivery-estimate";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-media";
import { ProductPurchase } from "@/components/product-purchase";
import { getProduct, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`.slice(0, 158),
    alternates: { canonical: `/produit/${product.slug}` },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        <span aria-hidden="true">/</span>
        <Link href="/boutique">Boutique</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product-layout">
        <div className="product-visual">
          <ProductMedia src={product.image} name={product.name} brand={product.brand} />
          <p className="product-visual-note">
            Produit neuf, dans son emballage d'origine. Photos non contractuelles.
          </p>
        </div>

        <div className="product-info">
          <p className="eyebrow">
            {product.brand} — {product.platform}
          </p>
          <h1>{product.name}</h1>
          <p className="product-lead">{product.tagline}</p>

          <div className="product-price-block">
            <Price eur={product.price} crypto={false} size="lg" />
            <span className={product.stock > 0 ? "stock stock-ok" : "stock"}>
              {product.stock > 0 ? `En stock — ${product.stock} disponible${product.stock > 1 ? "s" : ""}` : "Sur commande"}
            </span>
          </div>

          <CryptoPrices eur={product.price} />
          <p className="crypto-note">Montants indicatifs, recalculés au moment du paiement.</p>

          <ProductPurchase product={product} />
          <DeliveryEstimate price={product.price} />

          <ul className="assurance-list">
            <li>Garantie 2 ans, facture fournie</li>
            <li>Paiement en Bitcoin, Ethereum ou Solana</li>
            <li>Expédition depuis la Belgique avec suivi</li>
          </ul>
        </div>
      </div>

      <div className="product-details">
        <section>
          <h2>Description</h2>
          <p>{product.description}</p>
          {product.note ? <p className="callout">{product.note}</p> : null}
        </section>

        <section>
          <h2>Caractéristiques</h2>
          <dl className="spec-list">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {related.length > 0 ? (
        <section className="section">
          <div className="section-head">
            <div>
              <p className="eyebrow">À voir aussi</p>
              <h2>Dans la même catégorie</h2>
            </div>
            <Link href="/boutique" className="text-link">
              Tout le catalogue
            </Link>
          </div>
          <div className="grid product-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
