import Link from "next/link";
import { Faq } from "@/components/faq";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-media";
import { getFeatured, getProduct, products } from "@/lib/products";

const manettes = products.filter((product) => product.category === "manettes").slice(0, 4);
const pcs = products.filter((product) => product.category === "pc");
const scooter = products.find((product) => product.category === "scooters");
const vega = getProduct("pc-vega") ?? pcs[0];
const featured = products.filter((product) => product.category !== "pc");

export default function HomePage() {
  return (
    <>
      <section className="hero-banner">
        <div className="container hero-banner-inner">
          <div className="hero-banner-copy">
            <p className="hero-kicker">Cryptshop · Paiement crypto</p>
            <h1>
              Le matériel de jeu,
              <br />
              payé en crypto.
            </h1>
            <p>
              Manettes PS5 et Xbox, PC montés à la main, trottinettes électriques. Du matériel neuf,
              expédié depuis la Belgique vers la France, la Suisse et le Canada. Paiement en Bitcoin,
              Ethereum ou Solana.
            </p>
            <div className="hero-actions">
              <Link href="/boutique" className="btn btn-primary btn-lg">
                Découvrir la boutique
              </Link>
              <Link href="/boutique?categorie=pc" className="btn btn-ghost btn-lg">
                Les PC assemblés
              </Link>
            </div>
            <div className="hero-chips">
              <span>BTC · ETH · SOL</span>
              <span>Livraison FR · BE · CH · CA</span>
              <span>Neuf et scellé</span>
            </div>
          </div>

          {vega ? (
            <aside className="hero-banner-card">
              <div className="hero-card-top">
                <span className="mono">Configuration 01</span>
                <span className="hero-badge">En stock</span>
              </div>
              <h2>{vega.name}</h2>
              <p className="hero-card-sub">Ryzen 5 7500X3D · RX 9070 XT 16 Go</p>
              <dl className="hero-specs">
                {vega.highlights?.map((spec) => (
                  <div key={spec.label}>
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="hero-card-foot">
                <Price eur={vega.price} size="lg" />
                <Link href={`/produit/${vega.slug}`} className="btn btn-primary">
                  Voir la fiche
                </Link>
              </div>
            </aside>
          ) : null}
        </div>
      </section>

      <div className="container home-cards">
        <section className="home-card">
          <h2>Manettes</h2>
          <div className="mini-grid">
            {manettes.map((product) => (
              <Link key={product.slug} href={`/produit/${product.slug}`} className="mini-tile">
                <ProductMedia src={product.image} name={product.name} brand={product.brand} />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
          <Link href="/boutique?categorie=manettes" className="home-card-link">
            Voir plus
          </Link>
        </section>

        <section className="home-card">
          <h2>PC assemblés</h2>
          <div className="mini-grid">
            {pcs.map((product) => (
              <Link key={product.slug} href={`/produit/${product.slug}`} className="mini-tile">
                <ProductMedia src={product.image} name={product.name} brand={product.brand} />
                <span>{product.name}</span>
              </Link>
            ))}
          </div>
          <Link href="/boutique?categorie=pc" className="home-card-link">
            Voir plus
          </Link>
        </section>

        <section className="home-card">
          <h2>Mobilité</h2>
          <div className="mini-grid">
            {scooter ? (
              <Link href={`/produit/${scooter.slug}`} className="mini-tile">
                <ProductMedia src={scooter.image} name={scooter.name} brand={scooter.brand} />
                <span>{scooter.name}</span>
              </Link>
            ) : null}
          </div>
          <p className="product-tagline" style={{ marginTop: 10 }}>
            Trottinette électrique 1 000 W, jusqu&apos;à 80 km d&apos;autonomie.
          </p>
          <Link href="/boutique?categorie=scooters" className="home-card-link">
            Voir plus
          </Link>
        </section>

        <section className="home-card">
          <h2>Paiement crypto</h2>
          <div className="crypto-mini">
            <div className="crypto-mini-row">
              <strong>Bitcoin</strong>
              <span>BTC · réseau Bitcoin</span>
            </div>
            <div className="crypto-mini-row">
              <strong>Ethereum</strong>
              <span>ETH · réseau ERC-20</span>
            </div>
            <div className="crypto-mini-row">
              <strong>Solana</strong>
              <span>SOL · réseau Solana</span>
            </div>
          </div>
          <Link href="/paiement" className="home-card-link">
            En savoir plus
          </Link>
        </section>
      </div>

      <section className="home-section container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Sélection</p>
            <h2>Les essentiels</h2>
          </div>
          <Link href="/boutique" className="text-link">
            Tout le catalogue
          </Link>
        </div>
        <div className="grid product-grid">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="pc-band">
        <div className="container">
          <div className="section-head section-head-light">
            <div>
              <p className="eyebrow">Assemblés à la commande</p>
              <h2>Deux configurations, deux caractères.</h2>
            </div>
            <p className="section-note">
              Composants neufs, câblage soigné, tests de stabilité avant expédition.
            </p>
          </div>

          <div className="pc-grid">
            {pcs.map((pc, index) => (
              <article className="pc-card" key={pc.slug}>
                <div className="pc-top">
                  <span className="pc-index">0{index + 1}</span>
                  <div>
                    <h3>{pc.name}</h3>
                    <p>{pc.tagline}</p>
                  </div>
                </div>
                <dl className="pc-specs">
                  {pc.highlights?.map((spec) => (
                    <div key={spec.label}>
                      <dt>{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="pc-foot">
                  <Price eur={pc.price} size="lg" />
                  <Link href={`/produit/${pc.slug}`} className="btn btn-primary">
                    Voir la configuration
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="pc-note">
            Chaque machine est montée, câblée et testée avant expédition. Garantie 2 ans pièces et
            main-d&apos;œuvre.
          </p>
        </div>
      </section>

      <section className="home-section container">
        <div className="info-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Commande</p>
              <h2>Trois étapes, pas plus.</h2>
            </div>
          </div>
          <div className="steps">
            <div>
              <span className="step-num">1</span>
              <h3>Choisissez</h3>
              <p>Ajoutez vos produits au panier et indiquez votre pays de livraison.</p>
            </div>
            <div>
              <span className="step-num">2</span>
              <h3>Payez en crypto</h3>
              <p>BTC, ETH ou SOL. Le montant est calculé au moment de la commande.</p>
            </div>
            <div>
              <span className="step-num">3</span>
              <h3>Recevez</h3>
              <p>Expédition suivie sous 2 à 9 jours ouvrés selon la destination.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section container">
        <div className="info-card">
          <div className="section-head">
            <div>
              <p className="eyebrow">Questions fréquentes</p>
              <h2>Avant de commander</h2>
            </div>
            <Link href="/contact" className="text-link">
              Nous écrire
            </Link>
          </div>
          <Faq />
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-inner">
          <div>
            <h2>Une question sur une configuration ?</h2>
            <p>Réponse sous 24 h ouvrées, par e-mail.</p>
          </div>
          <Link href="/contact" className="btn btn-light">
            Contacter Cryptshop
          </Link>
        </div>
      </section>
    </>
  );
}
