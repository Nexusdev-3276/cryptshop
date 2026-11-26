"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/products";
import type { Product } from "@/lib/types";
import { ProductCard } from "./product-card";

type Sort = "default" | "asc" | "desc";

export function Catalog({
  products,
  initialCategory = "all",
}: {
  products: Product[];
  initialCategory?: string;
}) {
  const [category, setCategory] = useState(
    CATEGORIES.some((item) => item.id === initialCategory) ? initialCategory : "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("default");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchCategory = category === "all" || product.category === category;
      const matchQuery =
        !needle ||
        `${product.name} ${product.brand} ${product.platform} ${product.tagline}`
          .toLowerCase()
          .includes(needle);
      return matchCategory && matchQuery;
    });

    if (sort === "asc") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "desc") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [products, category, query, sort]);

  return (
    <div>
      <div className="catalog-tools">
        <div className="filter-row" role="group" aria-label="Filtrer par catégorie">
          {CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={category === item.id ? "chip active" : "chip"}
              onClick={() => setCategory(item.id)}
              aria-pressed={category === item.id}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="catalog-actions">
          <label className="search-field">
            <span className="visually-hidden">Rechercher un produit</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher"
            />
          </label>
          <label className="select-field">
            <span className="visually-hidden">Trier les produits</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
              <option value="default">Tri : catalogue</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>

      <p className="result-count">
        {visible.length} {visible.length > 1 ? "produits" : "produit"}
      </p>

      {visible.length > 0 ? (
        <div className="grid product-grid">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Aucun résultat</h2>
          <p>Essayez un autre mot-clé ou affichez toutes les catégories.</p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setQuery("");
              setCategory("all");
            }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
