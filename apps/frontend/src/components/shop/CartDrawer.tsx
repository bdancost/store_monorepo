/* eslint-disable @next/next/no-img-element */
import { motion, AnimatePresence } from "framer-motion";
import { useCartContext } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { useRouter } from "next/router";
import api from "../../services/api";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { cart, total, itemCount, refetch } = useCartContext();
  const { showToast } = useToast();
  const router = useRouter();

  async function handleRemove(cartItemId: string) {
    try {
      await api.delete(`/cart/item/${cartItemId}`);
      await refetch();
      showToast("Item removido do carrinho", "info");
    } catch {
      showToast("Erro ao remover item", "error");
    }
  }

  async function handleCheckout() {
    onClose();
    await router.push("/cart");
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-80 flex flex-col border-l border-amber-400/10"
            style={{ background: "rgba(10,10,20,0.98)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[.06]">
              <div>
                <h2 className="text-base font-medium text-white">
                  Meu carrinho
                </h2>
                <p className="text-xs text-white/30 mt-0.5">
                  {itemCount} {itemCount === 1 ? "item" : "itens"}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
              >
                ✕
              </motion.button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-3">
              <AnimatePresence>
                {!cart || cart.items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-48 gap-3"
                  >
                    <span className="text-4xl">🛒</span>
                    <p className="text-sm text-white/30">Carrinho vazio</p>
                  </motion.div>
                ) : (
                  cart.items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-white/[.03] transition-colors group"
                    >
                      {/* Imagem */}
                      <div className="w-14 h-14 rounded-xl bg-white/[.04] border border-white/[.06] flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 line-clamp-2 leading-snug">
                          {item.product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-amber-400 font-medium">
                            {item.product.price.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                          <span className="text-xs text-white/20">
                            ×{item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remover */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => void handleRemove(item.id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        aria-label="Remover item"
                      >
                        🗑️
                      </motion.button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {cart && cart.items.length > 0 && (
              <div className="px-5 py-4 border-t border-white/[.06]">
                {/* Total */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-lg font-medium text-amber-400">
                    {total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>

                {/* Botão checkout */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => void handleCheckout()}
                  className="w-full py-3 rounded-xl text-sm font-medium text-black transition-opacity hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #b8960c)",
                  }}
                >
                  Finalizar compra →
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
