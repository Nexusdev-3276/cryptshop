import type { Country, CryptoCode, Rates } from "./types";

export function convert(eur: number, country: Country, rates: Rates): number {
  return eur * rates.fiat[country.currency];
}

export function formatMoney(eur: number, country: Country, rates: Rates): string {
  return new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(convert(eur, country, rates));
}

export function formatEur(eur: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(eur);
}

export function cryptoAmount(eur: number, rates: Rates, code: CryptoCode): number {
  return eur / rates.crypto[code];
}

export function formatCrypto(eur: number, rates: Rates, code: CryptoCode): string {
  const digits = code === "BTC" ? 6 : code === "ETH" ? 4 : 2;
  const value = cryptoAmount(eur, rates, code);
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
  return `${formatted} ${code}`;
}

export function shippingFor(subtotal: number, country: Country): number {
  if (subtotal <= 0) return 0;
  return subtotal >= country.freeFrom ? 0 : country.shipping;
}
