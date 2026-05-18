import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../../hooks/useProtectedRoute";
import { useOrders } from "../../hooks/useOrders";
import { useCancelOrder } from "../../hooks/useCancelOrder";
import OrderCard from "../../components/orders/OrderCard";
import CancelOrderModal from "../../components/orders/CancelOrderModal";

function OrdersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-28 rounded-2xl bg-white/[.04] border border-white/[.06] animate-pulse"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

function EmptyOrders() {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-5 text-center"
    >
      <motion.span
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

export default function OrdersPage() {
  const { checking } = useProtectedRoute();
  const { orders, loading, error, refetch } = useOrders();
  const router = useRouter();

  // Estado local do modal — só esta página precisa saber
  // se o modal está aberto e qual pedido está sendo cancelado
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // useCallback aqui porque é passado para useCancelOrder
  // como dependência — sem useCallback causaria loop
  const handleCancelSuccess = useCallback(async () => {
    await refetch();
    setModalOpen(false);
    setSelectedOrderId(null);
  }, [refetch]);

  const { cancellingId, cancelOrder } = useCancelOrder(handleCancelSuccess);

  // Abre o modal de confirmação com o ID do pedido selecionado
  // Não cancela diretamente — força confirmação do usuário
  function handleCancelRequest(orderId: string) {
    setSelectedOrderId(orderId);
    setModalOpen(true);
  }

  // Executado quando o usuário confirma no modal
  async function handleConfirmCancel() {
    if (!selectedOrderId) return;
    await cancelOrder(selectedOrderId);
  }

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

        {/* Estado de erro */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <span className="text-4xl">⚠️</span>
            <p className="text-white/40 text-sm">{error}</p>
            <button
              onClick={() => void refetch()}
              className="text-xs text-amber-400 border border-amber-400/30 px-4 py-2 rounded-lg hover:bg-amber-400/10 transition-colors"
            >
              Tentar novamente
            </button>
          </motion.div>
        )}

        {/* Conteúdo */}
        {!error && (
          <>
            {loading ? (
              <OrdersSkeleton />
            ) : orders.length === 0 ? (
              <EmptyOrders />
            ) : (
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
                      <OrderCard
                        order={order}
                        // Passa a função que ABRE O MODAL
                        // não a que cancela diretamente
                        onCancel={handleCancelRequest}
                        cancelling={cancellingId === order.id}
                      />
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </>
        )}
      </div>

      {/* Modal de confirmação — fora do container principal
          para garantir que o z-index funcione corretamente
          independente do contexto de empilhamento */}
      <CancelOrderModal
        open={modalOpen}
        orderId={selectedOrderId}
        onConfirm={() => void handleConfirmCancel()}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrderId(null);
        }}
        loading={cancellingId !== null}
      />
    </div>
  );
}
