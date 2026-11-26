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
    .slice(0, 4);

  return (
    <div className="container page product-page">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        <span aria-hidden="true">›</span>
        <Link href="/boutique">Boutique</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="product-layout">
        <div className="product-visual">
          <ProductMedia src={product.image} name={product.name} brand={product.brand} />
          <p className="product-visual-note">
            Produit neuf, dans son emballage d&apos;origine. Photos non contractuelles.
          </p>
        </div>

        <div className="product-info">
          <p className="product-brand">
            Marque : <strong>{product.brand}</strong>
          </p>
          <h1>{product.name}</h1>
          <p className="product-lead">{product.tagline}</p>

          <div className="product-badges">
            <span>Neuf</span>
            <span>Emballage d&apos;origine</span>
            <span>Facture fournie</span>
            <span>Garantie 2 ans</span>
          </div>

          <hr className="rule" />

          <div className="product-price-block">
            <Price eur={product.price} crypto={false} size="lg" />
            <span className="price-tax">TTC</span>
          </div>

          <CryptoPrices eur={product.price} />
          <p className="crypto-note">Montants indicatifs, recalculés au moment du paiement.</p>

          {product.category === "cartes" ? (
            <div className="product-details-inline">
              <h2>Choisir un montant</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { slug: "steam-card-20", label: "20 €" },
                  { slug: "steam-card-50", label: "50 €" },
                  { slug: "steam-card-100", label: "100 €" },
                ].map((item) => (
                  <Link
                    key={item.slug}
                    href={`/produit/${item.slug}`}
                    className={product.slug === item.slug ? "chip active" : "chip"}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          <div className="product-details-inline">
            <h2>À propos de cet article</h2>
            <ul className="bullet-list">
              {product.specs.slice(0, 5).map((spec) => (
                <li key={spec.label}>
                  <strong>{spec.label} :</strong> {spec.value}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="buybox">
          <Price eur={product.price} size="lg" />
          <p className={product.stock > 0 ? "buybox-stock" : "stock"}>
            {product.stock > 0
              ? `En stock — ${product.stock} disponible${product.stock > 1 ? "s" : ""}`
              : "Sur commande"}
          </p>
          <DeliveryEstimate price={product.price} />
          <ProductPurchase product={product} />
          <ul className="buybox-points">
            <li>Paiement en Bitcoin, Ethereum ou Solana</li>
            <li>Facture et garantie 2 ans</li>
            <li>Expédition suivie depuis la Belgique</li>
          </ul>
        </aside>
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
