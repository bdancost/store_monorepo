import { renderHook } from "@testing-library/react";
import { useOrderSummary } from "../../hooks/useOrderSummary";

// Fixture de item de carrinho
// Tipagem inline para deixar o teste auto-contido
const makeItem = (price: number, quantity: number) => ({
  quantity,
  product: { price },
});

describe("useOrderSummary", () => {
  describe("com carrinho vazio", () => {
    it("deve retornar zeros para carrinho vazio", () => {
      const { result } = renderHook(() => useOrderSummary([]));

      expect(result.current.subtotal).toBe(0);
      expect(result.current.total).toBe(0);
      expect(result.current.shipping).toBe(0);
      expect(result.current.hasFreeShipping).toBe(false);
    });

    it("deve ter progresso zero para frete grátis", () => {
      const { result } = renderHook(() => useOrderSummary([]));

      expect(result.current.freeShippingProgress).toBe(0);
      expect(result.current.amountToFreeShipping).toBe(299);
    });
  });

  describe("cálculo de subtotal", () => {
    it("deve calcular subtotal de um item", () => {
      const items = [makeItem(100, 2)];
      const { result } = renderHook(() => useOrderSummary(items));

      // 100 * 2 = 200
      expect(result.current.subtotal).toBe(200);
    });

    it("deve calcular subtotal de múltiplos itens", () => {
      const items = [
        makeItem(100, 1), // 100
        makeItem(50, 3), // 150
        makeItem(200, 1), // 200
      ];
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.subtotal).toBe(450);
    });
  });

  describe("regra de frete grátis", () => {
    it("deve cobrar frete abaixo de R$299", () => {
      const items = [makeItem(100, 1)]; // subtotal = 100
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.hasFreeShipping).toBe(false);
      expect(result.current.shipping).toBe(19.9);
    });

    it("deve dar frete grátis acima de R$299", () => {
      const items = [makeItem(300, 1)]; // subtotal = 300
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.hasFreeShipping).toBe(true);
      expect(result.current.shipping).toBe(0);
    });

    it("deve dar frete grátis exatamente em R$299", () => {
      // Testa o edge case — o valor exato do threshold
      // Bugs costumam aparecer em valores de borda
      const items = [makeItem(299, 1)];
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.hasFreeShipping).toBe(true);
    });

    it("deve calcular o quanto falta para frete grátis", () => {
      const items = [makeItem(100, 1)]; // subtotal = 100
      const { result } = renderHook(() => useOrderSummary(items));

      // 299 - 100 = 199
      expect(result.current.amountToFreeShipping).toBe(199);
    });

    it("deve ter amountToFreeShipping zero quando já tem frete grátis", () => {
      const items = [makeItem(500, 1)];
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.amountToFreeShipping).toBe(0);
    });
  });

  describe("progresso para frete grátis", () => {
    it("deve calcular progresso corretamente", () => {
      // 150 / 299 * 100 ≈ 50.16%
      const items = [makeItem(150, 1)];
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.freeShippingProgress).toBeCloseTo(50.16, 1);
    });

    it("deve ter progresso máximo de 100", () => {
      // Mesmo com subtotal bem acima de 299, máximo é 100
      const items = [makeItem(1000, 1)];
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.freeShippingProgress).toBe(100);
    });
  });

  describe("total final", () => {
    it("deve somar subtotal e frete", () => {
      const items = [makeItem(100, 1)]; // subtotal = 100, frete = 19.90
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.total).toBeCloseTo(119.9);
    });

    it("deve ter total igual ao subtotal com frete grátis", () => {
      const items = [makeItem(300, 1)]; // frete grátis
      const { result } = renderHook(() => useOrderSummary(items));

      expect(result.current.total).toBe(300);
    });
  });
});
