import type { Metadata } from "next";
import Link from "next/link";
import { Confirmation } from "@/components/confirmation";

export const metadata: Metadata = {
  title: "Instructions de paiement",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <div className="container page">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Instructions de paiement</span>
      </nav>
      <Confirmation />
    </div>
  );
}
