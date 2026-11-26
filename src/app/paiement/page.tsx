import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Paiement crypto",
  description:
    "Payer en Bitcoin, Ethereum ou Solana. Montant calculé au moment de la commande, sans données bancaires.",
  alternates: { canonical: "/paiement" },
};

const CRYPTOS = [
  {
    code: "BTC",
    name: "Bitcoin",
    network: "Réseau Bitcoin",
    time: "1 à 3 confirmations",
  },
  {
    code: "ETH",
    name: "Ethereum",
    network: "Réseau Ethereum (ERC-20)",
    time: "1 à 2 confirmations",
  },
  {
    code: "SOL",
    name: "Solana",
    network: "Réseau Solana",
    time: "Quelques secondes",
  },
];

export default function PaymentPage() {
  return (
    <div className="container page prose-page">
      <header className="page-head">
        <p className="eyebrow">Paiement</p>
        <h1>Payer en crypto</h1>
        <p>
          Trois réseaux acceptés : Bitcoin, Ethereum et Solana. Le montant est calculé au moment de
          la commande, puis affiché avec l'adresse de réception.
        </p>
      </header>

      <div className="crypto-cards">
        {CRYPTOS.map((crypto) => (
          <div className="crypto-card" key={crypto.code}>
            <span className="pay-code">{crypto.code}</span>
            <h2>{crypto.name}</h2>
            <p>{crypto.network}</p>
            <span className="muted">{crypto.time}</span>
          </div>
        ))}
      </div>

      <div className="prose">
        <h2>Comment ça marche</h2>
        <ol>
          <li>Validez votre panier et renseignez votre adresse de livraison.</li>
          <li>Choisissez la crypto et envoyez le montant exact à l'adresse affichée.</li>
          <li>La commande est préparée dès confirmation du paiement sur la blockchain.</li>
        </ol>

        <h2>Le taux de conversion</h2>
        <p>
          Les prix sont affichés en euros. L'équivalent crypto est calculé à partir du taux du
          marché au moment de la commande. Ce montant est verrouillé pour votre commande : envoyez
          exactement le montant indiqué.
        </p>

        <h2>Points importants</h2>
        <ul>
          <li>Envoyez uniquement la crypto indiquée, sur le réseau indiqué.</li>
          <li>Les frais de réseau sont à votre charge.</li>
          <li>Un paiement crypto est définitif et ne peut pas être annulé.</li>
          <li>Les remboursements éventuels sont effectués en euros par virement.</li>
        </ul>

        <h2>Besoin d'aide</h2>
        <p>
          Si vous avez un doute sur un montant ou une adresse, ne payez pas et écrivez-nous depuis la
          page <Link href="/contact">Contact</Link> en indiquant votre référence de commande.
        </p>

        <p>
          <Link href="/boutique" className="btn btn-primary">
            Voir la boutique
          </Link>
        </p>
      </div>
    </div>
  );
}
