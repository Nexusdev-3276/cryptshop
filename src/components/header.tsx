"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { COUNTRY_LIST } from "@/lib/currency";
import { NAV } from "@/lib/config";
import { useShop } from "./shop-provider";

export function Header() {
  const pathname = usePathname();
  const { count, countryCode, setCountryCode } = useShop();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Cryptshop, accueil">
          <span className="brand-mark">C</span>
          Cryptshop
        </Link>

        <nav className="main-nav" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href.split("?")[0] ? "nav-link active" : "nav-link"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <div className="country-switch" role="group" aria-label="Pays de livraison">
            {COUNTRY_LIST.map((country) => (
              <button
                key={country.code}
                type="button"
                className={country.code === countryCode ? "country active" : "country"}
                onClick={() => setCountryCode(country.code)}
                aria-pressed={country.code === countryCode}
                title={country.label}
              >
                {country.code}
              </button>
            ))}
          </div>

          <Link href="/panier" className="cart-link">
            Panier
            <span className="cart-count">{count}</span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
          >
            {open ? "Fermer" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="mobile-menu">
          <nav aria-label="Navigation mobile">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mobile-countries" role="group" aria-label="Pays de livraison">
            {COUNTRY_LIST.map((country) => (
              <button
                key={country.code}
                type="button"
                className={country.code === countryCode ? "country active" : "country"}
                onClick={() => setCountryCode(country.code)}
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
