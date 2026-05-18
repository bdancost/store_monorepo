import { useState, useCallback } from "react";
import api from "../services/api";
import { useToast } from "../contexts/ToastContext";

interface UseCancelOrderReturn {
  // ID do pedido sendo cancelado no momento
  // null = nenhum pedido sendo cancelado
  cancellingId: string | null;
  cancelOrder: (orderId: string) => Promise<void>;
}

export function useCancelOrder(
  // Callback chamado após cancelamento bem-sucedido
  // Permite que a página de listagem atualize os dados
  // Por que callback e não retornar algo?
  // Porque o hook não sabe como a página quer reagir
  // ao sucesso — pode ser refetch, pode ser redirect
  // Inversão de controle: o hook executa, a página decide o que fazer depois
  onSuccess: () => Promise<void>,
): UseCancelOrderReturn {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const cancelOrder = useCallback(
    async (orderId: string) => {
      // Guarda qual pedido está sendo cancelado
      // para o botão correto mostrar "Cancelando..."
      setCancellingId(orderId);

      try {
        await api.patch(`/orders/${orderId}/cancel`);

        showToast("Pedido cancelado com sucesso", "info");

        // Chama o callback de sucesso — a página decide
        // se vai fazer refetch, redirect, etc
        await onSuccess();
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response
          ?.status;

        if (status === 400) {
          showToast("Este pedido não pode mais ser cancelado", "error");
        } else if (status === 403) {
          showToast(
            "Você não tem permissão para cancelar este pedido",
            "error",
          );
        } else {
          showToast("Erro ao cancelar pedido", "error");
        }
      } finally {
        // Sempre limpa o ID — independente de sucesso ou erro
        setCancellingId(null);
      }
    },
    [onSuccess, showToast],
  );

  return { cancellingId, cancelOrder };
}
