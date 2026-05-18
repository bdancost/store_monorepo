/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/shop/ProductGrid";

// Simula produtos em oferta — os mais baratos com desconto fake
// Em produção viria de um campo discount no backend
const DISCOUNT_TIERS = [
  { min: 0, max: 50, discount: 30, label: "30% OFF" },
  { min: 50, max: 200, discount: 20, label: "20% OFF" },
  { min: 200, max: Infinity, discount: 15, label: "15% OFF" },
];

function getDiscount(price: number) {
  return (
    DISCOUNT_TIERS.find((t) => price >= t.min && price < t.max) ??
    DISCOUNT_TIERS[0]
  );
}

// Contador regressivo — cria urgência
// Técnica amplamente usada em e-commerce
function CountdownTimer() {
  const [time] = useState(() => ({
    hours: 5,
    minutes: 47,
    seconds: 23,
  }));

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40 tracking-wide">
        Oferta termina em:
      </span>
      <div className="flex items-center gap-1">
        {[
          { value: String(time.hours).padStart(2, "0"), label: "H" },
          { value: String(time.minutes).padStart(2, "0"), label: "M" },
          { value: String(time.seconds).padStart(2, "0"), label: "S" },
        ].map((unit, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                <span className="text-sm font-medium text-amber-400 tabular-nums">
                  {unit.value}
                </span>
              </div>
              <span className="text-[8px] text-white/20 mt-0.5">
                {unit.label}
              </span>
            </div>
            {i < 2 && <span className="text-amber-400/40 text-sm mb-3">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OffersPage() {
  const { checking } = useProtectedRoute();
  const router = useRouter();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "30" | "20" | "15">(
    "all",
  );

  const { products, loading, error } = useProducts();

  // Pega os 20 produtos mais baratos como "ofertas"
  // simulando uma curadoria de desconto
  const offerProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price).slice(0, 24);
  }, [products]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return offerProducts;
    const discount = parseInt(activeFilter);
    return offerProducts.filter(
      (p) => getDiscount(p.price).discount === discount,
    );
  }, [offerProducts, activeFilter]);

  if (checking) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero de ofertas ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.12) 0%, transparent 60%), linear-gradient(180deg, #0d0a0a 0%, #0a0a0f 100%)",
          }}
        />

        {/* Texto SALE gigante no fundo */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
          <span
            className="text-[20vw] font-bold tracking-tighter"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px rgba(239,68,68,0.06)",
            }}
          >
            SALE
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8"
          >
            <div>
              {/* Badge de urgência */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6"
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-red-400"
                />
                <span className="text-xs text-red-400 font-medium tracking-wide">
                  OFERTAS POR TEMPO LIMITADO
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-medium text-white mb-4">
                Até{" "}
                <span
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage:
                      "linear-gradient(135deg, #ef4444, #f97316)",
                    backgroundClip: "text",
                  }}
                >
                  30% OFF
                </span>
              </h1>

              <p className="text-base text-white/40 max-w-lg leading-relaxed">
                Produtos premium com preços que fazem sentido. Só por hoje —
                amanhã os preços voltam ao normal.
              </p>
            </div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="shrink-0 p-5 rounded-2xl border border-white/[.06] bg-white/[.02]"
            >
              <CountdownTimer />
            </motion.div>
          </motion.div>

          {/* Filtros por desconto */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 mt-8 flex-wrap"
          >
            {(
              [
                { value: "all", label: "Todas as ofertas" },
                { value: "30", label: "30% OFF" },
                { value: "20", label: "20% OFF" },
                { value: "15", label: "15% OFF" },
              ] as const
            ).map((filter) => (
              <motion.button
                key={filter.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.value)}
                className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? "text-white"
                    : "text-white/40 border border-white/[.08] hover:text-white/60"
                }`}
              >
                {activeFilter === filter.value && (
                  <motion.div
                    layoutId="offer-filter"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #ef4444, #f97316)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{filter.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Produtos em oferta ── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-sm text-white/30">
            <AnimatePresence mode="wait">
              <motion.span
                key={filtered.length}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
              >
                {loading
                  ? "Carregando..."
                  : `${filtered.length} ofertas disponíveis`}
              </motion.span>
            </AnimatePresence>
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => void router.push("/shop")}
            className="text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            Ver loja completa →
          </motion.button>
        </motion.div>

        <ProductGrid
          products={filtered}
          loading={loading}
          error={error}
          onCartOpen={() => setCartDrawerOpen(true)}
        />
      </div>
    </div>
  );
}
