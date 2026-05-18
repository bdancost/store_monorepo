import type { OrderStatus } from "../../hooks/useOrder";

// Configuração centralizada de status
// Por que objeto e não switch/if?
// 1. Mais fácil de adicionar novos status
// 2. Dados e lógica separados
// 3. TypeScript garante que todos os status têm config
// Se esquecer de adicionar um status novo aqui,
// o TypeScript vai reclamar — segurança em compile time
const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    // Classes Tailwind separadas em vez de template string
    // para o Tailwind não purgar as classes em produção
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotColor: string;
    icon: string;
  }
> = {
  PENDING: {
    label: "Aguardando pagamento",
    bgClass: "bg-yellow-400/10",
    textClass: "text-yellow-400",
    borderClass: "border-yellow-400/20",
    dotColor: "#facc15",
    icon: "⏳",
  },
  PAID: {
    label: "Pagamento confirmado",
    bgClass: "bg-blue-400/10",
    textClass: "text-blue-400",
    borderClass: "border-blue-400/20",
    dotColor: "#60a5fa",
    icon: "✅",
  },
  SHIPPED: {
    label: "Em transporte",
    bgClass: "bg-purple-400/10",
    textClass: "text-purple-400",
    borderClass: "border-purple-400/20",
    dotColor: "#c084fc",
    icon: "🚚",
  },
  DELIVERED: {
    label: "Entregue",
    bgClass: "bg-green-400/10",
    textClass: "text-green-400",
    borderClass: "border-green-400/20",
    dotColor: "#4ade80",
    icon: "📦",
  },
  CANCELLED: {
    label: "Cancelado",
    bgClass: "bg-red-400/10",
    textClass: "text-red-400",
    borderClass: "border-red-400/20",
    dotColor: "#f87171",
    icon: "❌",
  },
};

interface StatusBadgeProps {
  status: OrderStatus;
  // showIcon permite usar o badge em contextos
  // onde o ícone seria poluição visual (tabelas densas)
  showIcon?: boolean;
}

export default function StatusBadge({
  status,
  showIcon = true,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
    >
      {/* Dot animado — pulsa apenas em status ativos (não finais) */}
      {status !== "DELIVERED" && status !== "CANCELLED" && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0"
          style={{ background: config.dotColor }}
        />
      )}

      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </span>
  );
}
