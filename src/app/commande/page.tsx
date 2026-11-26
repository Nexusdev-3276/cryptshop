import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Commande",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Commande</p>
        <h1>Finaliser la commande</h1>
        <p>Coordonnées, adresse de livraison et choix de la crypto. Aucun compte requis.</p>
      </header>
      <CheckoutForm />
    </div>
  );
}
