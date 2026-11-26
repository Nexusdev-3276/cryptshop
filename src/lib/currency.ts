import type { Country, CountryCode, CryptoCode } from "./types";

export const COUNTRIES: Record<CountryCode, Country> = {
  FR: {
    code: "FR",
    label: "France",
    currency: "EUR",
    locale: "fr-FR",
    shipping: 7.9,
    freeFrom: 500,
    delay: "2 à 4 jours ouvrés",
  },
  BE: {
    code: "BE",
    label: "Belgique",
    currency: "EUR",
    locale: "fr-BE",
    shipping: 7.9,
    freeFrom: 500,
    delay: "2 à 4 jours ouvrés",
  },
  CH: {
    code: "CH",
    label: "Suisse",
    currency: "CHF",
    locale: "fr-CH",
    shipping: 19.9,
    freeFrom: 900,
    delay: "3 à 5 jours ouvrés",
  },
  CA: {
    code: "CA",
    label: "Canada",
    currency: "CAD",
    locale: "fr-CA",
    shipping: 39.9,
    freeFrom: 1500,
    delay: "5 à 9 jours ouvrés",
  },
};

export const COUNTRY_LIST = Object.values(COUNTRIES);
export const DEFAULT_COUNTRY: CountryCode = "FR";
export const CRYPTO_CODES: CryptoCode[] = ["BTC", "ETH", "SOL"];

export type { Country };
