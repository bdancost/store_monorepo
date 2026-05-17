import { useState } from "react";
import { motion } from "framer-motion";
import { useCartContext } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import api from "../../services/api";
import type { Product } from "../../hooks/useProducts";

interface ProductCardProps {
  product: Product;
  index: number;
  onCartOpen: () => void;
}

export default function ProductCard({
  product,
  index,
  onCartOpen,
}: ProductCardProps) {
  const { refetch } = useCartContext();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  async function handleAddToCart() {
    setAdding(true);
    try {
      await api.post("/cart/add", { productId: product.id, quantity: 1 });
      await refetch();
      setAdded(true);
      showToast(`${product.title.slice(0, 30)}... adicionado!`);
      setTimeout(() => {
        setAdded(false);
        onCartOpen(); // abre o drawer após 600ms
      }, 600);
    } catch {
      showToast("Erro ao adicionar ao carrinho", "error");
    } finally {
      setAdding(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col rounded-2xl border border-white/[.06] bg-gradient-to-b from-white/[.04] to-transparent overflow-hidden transition-all duration-300 hover:border-amber-400/30"
    >
      {/* Imagem */}
      <div className="relative overflow-hidden bg-white/[.03] aspect-square">
        <motion.img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23111"%2F%3E%3C%2Fsvg%3E';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="text-[10px] px-2 py-1 rounded-full bg-black/60 text-amber-400/70 border border-amber-400/20 tracking-wide backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="text-sm font-medium text-white/80 leading-snug line-clamp-2 group-hover:text-white transition-colors">
          {product.title}
        </h3>

        <div className="flex items-center justify-between mt-auto gap-2">
          <div>
            <p className="text-xs text-white/30 mb-0.5">Preço</p>
            <p className="text-lg font-medium text-amber-400">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <motion.button
            onClick={() => void handleAddToCart()}
            disabled={adding}
            whileTap={{ scale: 0.92 }}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
              added
                ? "bg-green-500/20 border border-green-500/40 text-green-400"
                : "bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black"
            }`}
          >
            {adding ? "..." : added ? "✓ Adicionado" : "+ Carrinho"}
          </motion.button>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #d4af37, transparent)",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        whileHover={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
