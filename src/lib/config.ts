export const SITE = {
  name: "Cryptshop",
  legalName: "Cryptshop",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@cryptshop.store",
  country: "Belgique",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cryptshop.vercel.app",
  description:
    "Manettes PS5, Xbox, PC et trottinettes électriques. Matériel neuf, payé en Bitcoin, Ethereum ou Solana. Livraison en France, Belgique, Suisse et Canada.",
};

export const NAV = [
  { href: "/boutique", label: "Boutique" },
  { href: "/boutique?categorie=pc", label: "PC assemblés" },
  { href: "/boutique?categorie=cartes", label: "Cartes Steam" },
  { href: "/livraison", label: "Livraison" },
  { href: "/paiement", label: "Paiement crypto" },
  { href: "/compte", label: "Compte" },
  { href: "/contact", label: "Contact" },
];
