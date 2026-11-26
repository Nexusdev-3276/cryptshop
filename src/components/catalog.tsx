"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

type Sort = "default" | "asc" | "desc";

const BRANDS = ["Sony", "SCUF", "GameSir", "KuKirin", "Cryptshop"];

export function Catalog({
  products,
  initialCategory = "all",
  initialQuery = "",
}: {
  products: Product[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [category, setCategory] = useState(
    CATEGORIES.some((item) => item.id === initialCategory) ? initialCategory : "all",
  );
  const [brand, setBrand] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("default");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (CATEGORIES.some((item) => item.id === initialCategory)) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const counts = useMemo(() => {
    const byBrand: Record<string, number> = {};
    for (const product of products) {
      if (category !== "all" && product.category !== category) continue;
      byBrand[product.brand] = (byBrand[product.brand] || 0) + 1;
    }
    return byBrand;
  }, [products, category]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchCategory = category === "all" || product.category === category;
      const matchBrand = !brand || product.brand === brand;
      const matchQuery =
        !needle ||
        `${product.name} ${product.brand} ${product.platform} ${product.tagline}`
          .toLowerCase()
          .includes(needle);
      return matchCategory && matchBrand && matchQuery;
    });

    if (sort === "asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, category, brand, query, sort]);

  return (
    <div className="catalog-layout">
      <aside className="catalog-sidebar">
        <div className="filter-block">
          <h2>Catégorie</h2>
          <ul className="filter-list">
            {CATEGORIES.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={category === item.id ? "active" : ""}
                  onClick={() => setCategory(item.id)}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="filter-block">
          <h2>Marque</h2>
          <ul className="filter-list">
            <li>
              <button
                type="button"
                className={brand === null ? "active" : ""}
                onClick={() => setBrand(null)}
              >
                Toutes
              </button>
            </li>
            {BRANDS.filter((item) => counts[item]).map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className={brand === item ? "active" : ""}
                  onClick={() => setBrand(item)}
                >
                  {item}
                  <span className="count">{counts[item]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="filter-block">
          <h2>Paiement</h2>
          <p>BTC · ETH · SOL</p>
          <Link href="/paiement">En savoir plus</Link>
        </div>
      </aside>

      <div className="catalog-results">
        <div className="results-bar">
          <p className="result-count">
            {visible.length} résultat{visible.length > 1 ? "s" : ""}
            {query ? (
              <>
                {" "}pour <strong>« {query} »</strong>
              </>
            ) : null}
            {brand ? (
              <>
                {" "}· {brand}
              </>
            ) : null}
          </p>
          <label className="select-field">
            <span>Trier par</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="default">Pertinence</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </label>
        </div>

        {query || brand ? (
          <div className="active-filters">
            {query ? (
              <button className="chip" onClick={() => setQuery("")}>
                Recherche : {query} ✕
              </button>
            ) : null}
            {brand ? (
              <button className="chip" onClick={() => setBrand(null)}>
                Marque : {brand} ✕
              </button>
            ) : null}
          </div>
        ) : null}

        {visible.length > 0 ? (
          <div className="grid product-grid">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Aucun résultat</h2>
            <p>Essayez un autre mot-clé, une autre catégorie ou marque.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setQuery("");
                setCategory("all");
                setBrand(null);
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
