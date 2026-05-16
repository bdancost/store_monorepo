import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useCartContext } from "../../contexts/CartContext";

export default function CartButton() {
  const { itemCount, loading } = useCartContext();
  const router = useRouter();
  const prevCount = useRef(itemCount);

  // Referência para disparar animação apenas quando count muda
  const didChange = prevCount.current !== itemCount;
  useEffect(() => {
    prevCount.current = itemCount;
  }, [itemCount]);

  return (
    <motion.button
      onClick={() => void router.push("/cart")}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-amber-400/20 bg-white/[.04] hover:border-amber-400/50 transition-colors"
      aria-label="Ver carrinho"
    >
      {/* Ícone carrinho */}
      <span className="text-lg">🛒</span>

      {/* Badge com quantidade */}
      <AnimatePresence>
        {!loading && itemCount > 0 && (
          <motion.div
            key={itemCount}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: didChange ? [1, 1.4, 1] : 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-medium text-black"
            style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse ring quando muda */}
      <AnimatePresence>
        {didChange && itemCount > 0 && (
          <motion.div
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-xl border border-amber-400/50"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
