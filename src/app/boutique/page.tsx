import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Manettes PS5, Xbox et PC, PC assemblés et trottinettes électriques. Matériel neuf, paiement en Bitcoin, Ethereum ou Solana.",
  alternates: { canonical: "/boutique" },
};

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>;
}) {
  const { categorie } = await searchParams;

  return (
    <div className="container page">
      <header className="page-head">
        <p className="eyebrow">Catalogue</p>
        <h1>Boutique</h1>
        <p>
          Manettes officielles, PC assemblés à la commande et trottinettes. Stock en Belgique,
          expédition vers la France, la Suisse et le Canada.
        </p>
      </header>

      <Catalog products={products} initialCategory={categorie} />
    </div>
  );
}
