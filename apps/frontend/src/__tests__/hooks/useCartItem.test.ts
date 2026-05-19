import { renderHook, act } from "@testing-library/react";

// Mock do módulo de API
jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

import api from "../../services/api";
import { useCartItem } from "../../hooks/useCartItem";

const mockedApi = api as jest.Mocked<typeof api>;

describe("useCartItem", () => {
  const onSync = jest.fn().mockResolvedValue(undefined);
  const onError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("deve inicializar com a quantidade inicial", () => {
    const { result } = renderHook(() =>
      useCartItem({
        itemId: "item-1",
        initialQuantity: 3,
        onSync,
        onError,
      }),
    );

    expect(result.current.quantity).toBe(3);
    expect(result.current.updating).toBe(false);
  });

  describe("increment", () => {
    it("deve incrementar quantidade imediatamente (Optimistic UI)", () => {
      const { result } = renderHook(() =>
        useCartItem({
          itemId: "item-1",
          initialQuantity: 2,
          onSync,
          onError,
        }),
      );

      act(() => {
        result.current.increment();
      });

      expect(result.current.quantity).toBe(3);
    });

    it("deve chamar a API após o debounce de 600ms", async () => {
      mockedApi.patch.mockResolvedValue({ data: {} });

      const { result } = renderHook(() =>
        useCartItem({
          itemId: "item-1",
          initialQuantity: 2,
          onSync,
          onError,
        }),
      );

      act(() => {
        result.current.increment();
      });

      expect(mockedApi.patch).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(600);
      });

      expect(mockedApi.patch).toHaveBeenCalledWith("/cart/item/item-1", {
        quantity: 3,
      });
    });

    it("deve agrupar múltiplos cliques em uma chamada", async () => {
      mockedApi.patch.mockResolvedValue({ data: {} });

      const { result } = renderHook(() =>
        useCartItem({
          itemId: "item-1",
          initialQuantity: 1,
          onSync,
          onError,
        }),
      );

      // Simula múltiplos cliques rápidos dentro do act
      act(() => {
        result.current.increment();
      });

      // Clica a segunda vez (2 -> 3)
      act(() => {
        result.current.increment();
      });

      // Clica a terceira vez (3 -> 4)
      act(() => {
        result.current.increment();
      });

      // Avança o cronômetro do Jest para disparar o debounce
      await act(async () => {
        jest.advanceTimersByTime(600);
      });

      // Validações finais de estado e requisição
      expect(result.current.quantity).toBe(4);
      expect(mockedApi.patch).toHaveBeenCalledTimes(1);
      expect(mockedApi.patch).toHaveBeenCalledWith("/cart/item/item-1", {
        quantity: 4,
      });
    });
  });

  describe("decrement", () => {
    it("não deve decrementar abaixo de 1", () => {
      const { result } = renderHook(() =>
        useCartItem({
          itemId: "item-1",
          initialQuantity: 1,
          onSync,
          onError,
        }),
      );

      act(() => {
        result.current.decrement();
      });

      expect(result.current.quantity).toBe(1);
      expect(mockedApi.patch).not.toHaveBeenCalled();
    });

    it("deve decrementar corretamente acima de 1", () => {
      const { result } = renderHook(() =>
        useCartItem({
          itemId: "item-1",
          initialQuantity: 3,
          onSync,
          onError,
        }),
      );

      act(() => {
        result.current.decrement();
      });

      expect(result.current.quantity).toBe(2);
    });
  });

  describe("Optimistic UI — reverter em caso de erro", () => {
    it("deve reverter para quantidade anterior se a API falhar", async () => {
      mockedApi.patch.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() =>
        useCartItem({
          itemId: "item-1",
          initialQuantity: 2,
          onSync,
          onError,
        }),
      );

      act(() => {
        result.current.increment();
      });

      expect(result.current.quantity).toBe(3);

      await act(async () => {
        jest.advanceTimersByTime(600);
      });

      expect(result.current.quantity).toBe(2);
      expect(onError).toHaveBeenCalledWith("Erro ao atualizar quantidade");
    });
  });
});
