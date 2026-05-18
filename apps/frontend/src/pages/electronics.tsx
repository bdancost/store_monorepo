import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/shop/ProductGrid";
import { useState } from "react";

// ─────────────────────────────────────────────
// Dados de features — configuração como dado
// Fácil de editar sem mexer no JSX
// ─────────────────────────────────────────────
const FEATURES = [
  {
    icon: "⚡",
    title: "Ultra performance",
    description: "Processadores de última geração para tarefas exigentes",
  },
  {
    icon: "🔋",
    title: "Bateria que dura",
    description: "Até 48h de autonomia nos modelos premium",
  },
  {
    icon: "📡",
    title: "Conectividade total",
    description: "5G, Wi-Fi 6E e Bluetooth 5.3 em todos os dispositivos",
  },
  {
    icon: "🛡️",
    title: "Garantia estendida",
    description: "2 anos de garantia em todos os eletrônicos",
  },
];

const STATS = [
  { value: "500+", label: "Modelos disponíveis" },
  { value: "4.9★", label: "Avaliação média" },
  { value: "48h", label: "Entrega expressa" },
  { value: "2 anos", label: "Garantia" },
];

// Categorias visuais de eletrônicos
const SUBCATEGORIES = [
  { icon: "📱", label: "Smartphones", query: "smartphones" },
  { icon: "💻", label: "Notebooks", query: "laptops" },
  { icon: "🎧", label: "Áudio", query: "audio" },
  { icon: "📺", label: "TVs", query: "tvs" },
  { icon: "⌚", label: "Wearables", query: "wearables" },
  { icon: "🖥️", label: "Monitores", query: "monitors" },
];

export default function ElectronicsPage() {
  const { checking } = useProtectedRoute();
  const router = useRouter();
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // useProducts já busca todos os produtos
  // filtramos no frontend por categoria
  // Por que não endpoint separado por categoria?
  // Os produtos já estão em memória depois da shop page
  // — novo fetch seria desperdício de rede
  const { products, loading, error } = useProducts();

  // Filtra apenas eletrônicos e laptops da DummyJSON
  // que são as categorias mais próximas de "eletrônicos"
  const electronics = products.filter((p) =>
    ["smartphones", "laptops", "mobile-accessories"].includes(
      p.category.toLowerCase(),
    ),
  );

  // Ref para a seção de produtos
  // useScroll rastreia o scroll dentro desse elemento
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax — o texto sobe mais rápido que o fundo
  // useTransform converte o progresso de scroll (0 a 1)
  // em valores de transformação CSS
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  if (checking) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero com Parallax ── */}
      <div
        ref={heroRef}
        className="relative h-[85vh] flex items-center overflow-hidden"
      >
        {/* Fundo animado */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 60% 50%, rgba(212,175,55,0.08) 0%, transparent 60%), linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)",
          }}
        />

        {/* Grade decorativa — igual às páginas da Apple */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Orbs flutuantes no fundo */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 300 + i * 100,
              height: 300 + i * 100,
              left: `${20 + i * 25}%`,
              top: `${10 + i * 15}%`,
              background: `radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 4 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5,
            }}
          />
        ))}

        {/* Conteúdo do hero com parallax */}
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-6 w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Tag de categoria */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-400 tracking-widest">
                ELETRÔNICOS PREMIUM
              </span>
            </motion.div>

            {/* Headline principal */}
            <h1 className="text-5xl md:text-7xl font-medium text-white leading-tight mb-6 max-w-3xl">
              Tecnologia que{" "}
              <span
                className="relative"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg, #d4af37, #f5d56e, #d4af37)",
                  backgroundClip: "text",
                }}
              >
                redefine
              </span>{" "}
              o possível
            </h1>

            <p className="text-lg text-white/40 max-w-xl mb-10 leading-relaxed">
              Os melhores dispositivos do mundo, curados para quem não aceita
              menos que o melhor. Performance sem compromisso.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // Scroll suave para a seção de produtos
                  document
                    .getElementById("products-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 rounded-2xl text-sm font-medium text-black relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                {/* Shimmer no botão principal */}
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative z-10">Explorar produtos →</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => void router.push("/shop")}
                className="px-8 py-4 rounded-2xl text-sm text-white/60 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80 transition-colors"
              >
                Ver toda a loja
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs text-white/20 tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-y border-white/[.04] bg-white/[.02]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                // whileInView: anima quando entra na viewport
                // viewport once: anima apenas na primeira vez
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-2xl font-medium text-amber-400">
                  {stat.value}
                </p>
                <p className="text-xs text-white/30 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Subcategorias visuais ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-2xl font-medium text-white mb-2">
            Explore por categoria
          </h2>
          <p className="text-sm text-white/30">
            Encontre exatamente o que você procura
          </p>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {SUBCATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4, borderColor: "rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/[.06] bg-white/[.02] transition-colors cursor-pointer"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs text-white/50">{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div
        className="py-16 border-y border-white/[.04]"
        style={{
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 50%, #0d0d1a 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-medium text-white mb-3">
              Por que escolher a LUXTECH?
            </h2>
            <p className="text-sm text-white/30 max-w-md mx-auto">
              Não vendemos apenas produtos. Vendemos a certeza de que você fez a
              melhor escolha.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-2xl">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Produtos filtrados ── */}
      <div id="products-section" className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-medium text-white mb-2">
              Eletrônicos em destaque
            </h2>
            <p className="text-sm text-white/30">
              {loading
                ? "Carregando..."
                : `${electronics.length} produtos selecionados`}
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
          products={electronics}
          loading={loading}
          error={error}
          onCartOpen={() => setCartDrawerOpen(true)}
        />
      </div>

      {/* CartDrawer */}
      {cartDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setCartDrawerOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {/* Import CartDrawer se quiser o drawer aqui */}
          </div>
        </div>
      )}
    </div>
  );
}
