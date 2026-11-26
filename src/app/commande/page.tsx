import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        <span aria-hidden="true">›</span>
        <Link href="/panier">Panier</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Commande</span>
      </nav>
      <header className="page-head">
        <p className="eyebrow">Commande</p>
        <h1>Finaliser la commande</h1>
        <p>Coordonnées, adresse de livraison et choix de la crypto. Aucun compte requis.</p>
      </header>
      <CheckoutForm />
    </div>
  );
}
