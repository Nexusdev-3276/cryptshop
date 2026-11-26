import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions de vente",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="container page prose-page">
      <header className="page-head">
        <p className="eyebrow">Conditions</p>
        <h1>Conditions générales de vente</h1>
        <p>Applicables aux commandes passées sur cryptshop.</p>
      </header>

      <div className="prose">
        <h2>1. Objet</h2>
        <p>
          Les présentes conditions régissent la vente de manettes, accessoires, PC assemblés et
          trottinettes électriques aux clients particuliers résidant en France, Belgique, Suisse et
          Canada.
        </p>

        <h2>2. Produits et prix</h2>
        <p>
          Les produits proposés sont neufs, jamais utilisés, dans leur emballage d'origine. Les prix
          sont affichés en euros, toutes taxes comprises pour l'Union européenne, hors frais de
          port. Les frais de port sont indiqués avant validation de la commande.
        </p>
        <p>
          L'équivalent en crypto est calculé au moment de la commande à partir du taux de marché
          affiché. Ce montant est celui à envoyer.
        </p>

        <h2>3. Commande</h2>
        <p>
          La commande est enregistrée après validation du formulaire. Elle devient effective après
          réception du paiement en crypto. Une confirmation contenant la référence de commande est
          affichée à l'écran.
        </p>

        <h2>4. Paiement</h2>
        <p>
          Le paiement s'effectue exclusivement en Bitcoin, Ethereum ou Solana. Les paiements crypto
          sont définitifs et irréversibles. Les frais de réseau sont à la charge du client. En cas de
          montant insuffisant ou de mauvais réseau, la commande ne peut pas être traitée.
        </p>

        <h2>5. Livraison</h2>
        <p>
          Les délais et frais sont indiqués sur la page <Link href="/livraison">Livraison</Link>. Les
          commandes sont expédiées avec suivi. Pour la Suisse et le Canada, les taxes et droits
          d'importation sont à la charge du destinataire.
        </p>

        <h2>6. Rétractation et retours</h2>
        <p>
          Conformément au droit européen, le client dispose de 14 jours à compter de la réception
          pour exercer son droit de rétractation, sans justification. Le produit doit être retourné
          complet, non utilisé, dans son emballage d'origine. Les frais de retour sont à la charge du
          client. Les produits personnalisés sont exclus.
        </p>
        <p>
          Les remboursements sont effectués en euros par virement, dans un délai de 14 jours après
          réception du retour.
        </p>

        <h2>7. Garantie</h2>
        <p>
          Les produits bénéficient d'une garantie de 2 ans couvrant les défauts de conformité et les
          vices cachés. Les dommages liés à une mauvaise utilisation, à une chute ou à un montage non
          conforme ne sont pas couverts.
        </p>

        <h2>8. Responsabilité</h2>
        <p>
          La responsabilité du vendeur ne peut être engagée en cas d'utilisation des produits non
          conforme à leur destination, notamment pour les trottinettes électriques dont l'usage sur
          la voie publique est soumis à la réglementation locale.
        </p>

        <h2>9. Droit applicable</h2>
        <p>
          Les présentes conditions sont soumises au droit belge. Les tribunaux belges sont
          compétents, sans préjudice des droits du consommateur dans son pays de résidence.
        </p>
      </div>
    </div>
  );
}
