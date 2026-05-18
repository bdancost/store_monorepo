import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { useOrders } from "../../hooks/useOrders";
import OrderCard from "../../components/orders/OrderCard";

// ─────────────────────────────────────────────
// Skeleton de listagem
// Reproduz o layout dos cards para minimizar
// o layout shift (mudança de layout ao carregar)
// Layout shift é medido pelo Google no Core Web Vitals
// — afeta SEO e percepção de qualidade do site
// ─────────────────────────────────────────────
function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-white/[.04] border border-white/[.06] animate-pulse"
          // Delay escalonado no skeleton — parece
          // que os cards estão carregando em cascata
          // pequeno detalhe que melhora muito a percepção
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyOrders() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <motion.span
        // Animação de balanço para chamar atenção
        // sem ser intrusivo
        animate={{ rotate: [0, -5, 5, -5, 0] }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-6xl"
      >
        📦
      </motion.span>
      <div>
        <h2 className="text-xl font-medium text-white">Nenhum pedido ainda</h2>
        <p className="text-sm text-white/40 mt-2 max-w-xs">
          Quando você finalizar uma compra, seus pedidos aparecem aqui
        </p>
      </div>

      {/* Call-to-action claro — nunca deixe o usuário sem direção */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => void router.push("/shop")}
        className="px-6 py-3 rounded-xl text-sm font-medium text-black"
        style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
      >
        Explorar produtos →
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function OrdersPage() {
  const { checking } = useProtectedRoute();
  const { orders, loading, error, refetch } = useOrders();
  const router = useRouter();

  if (checking) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-medium text-white">Meus pedidos</h1>
            {/* Contador de pedidos — só exibe quando carregou */}
            {!loading && orders.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-white/30 mt-1"
              >
                {orders.length}{" "}
                {orders.length === 1
                  ? "pedido encontrado"
                  : "pedidos encontrados"}
              </motion.p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => void router.push("/shop")}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            ← Voltar à loja
          </motion.button>
        </motion.div>

        {/* Estado de erro com retry */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <span className="text-4xl">⚠️</span>
            <p className="text-white/40 text-sm">{error}</p>
            {/* Retry — usuário pode tentar novamente sem recarregar a página */}
            <button
              onClick={() => void refetch()}
              className="text-xs text-amber-400 border border-amber-400/30 px-4 py-2 rounded-lg hover:bg-amber-400/10 transition-colors"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}

        {/* Conteúdo principal */}
        {!error && (
          <>
            {loading ? (
              <OrdersSkeleton />
            ) : orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              // AnimatePresence para animar entrada dos cards
              // e remoção quando um pedido é cancelado
              <AnimatePresence mode="popLayout">
                <div className="flex flex-col gap-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <OrderCard order={order} />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>
    </div>
  );
}
