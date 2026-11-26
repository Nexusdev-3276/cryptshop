import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Confidentialité",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container page prose-page">
      <header className="page-head">
        <p className="eyebrow">Données personnelles</p>
        <h1>Politique de confidentialité</h1>
      </header>

      <div className="prose">
        <h2>Données collectées</h2>
        <p>
          Lors d'une commande, nous collectons les informations nécessaires au traitement :
          prénom, nom, e-mail, téléphone, adresse de livraison et, le cas échéant, vos instructions.
          Aucune donnée bancaire n'est demandée ni stockée.
        </p>

        <h2>Utilisation</h2>
        <p>
          Ces données servent uniquement à préparer et expédier votre commande, à vous contacter au
          sujet de celle-ci et à respecter nos obligations comptables. Elles ne sont ni revendues ni
          utilisées à des fins publicitaires.
        </p>

        <h2>Conservation</h2>
        <p>
          Les informations de commande sont conservées le temps nécessaire à la garantie et aux
          obligations légales, puis supprimées.
        </p>

        <h2>Cookies et stockage local</h2>
        <p>
          Le site n'utilise pas de cookies publicitaires ni d'outils de suivi. Le panier et le pays
          de livraison sont enregistrés dans le stockage local de votre navigateur pour votre
          confort. Vous pouvez les effacer à tout moment.
        </p>

        <h2>Hébergement</h2>
        <p>
          Le site est hébergé par Vercel. Les paiements sont réalisés directement sur la blockchain,
          en dehors du site.
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous pouvez demander l'accès, la rectification ou la suppression de vos données en écrivant
          à <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </div>
  );
}
