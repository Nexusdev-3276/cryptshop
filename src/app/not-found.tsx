import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty-state">
        <p className="eyebrow" style={{ justifyContent: "center" }}>
          Erreur 404
        </p>
        <h2 style={{ marginTop: 12 }}>Cette page n'existe pas.</h2>
        <p>Le lien est peut-être ancien, ou le produit n'est plus au catalogue.</p>
        <Link href="/boutique" className="btn btn-primary">
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}
