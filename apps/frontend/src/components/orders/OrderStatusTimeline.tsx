import { motion } from "framer-motion";
import type { OrderStatus } from "../../hooks/useOrder";

// Configuração da timeline — dados separados da lógica visual
// Se precisar adicionar um novo status, só adiciona aqui
const STEPS: {
  status: OrderStatus;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    status: "PENDING",
    label: "Pedido recebido",
    icon: "📋",
    description: "Aguardando confirmação de pagamento",
  },
  {
    status: "PAID",
    label: "Pagamento confirmado",
    icon: "✅",
    description: "Seu pedido está sendo preparado",
  },
  {
    status: "SHIPPED",
    label: "Em transporte",
    icon: "🚚",
    description: "Seu pedido está a caminho",
  },
  {
    status: "DELIVERED",
    label: "Entregue",
    icon: "📦",
    description: "Pedido entregue com sucesso",
  },
];

// Índice do status atual na timeline
// CANCELLED é tratado separadamente pois não é
// uma etapa do fluxo normal
function getStatusIndex(status: OrderStatus): number {
  const index = STEPS.findIndex((s) => s.status === status);
  return index === -1 ? 0 : index;
}

interface OrderStatusTimelineProps {
  status: OrderStatus;
}

export default function OrderStatusTimeline({
  status,
}: OrderStatusTimelineProps) {
  const isCancelled = status === "CANCELLED";
  const currentIndex = getStatusIndex(status);

  if (isCancelled) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-red-500/20 bg-red-500/10"
      >
        <span className="text-2xl">❌</span>
        <div>
          <p className="text-sm font-medium text-red-400">Pedido cancelado</p>
          <p className="text-xs text-red-400/60 mt-0.5">
            Este pedido foi cancelado
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step.status} className="flex gap-4">
            {/* Coluna da linha vertical + ícone */}
            <div className="flex flex-col items-center">
              {/* Círculo do status */}
              <motion.div
                initial={isCurrent ? { scale: 0 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: index * 0.1 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-base shrink-0 border-2 ${
                  isCompleted
                    ? "border-amber-400 bg-amber-400/20"
                    : isCurrent
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-white/10 bg-transparent"
                }`}
              >
                {isCompleted ? (
                  // Checkmark animado para etapas concluídas
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-amber-400 text-sm"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span
                    className={isPending ? "opacity-25 text-sm" : "text-base"}
                  >
                    {step.icon}
                  </span>
                )}
              </motion.div>

              {/* Linha conectora entre etapas */}
              {index < STEPS.length - 1 && (
                <motion.div
                  className="w-px flex-1 my-1"
                  style={{
                    background: isCompleted
                      ? "linear-gradient(180deg, #d4af37, #d4af37)"
                      : "rgba(255,255,255,0.06)",
                    minHeight: "24px",
                  }}
                />
              )}
            </div>

            {/* Conteúdo da etapa */}
            <div className="pb-6 flex-1">
              <p
                className={`text-sm font-medium ${
                  isPending ? "text-white/25" : "text-white/80"
                }`}
              >
                {step.label}
                {/* Badge "Atual" na etapa corrente */}
                {isCurrent && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30"
                  >
                    atual
                  </motion.span>
                )}
              </p>
              <p
                className={`text-xs mt-0.5 ${
                  isPending ? "text-white/15" : "text-white/35"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
