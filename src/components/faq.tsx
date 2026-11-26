const ITEMS = [
  {
    question: "Les produits sont-ils neufs ?",
    answer:
      "Oui. Tous les produits sont neufs, jamais utilisés, dans leur emballage d'origine. Une facture est fournie avec chaque commande.",
  },
  {
    question: "Quels pays sont livrés ?",
    answer:
      "France, Belgique, Suisse et Canada. Les frais et délais sont indiqués dans le panier selon votre pays.",
  },
  {
    question: "Comment fonctionne le paiement en crypto ?",
    answer:
      "Après validation du panier, vous recevez une adresse Bitcoin, Ethereum ou Solana et le montant exact. La commande est préparée dès réception du paiement.",
  },
  {
    question: "Les PC sont-ils assemblés à la commande ?",
    answer:
      "Oui. Chaque configuration est montée, câblée et testée avant expédition. Comptez 3 à 5 jours ouvrés de préparation.",
  },
  {
    question: "Y a-t-il une garantie ?",
    answer:
      "Tous les produits bénéficient d'une garantie de 2 ans. Pour les PC, elle couvre les pièces et la main-d'œuvre.",
  },
];

export function Faq() {
  return (
    <div className="faq">
      {ITEMS.map((item) => (
        <details key={item.question}>
          <summary>
            {item.question}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
