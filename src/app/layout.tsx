import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ShopProvider } from "@/components/shop-provider";
import { SITE } from "@/lib/config";
import { getRates } from "@/lib/rates";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const revalidate = 600;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Cryptshop — Manettes et PC gaming, payés en crypto",
    template: "%s — Cryptshop",
  },
  description: SITE.description,
  applicationName: "Cryptshop",
  keywords: [
    "manette PS5",
    "manette Xbox",
    "PC gamer",
    "paiement crypto",
    "Bitcoin",
    "Ethereum",
    "Solana",
    "livraison Belgique",
  ],
  openGraph: {
    type: "website",
    locale: "fr_BE",
    url: SITE.url,
    siteName: "Cryptshop",
    title: "Cryptshop — Manettes et PC gaming, payés en crypto",
    description: SITE.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131921",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const rates = await getRates();

  return (
    <html lang="fr" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu
        </a>
        <ShopProvider rates={rates}>
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
