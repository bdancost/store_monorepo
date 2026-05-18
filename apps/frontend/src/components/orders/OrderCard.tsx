/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import type { Order } from "../../hooks/useOrder";
import StatusBadge from "./StatusBadge";

interface OrderCardProps {
  order: Order;
  // onCancel é opcional — o card é usado em dois contextos:
  // listagem (com cancelar) e futuramente em outros lugares
  // sem o botão de cancelar
  onCancel?: (orderId: string) => void;
  cancelling?: boolean;
}

export default function OrderCard({
  order,
  onCancel,
  cancelling = false,
}: OrderCardProps) {
  const router = useRouter();

  // Formatação de data — extraída como função local
  // porque é usada apenas nesse componente
  // Se fosse usada em 3+ componentes, iria para utils/format.ts
  const formattedDate = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Conta total de itens somando quantidades
  // Por que não usar order.items.length?
  // Porque length conta linhas únicas de produto,
  // não a quantidade total. 2x iPhone = 1 item, não 2.
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Pedido pode ser cancelado apenas se PENDING ou PAID
  // Regra de negócio espelhada do backend — duplicação intencional
  // Por que duplicar no frontend?
  // Para esconder o botão antes mesmo de chamar a API.
  // UX: não mostrar opções que o usuário não pode usar.
  const canCancel =
    onCancel && (order.status === "PENDING" || order.status === "PAID");

  return (
    <motion.div
      layout
      whileHover={{ borderColor: "rgba(212,175,55,0.25)" }}
      className="rounded-2xl border border-white/[.06] bg-white/[.02] overflow-hidden transition-colors"
    >
      {/* Cabeçalho do card — informações primárias */}
      <div
        // Clicável para ir ao detalhe do pedido
        onClick={() => void router.push(`/orders/${order.id}`)}
        className="flex items-start justify-between gap-4 p-5 cursor-pointer group"
      >
        <div className="flex flex-col gap-2 min-w-0">
          {/* ID + data na mesma linha */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono font-medium text-amber-400">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="text-xs text-white/25">{formattedDate}</span>
          </div>

          {/* Badge de status — componente reutilizável */}
          <StatusBadge status={order.status} />

          {/* Resumo de itens */}
          <p className="text-xs text-white/30">
            {totalItems} {totalItems === 1 ? "item" : "itens"}
            {" · "}
            {/* Preview dos primeiros produtos — truncado */}
            {order.items
              .slice(0, 2)
              .map((i) => i.product.title.split(" ").slice(0, 2).join(" "))
              .join(", ")}
            {order.items.length > 2 && ` +${order.items.length - 2}`}
          </p>
        </div>

        {/* Total + seta de navegação */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-base font-medium text-amber-400">
            {order.total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </p>

          {/* Seta aparece no hover — indica que é clicável */}
          <motion.span
            initial={{ x: 0, opacity: 0.3 }}
            whileHover={{ x: 4, opacity: 1 }}
            className="text-white/30 text-sm group-hover:text-amber-400/60 transition-colors"
          >
            →
          </motion.span>
        </div>
      </div>

      {/* Preview de imagens dos produtos */}
      <div className="px-5 pb-4 flex items-center justify-between gap-4">
        {/* Stack de imagens dos produtos */}
        <div className="flex items-center">
          {order.items.slice(0, 4).map((item, index) => (
            <div
              key={item.id}
              // Overlap negativo — as imagens se sobrepõem
              // criando efeito de "stack"
              // z-index decrescente para as primeiras ficarem na frente
              style={{
                marginLeft: index === 0 ? 0 : -8,
                zIndex: order.items.length - index,
                position: "relative",
              }}
              className="w-8 h-8 rounded-lg bg-white/[.06] border border-white/[.08] flex items-center justify-center overflow-hidden shrink-0"
            >
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}

          {/* +N quando há mais de 4 produtos */}
          {order.items.length > 4 && (
            <div
              style={{ marginLeft: -8, zIndex: 0, position: "relative" }}
              className="w-8 h-8 rounded-lg bg-white/[.08] border border-white/[.08] flex items-center justify-center"
            >
              <span className="text-[9px] text-white/40">
                +{order.items.length - 4}
              </span>
            </div>
          )}
        </div>

        {/* Botão cancelar — só aparece quando possível */}
        {canCancel && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.93 }}
            // stopPropagation evita que o clique no botão
            // também dispare o onClick do card (navegação)
            // Sem isso, clicar em "Cancelar" também abriria
            // a página de detalhes — bug clássico de event bubbling
            onClick={(e) => {
              e.stopPropagation();
              onCancel(order.id);
            }}
            disabled={cancelling}
            className="text-xs text-red-400/50 hover:text-red-400 border border-red-400/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          >
            {cancelling ? "Cancelando..." : "Cancelar pedido"}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
