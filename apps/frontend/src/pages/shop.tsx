import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useUser } from "../hooks/useUser";
import { useProducts } from "../hooks/useProducts";
import { useProductFilters } from "../hooks/useProductFilters";
import ProductGrid from "../components/shop/ProductGrid";
import SearchBar from "../components/shop/SearchBar";
import CategoryFilters from "../components/shop/CategoryFilters";
import SortSelect from "../components/shop/SortSelect";
import Pagination from "../components/shop/Pagination";
import CartDrawer from "../components/shop/CartDrawer";
import { ProductGridSkeleton } from "../components/ui/skeletons/ProductCardSkeleton";
import { useMemo } from "react";
import { SkeletonBox } from "../components/ui/Skeleton";

function HeroBanner({ userName }: { userName: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/15 mb-8">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #1a1400 50%, #0d0d1a 100%)",
        }}
      />
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-amber-400/10" />
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-amber-400/10" />

      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40"
          style={{ left: `${15 + i * 14}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="relative px-8 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs text-amber-400/60 tracking-widest mb-2"
          >
            BEM-VINDO DE VOLTA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-medium text-white"
          >
            Olá, <span className="text-amber-400">{userName}</span> 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/40 mt-2"
          >
            Explore nossa coleção premium de eletrônicos e gadgets
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-6 shrink-0"
        >
          {[
            { label: "Produtos", value: "100+" },
            { label: "Categorias", value: "8" },
            { label: "Ofertas", value: "12" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-medium text-amber-400">
                {stat.value}
              </p>
              <p className="text-xs text-white/30 tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Hero skeleton */}
        <div className="h-48 rounded-2xl skeleton-shimmer mb-8" />
        {/* Filtros skeleton */}
        <div className="flex gap-3 mb-6">
          {[...Array(5)].map((_, i) => (
            <SkeletonBox key={i} width={80} height={36} rounded="full" />
          ))}
        </div>
        {/* Grid skeleton com delay escalonado */}
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { checking } = useProtectedRoute();
  const user = useUser();
  const { products, loading, error } = useProducts();
  const {
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    sort,
    setSort,
    categories,
    paginated,
    total,
    page,
    setPage,
    totalPages,
  } = useProductFilters(products);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Contagem por categoria para exibir nas pills
  const categoryCounts = useMemo(() => {
    return products.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [products]);

  if (checking) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <HeroBanner userName={user?.name?.split(" ")[0] ?? "Cliente"} />

        {/* Barra de filtros */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <SearchBar
              value={search}
              onChange={setSearch}
              total={total}
              loading={loading}
            />

            {/* Contador de resultados */}
            <div className="flex items-center gap-3 sm:ml-auto">
              <AnimatePresence mode="wait">
                <motion.p
                  key={total}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="text-xs text-white/30 shrink-0"
                >
                  {loading
                    ? "Carregando..."
                    : `${total} produto${total !== 1 ? "s" : ""}`}
                </motion.p>
              </AnimatePresence>

              <SortSelect value={sort} onChange={setSort} />
            </div>
          </div>

          <CategoryFilters
            categories={categories}
            active={activeCategory}
            onChange={setActiveCategory}
            counts={categoryCounts}
          />
        </div>

        {/* Grid */}
        <ProductGrid
          products={paginated}
          loading={loading}
          error={error}
          onCartOpen={() => setCartDrawerOpen(true)}
        />

        <CartDrawer
          open={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
