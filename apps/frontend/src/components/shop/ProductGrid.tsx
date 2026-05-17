import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import type { Product } from "../../hooks/useProducts";

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onCartOpen: () => void;
}

function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[.06] overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/[.04]" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-white/[.06] rounded-full w-3/4" />
        <div className="h-3 bg-white/[.06] rounded-full w-1/2" />
        <div className="flex justify-between items-center mt-2">
          <div className="h-6 bg-white/[.06] rounded w-20" />
          <div className="h-8 bg-white/[.06] rounded-xl w-24" />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({
  products,
  loading,
  error,
  onCartOpen,
}: ProductGridProps) {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <span className="text-4xl">⚠️</span>
        <p className="text-white/40 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-amber-400 border border-amber-400/30 px-4 py-2 rounded-lg hover:bg-amber-400/10 transition-colors"
        >
          Tentar novamente
        </button>
      </motion.div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 gap-4"
      >
        <span className="text-4xl">🔍</span>
        <p className="text-white/40 text-sm">Nenhum produto encontrado</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {loading
        ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
        : products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onCartOpen={onCartOpen}
            />
          ))}
    </div>
  );
}
