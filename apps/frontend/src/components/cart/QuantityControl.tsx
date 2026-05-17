import { motion } from "framer-motion";
import { useCartItem } from "../../hooks/useCartItem";
import { useCartContext } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";

interface QuantityControlProps {
  itemId: string;
  initialQuantity: number;
}

export default function QuantityControl({
  itemId,
  initialQuantity,
}: QuantityControlProps) {
  const { refetch } = useCartContext();
  const { showToast } = useToast();

  const { quantity, updating, increment, decrement } = useCartItem({
    itemId,
    initialQuantity,
    onSync: refetch,
    onError: showToast,
  });

  return (
    <div className="flex items-center gap-1">
      {/* Botão decrementar */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={decrement}
        disabled={quantity <= 1 || updating}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[.08] text-white/50 hover:border-amber-400/40 hover:text-amber-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm"
        aria-label="Diminuir quantidade"
      >
        −
      </motion.button>

      {/* Quantidade — AnimatePresence para animar troca de número */}
      <div className="w-8 flex items-center justify-center relative overflow-hidden">
        {updating ? (
          // Indicador sutil de loading durante a chamada à API
          // Pequeno ponto pulsando — não bloqueia a UI
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
          />
        ) : (
          <motion.span
            // key muda quando quantity muda, disparando a animação
            key={quantity}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-sm font-medium text-white tabular-nums"
          >
            {quantity}
          </motion.span>
        )}
      </div>

      {/* Botão incrementar */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={increment}
        disabled={updating}
        className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[.08] text-white/50 hover:border-amber-400/40 hover:text-amber-400 disabled:opacity-25 disabled:cursor-not-allowed transition-colors text-sm"
        aria-label="Aumentar quantidade"
      >
        +
      </motion.button>
    </div>
  );
}
