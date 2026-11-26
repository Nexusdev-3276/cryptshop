import Link from "next/link";
import { Faq } from "@/components/faq";
import { Price } from "@/components/price";
import { ProductCard } from "@/components/product-card";
import { getFeatured, getProduct, products } from "@/lib/products";

const TRUST = [
  {
    title: "Neuf, jamais utilisé",
    text: "Emballage d'origine et facture fournie.",
  },
  {
    title: "Paiement crypto",
    text: "Bitcoin, Ethereum ou Solana. Pas de données bancaires.",
  },
  {
    title: "Livraison suivie",
    text: "France, Belgique, Suisse et Canada.",
  },
  {
    title: "Garantie 2 ans",
    text: "Pièces et main-d'œuvre. Support par e-mail.",
  },
];

export default function HomePage() {
  const featured = getFeatured().filter((product) => product.category !== "pc").slice(0, 4);
  const pcs = products.filter((product) => product.category === "pc");
  const vega = getProduct("pc-vega") ?? pcs[0];

  return (
    <>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">Manettes · PC assemblés · Mobilité</p>
          <h1>
            Le matériel de jeu,
            <br />
            payé en crypto.
          </h1>
          <p className="hero-lead">
            Manettes PS5 et Xbox, PC montés à la main, trottinettes électriques. Du matériel neuf,
            expédié depuis la Belgique vers la France, la Suisse et le Canada. Paiement en Bitcoin,
            Ethereum ou Solana.
          </p>
          <div className="hero-actions">
            <Link href="/boutique" className="btn btn-primary">
              Voir la boutique
            </Link>
            <Link href="/boutique?categorie=pc" className="btn btn-outline">
              Les PC assemblés
            </Link>
          </div>
          <ul className="hero-points">
            <li>Neuf et scellé</li>
            <li>Facture fournie</li>
            <li>Garantie 2 ans</li>
          </ul>
        </div>

        {vega ? (
          <aside className="hero-card">
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
              <Link href={`/produit/${vega.slug}`} className="btn btn-light">
                Voir la fiche
              </Link>
            </div>
          </aside>
        ) : null}
      </section>

      <section className="trust">
        <div className="container trust-grid">
          {TRUST.map((item) => (
            <div key={item.title}>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section container">
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

      <section className="pc-section">
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
                  <Link href={`/produit/${pc.slug}`} className="btn btn-light">
                    Voir la configuration
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="pc-note">
            Chaque machine est montée, câblée et testée avant expédition. Garantie 2 ans pièces et
            main-d'œuvre.
          </p>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <div>
            <p className="eyebrow">Commande</p>
            <h2>Trois étapes, pas plus.</h2>
          </div>
        </div>
        <div className="steps">
          <div>
            <span className="step-num">01</span>
            <h3>Choisissez</h3>
            <p>Ajoutez vos produits au panier et indiquez votre pays de livraison.</p>
          </div>
          <div>
            <span className="step-num">02</span>
            <h3>Payez en crypto</h3>
            <p>BTC, ETH ou SOL. Le montant est calculé au moment de la commande.</p>
          </div>
          <div>
            <span className="step-num">03</span>
            <h3>Recevez</h3>
            <p>Expédition suivie sous 2 à 9 jours ouvrés selon la destination.</p>
          </div>
        </div>
      </section>

      <section className="section container">
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
