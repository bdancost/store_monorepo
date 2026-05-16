import { useState, useMemo, useEffect, useRef } from "react";
import type { Product } from "./useProducts";

interface UseProductFiltersReturn {
  search: string;
  setSearch: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  categories: string[];
  filtered: Product[];
  total: number;
}

export function useProductFilters(
  products: Product[],
): UseProductFiltersReturn {
  const [search, setSearchRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("todos");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce de 400ms na busca
  function setSearch(value: string) {
    setSearchRaw(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setDebouncedSearch(value), 400);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Extrai categorias únicas dos produtos
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique.sort();
  }, [products]);

  // Filtra por categoria e busca
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        activeCategory === "todos" || p.category === activeCategory;

      const matchSearch =
        debouncedSearch.trim() === "" ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, debouncedSearch]);

  return {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    categories,
    filtered,
    total: filtered.length,
  };
}
