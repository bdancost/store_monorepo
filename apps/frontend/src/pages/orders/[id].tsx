/* eslint-disable @next/next/no-img-element */
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { useOrder } from "../../hooks/useOrder";
import OrderStatusTimeline from "../../components/orders/OrderStatusTimeline";
import StatusBadge from "../../components/orders/StatusBadge";

// ─────────────────────────────────────────────
// Skeleton da página
// ─────────────────────────────────────────────
function OrderDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-32 rounded-2xl bg-white/[.04]" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-2xl bg-white/[.04]" />
        <div className="h-64 rounded-2xl bg-white/[.04]" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function OrderDetailPage() {
  const { checking } = useProtectedRoute();
  const router = useRouter();

  // Lendo o id dinâmico da URL
  // Por que string | undefined?
  // No Next.js Pages Router, query.id pode ser:
  // - undefined: antes da hidratação
  // - string: após hidratação com id válido
  // - string[]: se a rota for [...id].tsx (catch-all)
  // Precisamos garantir que é string antes de usar
  const orderId =
    typeof router.query.id === "string" ? router.query.id : undefined;

  const { order, loading, error } = useOrder(orderId);

  if (checking || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <span className="text-5xl">⚠️</span>
          <p className="text-white/60 text-sm">{error}</p>
          <button
            onClick={() => void router.push("/shop")}
            className="text-xs text-amber-400 border border-amber-400/30 px-4 py-2 rounded-lg hover:bg-amber-400/10 transition-colors"
          >
            Voltar para a loja
          </button>
        </motion.div>
      </div>
    );
  }

  if (!order) return null;

  const createdAt = new Date(order.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Banner de confirmação */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-amber-400/15 p-8 mb-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, #0d0d1a 0%, #1a1400 50%, #0d0d1a 100%)",
          }}
        >
          {/* Partículas de celebração */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>

          <h1 className="text-2xl font-medium text-white mb-2">
            Pedido confirmado!
          </h1>
          <p className="text-sm text-white/40 mb-4">
            Seu pedido foi recebido e está sendo processado
          </p>

          {/* ID do pedido — truncado para não quebrar layout */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[.05] border border-white/[.08]">
            <span className="text-xs text-white/40">Pedido</span>
            <span className="text-xs font-medium text-amber-400 font-mono">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          <p className="text-xs text-white/25 mt-3">{createdAt}</p>
          <div className="mt-4 flex justify-center">
            <StatusBadge status={order.status} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timeline de status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6"
          >
            <h2 className="text-sm font-medium text-white/60 mb-6 tracking-wide">
              STATUS DO PEDIDO
            </h2>
            <OrderStatusTimeline status={order.status} />
          </motion.div>

          {/* Itens do pedido */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6"
          >
            <h2 className="text-sm font-medium text-white/60 mb-4 tracking-wide">
              ITENS DO PEDIDO
            </h2>

            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-2 border-b border-white/[.04] last:border-0"
                >
                  {/* Imagem */}
                  <div className="w-12 h-12 rounded-lg bg-white/[.04] flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 line-clamp-2 leading-snug">
                      {item.product.title}
                    </p>
                    <p className="text-[10px] text-white/30 mt-0.5">
                      Qtd: {item.quantity}
                    </p>
                  </div>

                  {/* Preço snapshottado */}
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-amber-400">
                      {(item.price * item.quantity).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                    <p className="text-[10px] text-white/25">
                      {item.price.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}{" "}
                      × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[.06]">
              <span className="text-sm text-white/50">Total pago</span>
              <span className="text-base font-medium text-amber-400">
                {order.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mt-6"
        >
          <button
            onClick={() => void router.push("/shop")}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-black"
            style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
          >
            Continuar comprando →
          </button>
          <button
            onClick={() => void router.push("/orders")}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80 transition-colors"
          >
            Ver todos os pedidos
          </button>
        </motion.div>
      </div>
    </div>
  );
}
