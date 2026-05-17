import { useState, useRef, useCallback } from "react";
import api from "../services/api";

interface UseCartItemProps {
  itemId: string;
  initialQuantity: number;
  onSync: () => Promise<void>; // refetch do contexto global
  onError: (msg: string) => void;
}

interface UseCartItemReturn {
  quantity: number;
  updating: boolean;
  increment: () => void;
  decrement: () => void;
}

export function useCartItem({
  itemId,
  initialQuantity,
  onSync,
  onError,
}: UseCartItemProps): UseCartItemReturn {
  // Estado local da quantidade — começa com o valor da API
  // Por que estado LOCAL e não direto no contexto?
  // Porque queremos atualizar a tela ANTES da API responder
  // (Optimistic UI). O contexto global é atualizado depois,
  // quando o debounce dispara e a API confirma.
  const [quantity, setQuantity] = useState(initialQuantity);
  const [updating, setUpdating] = useState(false);

  // useRef para o timer do debounce
  // Por que useRef e não useState para o timer?
  // Porque mudar o timer NÃO deve causar re-render.
  // useRef persiste o valor entre renders sem disparar
  // nova renderização — perfeito para timers e valores
  // que são "infraestrutura", não "dados visuais".
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ref que guarda o valor ANTERIOR para reverter em caso de erro
  // Padrão comum em Optimistic UI: salve o estado anterior
  // antes de aplicar a mudança otimista
  const previousQuantity = useRef(initialQuantity);

  const updateAPI = useCallback(
    async (newQuantity: number) => {
      setUpdating(true);
      try {
        await api.patch(`/cart/item/${itemId}`, { quantity: newQuantity });
        // Sincroniza o contexto global APÓS a API confirmar
        // Isso atualiza o badge do header e o total
        await onSync();
        // Agora que a API confirmou, atualiza o "anterior"
        previousQuantity.current = newQuantity;
      } catch {
        // REVERTER: API falhou, volta para o valor anterior
        // É aqui que o Optimistic UI se diferencia:
        // o usuário vê a tela reverter com uma mensagem de erro
        setQuantity(previousQuantity.current);
        onError("Erro ao atualizar quantidade");
      } finally {
        setUpdating(false);
      }
    },
    [itemId, onSync, onError],
  );

  const scheduleUpdate = useCallback(
    (newQuantity: number) => {
      // Limpa o timer anterior se existir
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      // Agenda a chamada à API com 600ms de delay
      // Se o usuário clicar de novo antes de 600ms,
      // o timer é reiniciado — só uma chamada no final
      debounceTimer.current = setTimeout(() => {
        void updateAPI(newQuantity);
      }, 600);
    },
    [updateAPI],
  );

  const increment = useCallback(() => {
    const newQty = quantity + 1;
    // 1. Atualiza a tela imediatamente (Optimistic UI)
    setQuantity(newQty);
    // 2. Agenda a chamada à API com debounce
    scheduleUpdate(newQty);
  }, [quantity, scheduleUpdate]);

  const decrement = useCallback(() => {
    // Mínimo de 1 — não deixa zerar pela atualização
    // Para remover o item existe o botão de remover
    if (quantity <= 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    scheduleUpdate(newQty);
  }, [quantity, scheduleUpdate]);

  return { quantity, updating, increment, decrement };
}
