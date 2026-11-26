"use client";

import { convert } from "@/lib/format";
import { formatCrypto } from "@/lib/format";
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
  const parts = new Intl.NumberFormat(country.locale, {
    style: "currency",
    currency: country.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(convert(eur, country, rates));

  const className = size ? `price price-${size}` : "price";

  const rendered: React.ReactNode[] = [];
  let pendingDecimal = "";
  parts.forEach((part, index) => {
    if (part.type === "decimal") {
      pendingDecimal = part.value;
      return;
    }
    if (part.type === "fraction") {
      rendered.push(
        <span className="price-frac" key={`frac-${index}`}>
          {pendingDecimal}
          {part.value}
        </span>,
      );
      pendingDecimal = "";
      return;
    }
    if (part.type === "integer") {
      rendered.push(
        <span className="price-whole" key={`int-${index}`}>
          {part.value}
        </span>,
      );
      return;
    }
    if (part.type === "group") {
      rendered.push(
        <span className="price-group" key={`grp-${index}`}>
          {part.value}
        </span>,
      );
      return;
    }
    if (part.type === "currency") {
      rendered.push(
        <span className="price-cur" key={`cur-${index}`}>
          {part.value}
        </span>,
      );
      return;
    }
    rendered.push(<span key={`other-${index}`}>{part.value}</span>);
  });

  return (
    <span className={className}>
      <span className="price-main">{rendered}</span>
      {crypto ? <span className="price-crypto">≈ {formatCrypto(eur, rates, code)}</span> : null}
    </span>
  );
}
