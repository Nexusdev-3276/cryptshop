"use client";

import { formatMoney, shippingFor } from "@/lib/format";
import { useShop } from "./shop-provider";

export function DeliveryEstimate({ price }: { price: number }) {
  const { country, rates } = useShop();
  const cost = shippingFor(price, country);

  return (
    <div className="delivery-estimate">
      <div>
        <span>Livraison {country.label}</span>
        <strong>{country.delay}</strong>
      </div>
      <div>
        <span>Frais de port</span>
        <strong>{cost === 0 ? "Offerts" : formatMoney(cost, country, rates)}</strong>
      </div>
      <p>
        Livraison offerte dès {formatMoney(country.freeFrom, country, rates)} d'achat. Expédition
        depuis la Belgique avec suivi.
      </p>
    </div>
  );
}
