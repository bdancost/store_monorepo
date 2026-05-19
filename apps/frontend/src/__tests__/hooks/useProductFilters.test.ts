import { renderHook, act } from "@testing-library/react";
import { useProductFilters } from "../../hooks/useProductFilters";
import type { Product } from "../../hooks/useProducts";

// Dados de teste — fixture
// Por que constante fora dos testes?
// Reutilizada em vários testes — DRY principle
// Representa o mínimo necessário para testar o hook
const mockProducts: Product[] = [
  {
    id: "1",
    title: "iPhone 15 Pro",
    price: 999,
    description: "Smartphone Apple",
    category: "smartphones",
    image: "iphone.jpg",
  },
  {
    id: "2",
    title: "MacBook Pro",
    price: 1999,
    description: "Notebook Apple",
    category: "laptops",
    image: "macbook.jpg",
  },
  {
    id: "3",
    title: "Samsung Galaxy",
    price: 799,
    description: "Smartphone Samsung",
    category: "smartphones",
    image: "samsung.jpg",
  },
  {
    id: "4",
    title: "AirPods Pro",
    price: 249,
    description: "Fone Apple",
    category: "audio",
    image: "airpods.jpg",
  },
];

// Executa uma vez antes de TODOS os testes deste arquivo rodarem
beforeAll(() => {
  window.scrollTo = jest.fn();
});

// Fake timers para o debounce da busca
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("useProductFilters", () => {
  describe("estado inicial", () => {
    it("deve retornar todos os produtos sem filtro", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.filtered).toHaveLength(mockProducts.length);
      expect(result.current.total).toBe(mockProducts.length);
    });

    it("deve extrair categorias únicas dos produtos", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      expect(result.current.categories).toContain("smartphones");
      expect(result.current.categories).toContain("laptops");
      expect(result.current.categories).toContain("audio");
      // Não deve ter duplicatas
      const unique = new Set(result.current.categories);
      expect(unique.size).toBe(result.current.categories.length);
    });

    it('deve começar na categoria "todos"', () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));
      expect(result.current.activeCategory).toBe("todos");
    });
  });

  describe("filtro por categoria", () => {
    it("deve filtrar produtos por categoria", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setActiveCategory("smartphones");
      });

      // Apenas os 2 smartphones devem aparecer
      expect(result.current.filtered).toHaveLength(2);
      result.current.filtered.forEach((p) => {
        expect(p.category).toBe("smartphones");
      });
    });

    it('deve voltar para todos ao selecionar "todos"', () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setActiveCategory("smartphones");
      });

      act(() => {
        result.current.setActiveCategory("todos");
      });

      expect(result.current.filtered).toHaveLength(mockProducts.length);
    });

    it("deve retornar array vazio para categoria sem produtos", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setActiveCategory("categoria-inexistente");
      });

      expect(result.current.filtered).toHaveLength(0);
    });
  });

  describe("busca com debounce", () => {
    it("deve filtrar por título após o debounce", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSearch("iPhone");
      });

      // Antes do debounce (400ms), ainda mostra todos
      expect(result.current.filtered).toHaveLength(mockProducts.length);

      // Avança o debounce
      act(() => {
        jest.advanceTimersByTime(400);
      });

      // Agora filtra
      expect(result.current.filtered).toHaveLength(1);
      expect(result.current.filtered[0].title).toBe("iPhone 15 Pro");
    });

    it("deve ser case insensitive na busca", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSearch("iphone");
      });

      act(() => jest.advanceTimersByTime(400));

      expect(result.current.filtered).toHaveLength(1);
    });

    it("deve buscar por categoria também", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSearch("laptops");
      });

      act(() => jest.advanceTimersByTime(400));

      // MacBook é da categoria laptops
      expect(result.current.filtered).toHaveLength(1);
      expect(result.current.filtered[0].id).toBe("2");
    });

    it("deve retornar todos com busca vazia", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSearch("iPhone");
      });
      act(() => jest.advanceTimersByTime(400));

      act(() => {
        result.current.setSearch("");
      });
      act(() => jest.advanceTimersByTime(400));

      expect(result.current.filtered).toHaveLength(mockProducts.length);
    });
  });

  describe("ordenação", () => {
    it("deve ordenar por menor preço", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSort("price-asc");
      });

      const prices = result.current.filtered.map((p) => p.price);
      // Verifica que cada preço é menor ou igual ao próximo
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
      }
    });

    it("deve ordenar por maior preço", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSort("price-desc");
      });

      const prices = result.current.filtered.map((p) => p.price);
      for (let i = 0; i < prices.length - 1; i++) {
        expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
      }
    });

    it("deve ordenar A-Z por nome", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => {
        result.current.setSort("name-asc");
      });

      const titles = result.current.filtered.map((p) => p.title);
      const sorted = [...titles].sort((a, b) => a.localeCompare(b));
      expect(titles).toEqual(sorted);
    });
  });

  describe("paginação", () => {
    it("deve paginar corretamente", () => {
      // Cria 15 produtos para testar paginação
      // ITEMS_PER_PAGE = 12, então página 1 = 12 itens
      const manyProducts: Product[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i),
        title: `Produto ${i}`,
        price: i * 10,
        description: "",
        category: "test",
        image: "",
      }));

      const { result } = renderHook(() => useProductFilters(manyProducts));

      // Página 1 deve ter 12 itens (ITEMS_PER_PAGE)
      expect(result.current.paginated).toHaveLength(12);
      expect(result.current.totalPages).toBe(2);
    });

    it("deve mudar de página corretamente", () => {
      const manyProducts: Product[] = Array.from({ length: 15 }, (_, i) => ({
        id: String(i),
        title: `Produto ${i}`,
        price: i * 10,
        description: "",
        category: "test",
        image: "",
      }));

      const { result } = renderHook(() => useProductFilters(manyProducts));

      act(() => {
        result.current.setPage(2);
      });

      // Página 2 deve ter os 3 itens restantes (15 - 12)
      expect(result.current.paginated).toHaveLength(3);
      expect(result.current.page).toBe(2);
    });

    it("deve resetar para página 1 ao mudar de categoria", () => {
      const { result } = renderHook(() => useProductFilters(mockProducts));

      act(() => result.current.setPage(2));
      act(() => result.current.setActiveCategory("smartphones"));

      expect(result.current.page).toBe(1);
    });
  });
});
