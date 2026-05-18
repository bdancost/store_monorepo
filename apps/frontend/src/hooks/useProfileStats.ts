import { useMemo } from "react";
import type { Order } from "./useOrder";

interface ProfileStats {
  totalOrders: number;
  totalSpent: number;
  deliveredOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  mostExpensiveOrder: Order | null;
  averageOrderValue: number;
}

export function useProfileStats(orders: Order[]): ProfileStats {
  return useMemo(() => {
    // Todos os cálculos são derivados de orders
    // nenhum useState necessário — derived state puro

    const totalOrders = orders.length;

    // reduce: padrão funcional para acumular valores
    // muito mais legível que um loop for com variável externa
    const totalSpent = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + o.total, 0);

    const deliveredOrders = orders.filter(
      (o) => o.status === "DELIVERED",
    ).length;

    const cancelledOrders = orders.filter(
      (o) => o.status === "CANCELLED",
    ).length;

    const pendingOrders = orders.filter(
      (o) =>
        o.status === "PENDING" || o.status === "PAID" || o.status === "SHIPPED",
    ).length;

    // Pedido mais caro — reduce retorna o acumulador
    // quando o array é vazio, retorna null (sem pedidos)
    const mostExpensiveOrder =
      orders.length > 0
        ? orders.reduce((max, o) => (o.total > max.total ? o : max), orders[0])
        : null;

    // Média de valor dos pedidos não cancelados
    const validOrders = orders.filter((o) => o.status !== "CANCELLED");
    const averageOrderValue =
      validOrders.length > 0 ? totalSpent / validOrders.length : 0;

    return {
      totalOrders,
      totalSpent,
      deliveredOrders,
      cancelledOrders,
      pendingOrders,
      mostExpensiveOrder,
      averageOrderValue,
    };
  }, [orders]);
}
