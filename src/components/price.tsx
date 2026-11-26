"use client";

import { formatCrypto, formatMoney } from "@/lib/format";
import type { CryptoCode } from "@/lib/types";
import { useShop } from "./shop-provider";

export function Price({
  eur,
  crypto = true,
  code = "BTC",
  size,
}: {
  eur: number;
  crypto?: boolean;
  code?: CryptoCode;
  size?: "lg" | "sm";
}) {
  const { country, rates } = useShop();

  return (
    <span className={size ? `price price-${size}` : "price"}>
      <span className="price-main">{formatMoney(eur, country, rates)}</span>
      {crypto ? <span className="price-crypto">≈ {formatCrypto(eur, rates, code)}</span> : null}
    </span>
  );
}
