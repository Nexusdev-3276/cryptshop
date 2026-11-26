"use client";

import { formatCrypto } from "@/lib/format";
import { CRYPTO_CODES } from "@/lib/currency";
import { useShop } from "./shop-provider";

export function CryptoPrices({ eur }: { eur: number }) {
  const { rates } = useShop();

  return (
    <dl className="crypto-list">
      {CRYPTO_CODES.map((code) => (
        <div key={code}>
          <dt>{code}</dt>
          <dd>{formatCrypto(eur, rates, code)}</dd>
        </div>
      ))}
    </dl>
  );
}
