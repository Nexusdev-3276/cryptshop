import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Une question sur une commande, un produit ou une livraison ? Écrivez-nous.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Contact</p>
        <h1>Nous écrire</h1>
        <p>
          Commande, produit, livraison ou paiement : indiquez votre référence de commande si vous en
          avez une. Réponse sous 24 h ouvrées.
        </p>
      </header>

      <div className="contact-layout">
        <ContactForm />

        <aside className="contact-aside">
          <h2>E-mail</h2>
          <a href={`mailto:${SITE.email}`} className="contact-email">
            {SITE.email}
          </a>
          <p>Réponse sous 24 h ouvrées, du lundi au vendredi.</p>

          <h2>Expédition</h2>
          <p>
            Les commandes partent de Belgique vers la France, la Belgique, la Suisse et le Canada.
          </p>

          <h2>Avant d'écrire</h2>
          <p>
            Les frais et délais de livraison sont détaillés sur la page Livraison. Les questions sur
            le paiement crypto sont traitées sur la page Paiement.
          </p>
        </aside>
      </div>
    </div>
  );
}
