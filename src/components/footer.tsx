import Link from "next/link";
import { SITE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <span className="brand brand-light">
            <span className="brand-mark">C</span>
            Cryptshop
          </span>
          <p>
            Manettes, PC assemblés et mobilité électrique. Matériel neuf, facture fournie,
            livraison en France, Belgique, Suisse et Canada.
          </p>
          <div className="pay-chips" aria-label="Moyens de paiement acceptés">
            <span>BTC</span>
            <span>ETH</span>
            <span>SOL</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Boutique</h4>
          <Link href="/boutique?categorie=manettes">Manettes</Link>
          <Link href="/boutique?categorie=pc">PC assemblés</Link>
          <Link href="/boutique?categorie=scooters">Trottinettes</Link>
          <Link href="/boutique">Tout le catalogue</Link>
        </div>

        <div className="footer-col">
          <h4>Informations</h4>
          <Link href="/livraison">Livraison et retours</Link>
          <Link href="/paiement">Paiement crypto</Link>
          <Link href="/cgv">Conditions de vente</Link>
          <Link href="/contact">Contact</Link>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <p>Réponse sous 24 h ouvrées.</p>
          <p>Expédition depuis la Belgique.</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Cryptshop. Prix TTC, hors frais de douane.</span>
        <div>
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/cgv">CGV</Link>
        </div>
      </div>
    </footer>
  );
}
