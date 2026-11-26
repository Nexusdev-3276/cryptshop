import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Conditions générales d'utilisation du site Cryptshop. Règles d'usage, responsabilités et modalités d'accès.",
  alternates: { canonical: "/tos" },
};

export default function TosPage() {
  return (
    <div className="container page prose-page">
      <header className="page-head">
        <p className="eyebrow">Légal</p>
        <h1>Conditions d'utilisation</h1>
        <p>Dernière mise à jour : 27 novembre 2026</p>
      </header>

      <div className="prose">
        <h2>1. Objet et acceptation</h2>
        <p>
          Les présentes conditions d'utilisation régissent l'accès et l'utilisation du site
          Cryptshop (ci-après « le Site »). En accédant au Site, vous acceptez sans réserve
          les présentes conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas
          utiliser le Site.
        </p>

        <h2>2. Accès au site</h2>
        <p>
          Le Site est accessible gratuitement à tout utilisateur disposant d'un accès à
          Internet. Cryptshop s'efforce de maintenir le Site accessible 24h/24 et 7j/7, mais
          ne garantit pas une disponibilité permanente. Des interruptions peuvent survenir
          pour maintenance, mise à jour ou cas de force majeure.
        </p>

        <h2>3. Comptes utilisateurs</h2>
        <p>
          L'accès à certaines fonctionnalités (suivi de commande, chat) nécessite la création
          d'un compte. Le compte est créé automatiquement lors de la première commande. L'accès
          se fait via un code sécurisé unique généré par le système. L'utilisateur est
          responsable de la conservation de ce code. Cryptshop ne stocke aucun mot de passe et
          ne peut pas récupérer un code perdu.
        </p>
        <p>
          L'utilisateur s'engage à ne pas partager son code d'accès avec des tiers et à
          utiliser le Site de manière loyale et conforme à la loi.
        </p>

        <h2>4. Utilisation acceptable</h2>
        <p>Il est interdit d'utiliser le Site pour :</p>
        <ul>
          <li>Toute activité illégale ou frauduleuse ;</li>
          <li>Tenter d'accéder à des données ou systèmes non autorisés ;</li>
          <li>Envoyer du spam, des virus ou tout code malveillant ;</li>
          <li>Usurper l'identité d'un tiers ;</li>
          <li>Perturber le fonctionnement du Site (DDoS, scraping abusif, etc.) ;</li>
          <li>Revendre ou exploiter commercialement le contenu du Site sans autorisation.</li>
        </ul>
        <p>
          Cryptshop se réserve le droit de bloquer l'accès à tout utilisateur violant ces règles.
        </p>

        <h2>5. Produits et prix</h2>
        <p>
          Les produits proposés sont neufs, dans leur emballage d'origine, avec facture et
          garantie. Les prix sont affichés en euros (EUR) et convertis en crypto-monnaies
          (BTC, ETH, SOL) au taux du marché au moment de la commande. Cryptshop se réserve le
          droit de modifier les prix à tout moment sans préavis.
        </p>
        <p>
          Les photos sont non contractuelles. Les descriptions sont données à titre indicatif.
        </p>

        <h2>6. Commandes et paiements</h2>
        <p>
          Les commandes sont validées après paiement complet en crypto-monnaie. Le paiement est
          définitif et irréversible. Cryptshop ne peut pas annuler ni rembourser un paiement
          crypto une fois confirmé sur la blockchain.
        </p>
        <p>
          En cas de problème (montant insuffisant, mauvais réseau), contactez le support avec
          votre référence de commande. Les remboursements éventuels sont effectués en euros
          par virement bancaire, au taux du jour de la commande.
        </p>

        <h2>7. Livraison</h2>
        <p>
          La livraison est effectuée depuis la Belgique vers la France, la Belgique, la Suisse
          et le Canada. Les délais et frais sont indiqués lors de la commande. Cryptshop n'est
          pas responsable des retards causés par les transporteurs ou les douanes.
        </p>
        <p>
          Pour les envois hors UE (Suisse, Canada), les frais de douane et taxes
          d'importation sont à la charge du destinataire.
        </p>

        <h2>8. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu du Site (textes, images, logos, design, code) est la propriété
          de Cryptshop ou de ses partenaires. Toute reproduction, distribution ou modification
          sans autorisation écrite est interdite.
        </p>
        <p>
          Les marques citées (Sony, Microsoft, Steam, SCUF, GameSir, KuKirin, etc.) appartiennent
          à leurs propriétaires respectifs.
        </p>

        <h2>9. Limitation de responsabilité</h2>
        <p>
          Cryptshop ne saurait être tenu responsable des dommages directs ou indirects
          résultant de l'utilisation du Site, d'une interruption de service, d'une perte de
          données ou d'une transaction crypto effectuée par erreur par l'utilisateur.
        </p>
        <p>
          L'utilisateur est seul responsable de la sécurité de son portefeuille crypto et de
          la vérification des adresses de paiement.
        </p>

        <h2>10. Liens externes</h2>
        <p>
          Le Site peut contenir des liens vers des sites tiers. Cryptshop n'est pas responsable
          du contenu de ces sites ni de leurs pratiques en matière de confidentialité.
        </p>

        <h2>11. Modification des conditions</h2>
        <p>
          Cryptshop se réserve le droit de modifier les présentes conditions à tout moment.
          Les modifications prennent effet dès leur publication sur le Site. L'utilisateur est
          invité à consulter régulièrement cette page.
        </p>

        <h2>12. Droit applicable et juridiction</h2>
        <p>
          Les présentes conditions sont régies par le droit belge. En cas de litige, les
          tribunaux de Bruxelles sont compétents.
        </p>

        <h2>13. Contact</h2>
        <p>
          Pour toute question relative aux présentes conditions, contactez-nous via la page{" "}
          <Link href="/contact">Contact</Link> ou par e-mail à{" "}
          <a href="mailto:contact@cryptshop.store">contact@cryptshop.store</a>.
        </p>
      </div>
    </div>
  );
}
