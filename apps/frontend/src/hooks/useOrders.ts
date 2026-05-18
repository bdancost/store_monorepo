/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import type { Order } from "./useOrder";

interface UseOrdersReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useCallback aqui por dois motivos:
  // 1. A função é passada como retorno do hook (refetch)
  //    e precisa ter identidade estável para não causar
  //    re-renders desnecessários em quem a usa
  // 2. É usada como dependência do useEffect abaixo
  //    — sem useCallback, o useEffect rodaria infinitamente
  //    porque a função seria recriada a cada render
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<Order[]>("/orders");
      // Ordena por data decrescente — mais recente primeiro
      // Por que ordenar no frontend se o backend já ordena?
      // O backend ordena por createdAt desc, mas é uma boa
      // prática garantir a ordem no frontend também —
      // defensivo contra mudanças na API
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(sorted);
    } catch {
      setError("Erro ao carregar pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refetch: fetchOrders };
}
