/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/shop/ProductGrid";

const LIFESTYLE_FEATURES = [
  {
    icon: "🎯",
    title: "Design premiado",
    description: "Gadgets que são obras de arte funcionais",
    color: "from-purple-500/10 to-transparent",
    border: "border-purple-500/20",
  },
  {
    icon: "🌐",
    title: "Conectado 24/7",
    description: "Ecossistema inteligente que sincroniza tudo",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20",
  },
  {
    icon: "♻️",
    title: "Sustentável",
    description: "Produzido com materiais eco-friendly certificados",
    color: "from-green-500/10 to-transparent",
    border: "border-green-500/20",
  },
];

const TRENDING = [
  { emoji: "🎧", name: "Fones premium", trend: "+234% este mês" },
  { emoji: "⌚", name: "Smartwatches", trend: "+189% este mês" },
  { emoji: "📸", name: "Câmeras action", trend: "+156% este mês" },
];

export default function GadgetsPage() {
  const { checking } = useProtectedRoute();
  const router = useRouter();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { products, loading, error } = useProducts();

  // 1. Estado seguro para evitar o erro de hidratação das partículas e dos refs
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const gadgets = products.filter((p) =>
    ["mobile-accessories", "mens-watches", "womens-watches"].includes(
      p.category.toLowerCase(),
    ),
  );

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: isMounted ? heroRef : undefined,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (checking) return null;

  // 2. Se ainda não foi montado no cliente, mostramos um loading de fundo para o SSR
  // Isto impede o Next.js de inventar valores de partículas no servidor que depois dão erro no browser
  if (!isMounted) {
    return <div className="min-h-screen bg-[#0a0a0f]" />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className="relative h-[85vh] flex items-center overflow-hidden"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 60%, rgba(139,92,246,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(212,175,55,0.05) 0%, transparent 50%), linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)",
          }}
        />

        {/* Partículas flutuantes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              left: `${8 + i * 8}%`,
              top: `${15 + (i % 4) * 20}%`,
              background:
                i % 2 === 0 ? "rgba(212,175,55,0.6)" : "rgba(139,92,246,0.6)",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/20 bg-purple-500/5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              <span className="text-xs text-purple-400 tracking-widest">
                GADGETS & LIFESTYLE
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-medium text-white leading-tight mb-6 max-w-3xl">
              O futuro cabe{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(135deg, #a855f7, #d4af37)",
                  backgroundClip: "text",
                }}
              >
                na palma
              </span>{" "}
              da sua mão
            </h1>

            <p className="text-lg text-white/40 max-w-xl mb-10 leading-relaxed">
              Gadgets que transformam sua rotina em experiência. Tecnologia que
              você usa. Design que você exibe.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  document
                    .getElementById("gadgets-products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 rounded-2xl text-sm font-medium text-white relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                }}
              >
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10">Descobrir gadgets →</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => void router.push("/shop")}
                className="px-8 py-4 rounded-2xl text-sm text-white/60 border border-white/[.08] hover:border-purple-500/30 hover:text-white/80 transition-colors"
              >
                Ver toda a loja
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-white/20 tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* ── Trending ── */}
      <div className="border-y border-white/[.04] bg-white/[.02]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRENDING.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4"
              >
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {item.name}
                  </p>
                  <p className="text-xs text-green-400 mt-0.5">
                    📈 {item.trend}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features com cor por card ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-medium text-white mb-8"
        >
          Por que gadgets LUXTECH?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LIFESTYLE_FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -6 }}
              className={`p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} hover:border-opacity-40 transition-all`}
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="text-sm font-medium text-white mb-2">{f.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Produtos ── */}
      <div id="gadgets-products" className="max-w-7xl mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">
              Gadgets em alta
            </h2>
            <p className="text-sm text-white/30">
              {loading ? "Carregando..." : `${gadgets.length} produtos`}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => void router.push("/shop")}
            className="text-xs text-amber-400/70 hover:text-amber-400 border border-amber-400/20 hover:border-amber-400/40 px-4 py-2 rounded-lg transition-colors"
          >
            Ver todos →
          </motion.button>
        </motion.div>

        <ProductGrid
          products={gadgets}
          loading={loading}
          error={error}
          onCartOpen={() => setCartDrawerOpen(true)}
        />
      </div>
    </div>
  );
}
