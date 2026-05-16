import { motion } from "framer-motion";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useUser } from "../hooks/useUser";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/shop/ProductGrid";

function HeroBanner({ userName }: { userName: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-400/15 mb-8">
      {/* Fundo com gradiente */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #1a1400 50%, #0d0d1a 100%)",
        }}
      />

      {/* Círculos decorativos */}
      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-amber-400/10" />
      <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-amber-400/10" />
      <div className="absolute right-32 -bottom-12 w-48 h-48 rounded-full border border-amber-400/5" />

      {/* Partículas decorativas */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/40"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{ y: [0, -12, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Conteúdo */}
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

        {/* Stats rápidos */}
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
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-8 max-w-7xl mx-auto animate-pulse">
      <div className="h-40 rounded-2xl bg-white/[.04] mb-8" />
      <div className="flex gap-3 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-white/[.04]" />
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-white/[.04]" />
        ))}
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { checking } = useProtectedRoute();
  const user = useUser();
  const { products, loading, error } = useProducts();

  if (checking) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <HeroBanner userName={user?.name?.split(" ")[0] ?? "Cliente"} />

        {/* Cabeçalho da seção */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-white">
              Todos os produtos
            </h2>
            <p className="text-xs text-white/30 mt-0.5">
              {loading
                ? "Carregando..."
                : `${products.length} produtos encontrados`}
            </p>
          </div>
        </div>

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
}
