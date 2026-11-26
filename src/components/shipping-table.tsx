"use client";

import { COUNTRY_LIST } from "@/lib/currency";
import { formatMoney } from "@/lib/format";
import { useShop } from "./shop-provider";

export function ShippingTable() {
  const { rates } = useShop();

  return (
    <div className="table-wrap">
      <table className="shipping-table">
        <thead>
          <tr>
            <th>Destination</th>
            <th>Délai</th>
            <th>Frais de port</th>
            <th>Offerts dès</th>
          </tr>
        </thead>
        <tbody>
          {COUNTRY_LIST.map((country) => (
            <tr key={country.code}>
              <td>{country.label}</td>
              <td>{country.delay}</td>
              <td>{formatMoney(country.shipping, country, rates)}</td>
              <td>{formatMoney(country.freeFrom, country, rates)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
