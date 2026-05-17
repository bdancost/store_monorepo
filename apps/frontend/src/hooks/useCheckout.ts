import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import api from "../services/api";
import { useCartContext } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

// Máquina de estados do checkout
// Por que um tipo e não boolean?
// 'loading' não diz ONDE está carregando.
// Com um tipo explícito, cada estado tem significado
// claro e você pode exibir mensagens diferentes para
// cada um — UX muito melhor
type CheckoutStatus = "idle" | "loading" | "success" | "error";

interface UseCheckoutReturn {
  status: CheckoutStatus;
  handleCheckout: () => Promise<void>;
}

export function useCheckout(): UseCheckoutReturn {
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const router = useRouter();
  const { refetch } = useCartContext();
  const { showToast } = useToast();

  const handleCheckout = useCallback(async () => {
    // Evita duplo clique — se já está processando, ignora
    // Isso é importante em mobile onde o usuário pode
    // tocar duas vezes sem querer
    if (status === "loading") return;

    setStatus("loading");

    try {
      // Chama o endpoint POST /orders que criamos no backend
      // Esse endpoint: busca o carrinho, cria o Order com
      // snapshot de preço e limpa o carrinho automaticamente
      const { data } = await api.post<{ id: string }>("/orders");

      setStatus("success");

      // Sincroniza o CartContext — o carrinho foi limpo
      // no backend, precisamos refletir isso no frontend
      // Se não fizer isso, o badge do header fica desatualizado
      await refetch();

      showToast("Pedido criado com sucesso! 🎉", "success");

      // Pequeno delay antes de redirecionar para o usuário
      // ver o feedback de sucesso
      setTimeout(() => {
        void router.push(`/orders/${data.id}`);
      }, 1200);
    } catch (err: unknown) {
      setStatus("error");

      // Tratamento de erro específico por código HTTP
      // axios coloca o status em err.response.status
      // Tratar erros específicos = UX muito melhor
      const status = (err as { response?: { status?: number } })?.response
        ?.status;

      if (status === 400) {
        showToast("Seu carrinho está vazio", "error");
      } else if (status === 401) {
        showToast("Sessão expirada, faça login novamente", "error");
        void router.push("/auth");
      } else {
        showToast("Erro ao finalizar pedido. Tente novamente", "error");
      }

      // Volta para idle após mostrar o erro
      // para o usuário poder tentar novamente
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [status, router, refetch, showToast]);

  return { status, handleCheckout };
}
