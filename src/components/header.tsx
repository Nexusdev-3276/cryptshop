"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { COUNTRY_LIST } from "@/lib/currency";
import { NAV } from "@/lib/config";
import type { CountryCode } from "@/lib/types";
import { useShop } from "./shop-provider";

const SEARCH_CATEGORIES = [
  { id: "all", label: "Toutes les catégories" },
  { id: "manettes", label: "Manettes" },
  { id: "pc", label: "PC assemblés" },
  { id: "scooters", label: "Trottinettes" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, countryCode, setCountryCode } = useShop();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchCat, setSearchCat] = useState("all");

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (searchCat !== "all") params.set("categorie", searchCat);
    router.push(`/boutique${params.toString() ? `?${params}` : ""}`);
    setOpen(false);
  }

  return (
    <header className="site-header" id="top">
      <div className="header-top">
        <div className="header-top-inner">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span>Menu</span>
          </button>

          <Link href="/" className="brand" aria-label="Cryptshop, accueil">
            cryptshop
          </Link>

          <label className="deliver-to" title="Pays de livraison">
            <span className="deliver-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>
            <span className="deliver-text">
              <small>Livrer à</small>
              <strong>
                {COUNTRY_LIST.find((c) => c.code === countryCode)?.label ?? countryCode}
              </strong>
            </span>
            <select
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value as CountryCode)}
              aria-label="Pays de livraison"
            >
              {COUNTRY_LIST.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.label}
                </option>
              ))}
            </select>
          </label>

          <form className="search-bar" onSubmit={submitSearch} role="search">
            <select
              className="search-cat"
              value={searchCat}
              onChange={(event) => setSearchCat(event.target.value)}
              aria-label="Catégorie"
            >
              {SEARCH_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              className="search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit, une marque…"
              aria-label="Rechercher"
            />
            <button type="submit" className="search-submit" aria-label="Rechercher">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>

          <Link href="/contact" className="header-link">
            <small>Bonjour, visiteur</small>
            <strong>Besoin d&apos;aide ?</strong>
          </Link>

          <Link href="/livraison" className="header-link header-link-hide">
            <small>Suivi &amp; retours</small>
            <strong>Livraison</strong>
          </Link>

          <Link href="/panier" className="header-cart">
            <span className="cart-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1.6" />
                <circle cx="19" cy="21" r="1.6" />
                <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
              </svg>
              <span className="cart-count">{count}</span>
            </span>
            <strong>Panier</strong>
          </Link>
        </div>
      </div>

      <div className="header-nav">
        <div className="header-nav-inner">
          <Link href="/boutique" className="nav-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            Toutes les catégories
          </Link>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href.split("?")[0] ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
          <span className="nav-promo">Paiement BTC · ETH · SOL</span>
        </div>
      </div>

      {open ? (
        <div className="mobile-menu open">
          <nav aria-label="Navigation mobile">
            <Link href="/boutique">Boutique</Link>
            <Link href="/boutique?categorie=manettes">Manettes</Link>
            <Link href="/boutique?categorie=pc">PC assemblés</Link>
            <Link href="/boutique?categorie=scooters">Trottinettes</Link>
            <Link href="/livraison">Livraison</Link>
            <Link href="/paiement">Paiement crypto</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="mobile-countries" role="group" aria-label="Pays de livraison">
            {COUNTRY_LIST.map((country) => (
              <button
                key={country.code}
                type="button"
                className={country.code === countryCode ? "country active" : "country"}
                onClick={() => setCountryCode(country.code as CountryCode)}
              >
                {country.code} · {country.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
