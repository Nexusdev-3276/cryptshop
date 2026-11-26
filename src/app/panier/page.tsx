import type { Metadata } from "next";
import Link from "next/link";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Panier",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Panier</span>
      </nav>
      <header className="page-head">
        <p className="eyebrow">Panier</p>
        <h1>Votre panier</h1>
        <p>Vérifiez les articles et votre pays de livraison avant de commander.</p>
      </header>
      <CartView />
    </div>
  );
}
