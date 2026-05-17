import { useState, useMemo, useEffect, useRef } from "react";
import type { Product } from "./useProducts";

export type SortOption =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

const ITEMS_PER_PAGE = 12;

interface UseProductFiltersReturn {
  search: string;
  setSearch: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  sort: SortOption;
  setSort: (value: SortOption) => void;
  categories: string[];
  filtered: Product[];
  paginated: Product[];
  total: number;
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
}

export function useProductFilters(
  products: Product[],
): UseProductFiltersReturn {
  // 1. Renomeados os setters originais para "Raw" para evitar conflito de escopo
  const [search, setSearchRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategoryRaw] = useState("todos");
  const [sort, setSortRaw] = useState<SortOption>("relevance");
  const [page, setPageRaw] = useState(1);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Altera o termo de busca com debounce
  function setSearch(value: string) {
    setSearchRaw(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPageRaw(1);
    }, 400);
  }

  // Agora chama corretamente o setter do useState original
  function setActiveCategory(value: string) {
    setPageRaw(1);
    setActiveCategoryRaw(value);
  }

  // Agora chama corretamente o setter do useState original
  function setSort(value: SortOption) {
    setPageRaw(1);
    setSortRaw(value);
  }

  function setPage(value: number) {
    setPageRaw(value);
    // Executa o scroll apenas no ambiente do browser de forma segura
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Limpa o timer do debounce ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Mapeia categorias únicas
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique.sort();
  }, [products]);

  // Filtra e ordena a lista
  const filtered = useMemo(() => {
    const result = products.filter((p) => {
      const matchCategory =
        activeCategory === "todos" || p.category === activeCategory;
      const matchSearch =
        debouncedSearch.trim() === "" ||
        p.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCategory && matchSearch;
    });

    // Retorna uma nova cópia ordenada (boa prática para não mutar o array original)
    return [...result].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });
  }, [products, activeCategory, debouncedSearch, sort]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  // Pagina os dados filtrados
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    sort,
    setSort,
    categories,
    filtered,
    paginated,
    total: filtered.length,
    page,
    setPage,
    totalPages,
  };
}
