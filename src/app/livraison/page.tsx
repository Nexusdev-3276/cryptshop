import type { Metadata } from "next";
import Link from "next/link";
import { ShippingTable } from "@/components/shipping-table";

export const metadata: Metadata = {
  title: "Livraison et retours",
  description:
    "Frais et délais de livraison en France, Belgique, Suisse et Canada. Expédition suivie depuis la Belgique.",
  alternates: { canonical: "/livraison" },
};

export default function ShippingPage() {
  return (
    <div className="container page prose-page">
      <header className="page-head">
        <p className="eyebrow">Livraison</p>
        <h1>Livraison et retours</h1>
        <p>
          Expédition depuis la Belgique vers la France, la Belgique, la Suisse et le Canada. Toutes
          les expéditions sont suivies.
        </p>
      </header>

      <ShippingTable />

      <div className="prose">
        <h2>Préparation des commandes</h2>
        <p>
          Les manettes et accessoires sont expédiés sous 1 à 2 jours ouvrés. Les PC sont assemblés,
          câblés et testés à la commande : comptez 3 à 5 jours ouvrés avant expédition. Les
          trottinettes partent sous 2 à 3 jours ouvrés.
        </p>

        <h2>Suivi</h2>
        <p>
          Un numéro de suivi est envoyé par e-mail dès la remise au transporteur. Les délais indiqués
          sont ceux communiqués par le transporteur et peuvent varier en période de forte activité.
        </p>

        <h2>Suisse et Canada</h2>
        <p>
          Les envois hors Union européenne peuvent être soumis aux taxes et droits d'importation
          locaux. Ces montants sont à la charge du destinataire et ne sont pas inclus dans le prix
          affiché.
        </p>

        <h2>Retours</h2>
        <p>
          Vous disposez de 14 jours à compter de la réception pour exercer votre droit de
          rétractation, conformément à la législation européenne. Le produit doit être retourné
          complet, non utilisé et dans son emballage d'origine. Les frais de retour sont à votre
          charge. Les produits personnalisés et les PC configurés sur mesure en sont exclus.
        </p>
        <p>
          Pour lancer un retour, écrivez-nous depuis la page <Link href="/contact">Contact</Link> avec
          votre référence de commande.
        </p>

        <h2>Garantie</h2>
        <p>
          Tous les produits bénéficient d'une garantie de 2 ans. Les défauts couverts sont pris en
          charge (réparation, remplacement ou remboursement). L'usure normale, les dommages liés à
          une mauvaise utilisation ou à un montage non conforme ne sont pas couverts.
        </p>
      </div>
    </div>
  );
}
