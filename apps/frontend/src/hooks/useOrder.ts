/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";

// Tipos espelhando o backend — importante manter sincronizado
// com o schema do Prisma que definimos lá atrás
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number; // preço snapshottado no momento da compra
  product: {
    id: string;
    title: string;
    image: string;
  };
}

export interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

interface UseOrderReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Status finais — quando o pedido chega aqui,
// não precisamos mais fazer polling pois o status
// não vai mudar mais
const FINAL_STATUSES: OrderStatus[] = ["DELIVERED", "CANCELLED"];

// Intervalo do polling em ms
const POLLING_INTERVAL = 10000; // 10 segundos

export function useOrder(orderId: string | undefined): UseOrderReturn {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useRef para o intervalo do polling
  // Por que useRef? Porque o ID do intervalo é
  // infraestrutura — não precisamos re-renderizar
  // quando ele muda
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrder = useCallback(async () => {
    // Guarda obrigatório — não chama a API se não tem ID
    // No Next.js o query.id pode ser undefined na
    // primeira renderização (antes da hidratação)
    if (!orderId) return;

    try {
      const { data } = await api.get<Order>(`/orders/${orderId}`);
      setOrder(data);
      setError(null);

      // Para o polling se chegou em status final
      // Não tem sentido continuar chamando a API se
      // o pedido já foi entregue ou cancelado
      if (FINAL_STATUSES.includes(data.status)) {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      }
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response
        ?.status;

      if (status === 403) {
        setError("Você não tem permissão para ver este pedido");
      } else if (status === 404) {
        setError("Pedido não encontrado");
      } else {
        setError("Erro ao carregar pedido");
      }
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    // Busca imediatamente ao montar
    void fetchOrder();

    // Inicia polling para atualizar o status automaticamente
    // Útil quando o admin muda o status no painel
    pollingRef.current = setInterval(() => {
      void fetchOrder();
    }, POLLING_INTERVAL);

    // Cleanup — SEMPRE limpe intervalos no return do useEffect
    // Se não limpar, o intervalo continua rodando mesmo depois
    // do componente desmontar — isso é um memory leak
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [orderId, fetchOrder]);

  return { order, loading, error, refetch: fetchOrder };
}
