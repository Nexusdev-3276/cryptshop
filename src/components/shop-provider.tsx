"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { COUNTRIES, DEFAULT_COUNTRY } from "@/lib/currency";
import { products } from "@/lib/products";
import { shippingFor } from "@/lib/format";
import type { Country, CountryCode, Product, Rates } from "@/lib/types";

type CartLine = { slug: string; qty: number };

export type ShopLine = { slug: string; product: Product; qty: number; line: number };

type ShopContextValue = {
  rates: Rates;
  country: Country;
  countryCode: CountryCode;
  setCountryCode: (code: CountryCode) => void;
  items: CartLine[];
  lines: ShopLine[];
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);
const CART_KEY = "cryptshop:cart";
const COUNTRY_KEY = "cryptshop:country";

export function ShopProvider({ rates, children }: { rates: Rates; children: React.ReactNode }) {
  const [countryCode, setCountryCodeState] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedCountry = localStorage.getItem(COUNTRY_KEY) as CountryCode | null;
      if (savedCountry && COUNTRIES[savedCountry]) setCountryCodeState(savedCountry);

      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (line) =>
                typeof line?.slug === "string" &&
                products.some((product) => product.slug === line.slug) &&
                Number.isInteger(line.qty) &&
                line.qty > 0,
            ),
          );
        }
      }
    } catch {
      // stockage indisponible : on repart d'un panier vide
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, ready]);

  const setCountryCode = useCallback((code: CountryCode) => {
    setCountryCodeState(code);
    try {
      localStorage.setItem(COUNTRY_KEY, code);
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    setItems((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug
            ? { ...line, qty: Math.min(10, product.stock, line.qty + qty) }
            : line,
        );
      }
      return [...current, { slug, qty: Math.min(10, product.stock, qty) }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    const product = products.find((item) => item.slug === slug);
    if (!product) return;
    const safe = Math.max(0, Math.min(10, product.stock, Math.floor(qty)));
    setItems((current) =>
      safe === 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) => (line.slug === slug ? { ...line, qty: safe } : line)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<ShopContextValue>(() => {
    const lines = items
      .map((line) => {
        const product = products.find((item) => item.slug === line.slug);
        if (!product) return null;
        return { ...line, product, line: Math.round(product.price * line.qty * 100) / 100 };
      })
      .filter((line): line is ShopLine => line !== null);

    const subtotal = Math.round(lines.reduce((sum, line) => sum + line.line, 0) * 100) / 100;
    const country = COUNTRIES[countryCode];
    const shipping = Math.round(shippingFor(subtotal, country) * 100) / 100;
    const total = Math.round((subtotal + shipping) * 100) / 100;

    return {
      rates,
      country,
      countryCode,
      setCountryCode,
      items,
      lines,
      ready,
      add,
      setQty,
      remove,
      clear,
      count: items.reduce((sum, line) => sum + line.qty, 0),
      subtotal,
      shipping,
      total,
    };
  }, [rates, countryCode, setCountryCode, items, ready, add, setQty, remove, clear]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop doit être utilisé dans ShopProvider");
  return context;
}
