import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Panier",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Panier</p>
        <h1>Votre panier</h1>
        <p>Vérifiez les articles et votre pays de livraison avant de commander.</p>
      </header>
      <CartView />
    </div>
  );
}
