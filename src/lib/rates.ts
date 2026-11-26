import type { CryptoCode, Rates } from "./types";

type PartialCrypto = Partial<Record<CryptoCode, number>>;

function envRate(name: string, fallback: number): number {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const FALLBACK: Rates = {
  fiat: {
    EUR: 1,
    CHF: envRate("RATE_CHF", 0.92),
    CAD: envRate("RATE_CAD", 1.56),
  },
  crypto: {
    BTC: envRate("RATE_BTC", 95000),
    ETH: envRate("RATE_ETH", 3200),
    SOL: envRate("RATE_SOL", 180),
  },
  updatedAt: new Date(0).toISOString(),
  live: false,
};

function sane(value: unknown, min: number, max: number): number | null {
  const number = typeof value === "string" ? Number(value) : value;
  return typeof number === "number" && Number.isFinite(number) && number >= min && number <= max
    ? number
    : null;
}

const LIMITS: Record<CryptoCode, [number, number]> = {
  BTC: [1000, 1_000_000],
  ETH: [50, 100_000],
  SOL: [5, 20_000],
};

const OPTIONS = {
  next: { revalidate: 600 },
  headers: { accept: "application/json" },
  signal: AbortSignal.timeout(6000),
};

async function getJson(url: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(url, OPTIONS);
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function fromCoinGecko(): Promise<PartialCrypto> {
  const data = await getJson(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=eur",
  );
  if (!data) return {};

  const result: PartialCrypto = {};
  const btc = sane((data.bitcoin as { eur?: unknown } | undefined)?.eur, ...LIMITS.BTC);
  const eth = sane((data.ethereum as { eur?: unknown } | undefined)?.eur, ...LIMITS.ETH);
  const sol = sane((data.solana as { eur?: unknown } | undefined)?.eur, ...LIMITS.SOL);
  if (btc) result.BTC = btc;
  if (eth) result.ETH = eth;
  if (sol) result.SOL = sol;
  return result;
}

async function fromCoinbase(): Promise<PartialCrypto> {
  const codes: CryptoCode[] = ["BTC", "ETH", "SOL"];
  const values = await Promise.all(
    codes.map(async (code) => {
      const data = await getJson(`https://api.coinbase.com/v2/prices/${code}-EUR/spot`);
      const amount = sane((data?.data as { amount?: unknown } | undefined)?.amount, ...LIMITS[code]);
      return [code, amount] as const;
    }),
  );

  const result: PartialCrypto = {};
  for (const [code, amount] of values) {
    if (amount) result[code] = amount;
  }
  return result;
}

async function fromCryptoCompare(): Promise<PartialCrypto> {
  const data = await getJson(
    "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,SOL&tsyms=EUR",
  );
  if (!data) return {};

  const result: PartialCrypto = {};
  for (const code of ["BTC", "ETH", "SOL"] as CryptoCode[]) {
    const entry = data[code] as { EUR?: unknown } | undefined;
    const amount = sane(entry?.EUR, ...LIMITS[code]);
    if (amount) result[code] = amount;
  }
  return result;
}

/**
 * Taux récupérés côté serveur, mis en cache 10 minutes.
 * Trois sources sont interrogées en parallèle ; si l'une répond, les prix restent à jour.
 * En dernier recours, les taux de secours (ou les variables RATE_* ) sont utilisés.
 */
export async function getRates(): Promise<Rates> {
  const [fxResult, ...cryptoResults] = await Promise.allSettled([
    getJson("https://api.frankfurter.app/latest?from=EUR&to=CHF,CAD"),
    fromCoinGecko(),
    fromCoinbase(),
    fromCryptoCompare(),
  ]);

  const fiat = { ...FALLBACK.fiat };
  let live = false;

  if (fxResult.status === "fulfilled" && fxResult.value) {
    const rates = fxResult.value.rates as { CHF?: unknown; CAD?: unknown } | undefined;
    const chf = sane(rates?.CHF, 0.5, 2);
    const cad = sane(rates?.CAD, 1, 3);
    if (chf) fiat.CHF = chf;
    if (cad) fiat.CAD = cad;
    live = Boolean(chf || cad);
  }

  const sources = cryptoResults
    .filter((result): result is PromiseFulfilledResult<PartialCrypto> => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((value) => Object.keys(value).length > 0);

  const crypto = { ...FALLBACK.crypto };
  for (const code of ["BTC", "ETH", "SOL"] as CryptoCode[]) {
    for (const source of sources) {
      const value = source[code];
      if (value) {
        crypto[code] = value;
        break;
      }
    }
  }

  if (sources.length > 0) live = true;

  return {
    fiat,
    crypto,
    updatedAt: new Date().toISOString(),
    live,
  };
}
