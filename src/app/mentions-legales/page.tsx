import type { Metadata } from "next";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "Mentions légales",
  robots: { index: true, follow: true },
};

export default function LegalPage() {
  return (
    <div className="container page prose-page">
      <header className="page-head">
        <p className="eyebrow">Informations légales</p>
        <h1>Mentions légales</h1>
      </header>

      <div className="prose">
        <h2>Éditeur</h2>
        <p>
          {SITE.legalName}, entreprise individuelle établie en Belgique.
          <br />
          Contact : <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        </p>

        <h2>Responsable de la publication</h2>
        <p>{SITE.legalName}.</p>

        <h2>Hébergement</h2>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Ave #4133, Covina, CA 91723, États-Unis
          <br />
          vercel.com
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L'ensemble des contenus du site (textes, visuels, marques et logos) est protégé. Toute
          reproduction ou utilisation non autorisée est interdite. Les marques citées appartiennent
          à leurs propriétaires respectifs.
        </p>

        <h2>Prix et taxes</h2>
        <p>
          Les prix sont indiqués toutes taxes comprises pour l'Union européenne. Pour la Suisse et le
          Canada, les taxes et droits d'importation éventuels sont à la charge du destinataire.
        </p>

        <h2>Litiges</h2>
        <p>
          En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les
          tribunaux belges sont compétents, sans préjudice des droits dont dispose le consommateur
          dans son pays de résidence.
        </p>
      </div>
    </div>
  );
}
