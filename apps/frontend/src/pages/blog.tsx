/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Posts do blog — dados separados do JSX
// ─────────────────────────────────────────────
const FEATURED_POST = {
  id: 1,
  slug: "futuro-dos-smartphones-2025",
  title:
    "O futuro dos smartphones em 2025: o que esperar dos próximos lançamentos",
  excerpt:
    "IA embarcada, câmeras que superam DSLRs, baterias que duram dias. Analisamos os principais lançamentos e o que eles significam para o consumidor brasileiro.",
  category: "Tecnologia",
  author: "Daniel Fernandes",
  authorRole: "CEO & Co-fundador",
  authorAvatar: "DF",
  readTime: "8 min",
  date: "19 Mai 2026",
  image:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80",
  tags: ["Smartphones", "IA", "2025"],
};

const POSTS = [
  {
    id: 2,
    slug: "como-escolher-notebook-para-programar",
    title: "Como escolher o notebook ideal para programar em 2025",
    excerpt:
      "RAM, processador, SSD ou display? O guia definitivo para desenvolvedores que não querem errar na escolha.",
    category: "Guias",
    author: "Sofia Mendes",
    readTime: "6 min",
    date: "15 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    tags: ["Notebook", "Dev", "Guia"],
  },
  {
    id: 3,
    slug: "marketing-digital-para-ecommerce",
    title:
      "Marketing digital para e-commerce: as estratégias que funcionam agora",
    excerpt:
      "De TikTok Shop ao Google Shopping. O que realmente converte em 2025 e como aplicar no seu negócio.",
    category: "Marketing",
    author: "Ana Lima",
    readTime: "10 min",
    date: "12 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    tags: ["Marketing", "E-commerce", "Estratégia"],
  },
  {
    id: 4,
    slug: "review-apple-watch-ultra-2",
    title: "Review completo: Apple Watch Ultra 2 — vale cada centavo?",
    excerpt:
      "Testamos por 30 dias em condições extremas. A resposta vai te surpreender.",
    category: "Reviews",
    author: "Rafael Costa",
    readTime: "12 min",
    date: "08 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?w=800&q=80",
    tags: ["Apple", "Wearables", "Review"],
  },
  {
    id: 5,
    slug: "inteligencia-artificial-no-dia-a-dia",
    title: "5 formas de usar IA no dia a dia que vão mudar sua produtividade",
    excerpt:
      "Não é ficção científica. É o que pessoas comuns estão fazendo hoje com ferramentas acessíveis.",
    category: "Tecnologia",
    author: "Daniel Fernandes",
    readTime: "7 min",
    date: "05 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
    tags: ["IA", "Produtividade", "Futuro"],
  },
  {
    id: 6,
    slug: "home-office-setup-premium",
    title: "O setup de home office que vai transformar sua produtividade",
    excerpt:
      "Monitor ultrawide, cadeira ergonômica, iluminação LED. Montamos o setup dos sonhos com cada faixa de orçamento.",
    category: "Lifestyle",
    author: "Sofia Mendes",
    readTime: "9 min",
    date: "01 Mai 2026",
    image:
      "https://images.unsplash.com/photo-1593640408182-31c228b20b41?w=800&q=80",
    tags: ["Setup", "Home Office", "Produtividade"],
  },
  {
    id: 7,
    slug: "tendencias-ecommerce-2025",
    title: "As 7 tendências de e-commerce que vão dominar 2025",
    excerpt:
      "Social commerce, live shopping, hyperpersonalização. O que os dados dizem sobre o futuro das vendas online.",
    category: "Marketing",
    author: "Ana Lima",
    readTime: "11 min",
    date: "28 Abr 2026",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    tags: ["E-commerce", "Tendências", "2025"],
  },
];

const CATEGORIES = [
  "Todos",
  "Tecnologia",
  "Guias",
  "Reviews",
  "Marketing",
  "Lifestyle",
];

const CATEGORY_COLORS: Record<string, string> = {
  Tecnologia: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Guias: "text-green-400 bg-green-400/10 border-green-400/20",
  Reviews: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  Marketing: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Lifestyle: "text-pink-400 bg-pink-400/10 border-pink-400/20",
};

// ─────────────────────────────────────────────
// Hero com parallax de imagem
// ─────────────────────────────────────────────
function HeroWithParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Imagem move mais devagar que o scroll — efeito parallax
  // conteúdo: scroll 100% → translateY 30% (mais rápido)
  // imagem:   scroll 100% → translateY 20% (mais devagar)
  // diferença cria a profundidade visual
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative h-[90vh] flex items-center overflow-hidden"
    >
      {/* Imagem de fundo com parallax */}
      <motion.div
        style={{ y: imageY }}
        className="absolute inset-0 scale-110"
        // scale-110: garante que a imagem cobre a área
        // mesmo quando se move para cima/baixo
      >
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=85"
          alt="Blog LUXTECH — Tecnologia e Inovação"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradiente — garante legibilidade do texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,15,0.5) 0%, rgba(10,10,15,0.7) 50%, rgba(10,10,15,0.95) 100%)",
          }}
        />
        {/* Overlay lateral para profundidade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,15,0.8) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* Conteúdo com parallax próprio — move mais rápido que a imagem */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 tracking-widest font-medium">
              LUXTECH BLOG
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-medium text-white leading-tight mb-6"
          >
            Tecnologia,{" "}
            <span
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                backgroundClip: "text",
              }}
            >
              insights
            </span>{" "}
            e inovação
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-white/60 leading-relaxed mb-8 max-w-lg"
          >
            Conteúdo premium para quem vive a tecnologia de verdade. Reviews
            honestos, guias práticos e as tendências que importam.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-6"
          >
            {[
              { value: "50+", label: "artigos publicados" },
              { value: "12K", label: "leitores mensais" },
              { value: "4.8⭐", label: "avaliação média" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-xl font-medium text-amber-400">
                  {stat.value}
                </span>
                <span className="text-xs text-white/40">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-white/30 tracking-widest">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Post em destaque
// ─────────────────────────────────────────────
function FeaturedPost() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax mais sutil dentro do card
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-1 h-6 rounded-full bg-amber-400" />
        <h2 className="text-lg font-medium text-white">Em destaque</h2>
      </motion.div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl border border-white/[.08] cursor-pointer group"
        style={{ height: "480px" }}
      >
        {/* Imagem com parallax dentro do card */}
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 scale-110"
        >
          <img
            src={FEATURED_POST.image}
            alt={FEATURED_POST.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,15,0.98) 0%, rgba(10,10,15,0.6) 50%, rgba(10,10,15,0.1) 100%)",
            }}
          />
        </motion.div>

        {/* Conteúdo */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${
                CATEGORY_COLORS[FEATURED_POST.category] ??
                "text-white/40 bg-white/[.04] border-white/[.08]"
              }`}
            >
              {FEATURED_POST.category}
            </span>
            <span className="text-xs text-white/30">{FEATURED_POST.date}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/30">
              {FEATURED_POST.readTime} de leitura
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium text-white mb-3 max-w-2xl leading-snug group-hover:text-amber-400 transition-colors">
            {FEATURED_POST.title}
          </h2>

          <p className="text-sm text-white/50 max-w-xl leading-relaxed mb-5">
            {FEATURED_POST.excerpt}
          </p>

          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8960c)",
              }}
            >
              {FEATURED_POST.authorAvatar}
            </div>
            <div>
              <p className="text-xs font-medium text-white/70">
                {FEATURED_POST.author}
              </p>
              <p className="text-[10px] text-white/30">
                {FEATURED_POST.authorRole}
              </p>
            </div>

            <motion.span
              className="ml-auto text-sm text-amber-400/70 group-hover:text-amber-400 transition-colors flex items-center gap-1"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Ler artigo →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card de post
// ─────────────────────────────────────────────
function PostCard({ post, index }: { post: (typeof POSTS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Parallax sutil por card — cada card tem velocidade ligeiramente diferente
  // cria sensação de profundidade no grid inteiro
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    ["-8%", `${8 + index * 2}%`],
  );

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4 }}
      className="group rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 overflow-hidden cursor-pointer transition-colors"
    >
      {/* Imagem com parallax */}
      <div className="relative overflow-hidden h-48">
        <motion.div
          style={{ y: imageY }}
          className="absolute inset-0 scale-110"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(10,10,15,0.8) 100%)",
            }}
          />
        </motion.div>

        {/* Badge de categoria sobre a imagem */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm ${
              CATEGORY_COLORS[post.category] ??
              "text-white/60 bg-black/40 border-white/20"
            }`}
          >
            {post.category}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <h3 className="text-base font-medium text-white/85 leading-snug mb-2 group-hover:text-white transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-white/40 leading-relaxed mb-4 line-clamp-2">
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-white/[.04] border border-white/[.06] text-white/30"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer do card */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[.04]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">{post.author}</span>
            <span className="text-white/15">·</span>
            <span className="text-xs text-white/25">{post.date}</span>
          </div>
          <span className="text-xs text-white/25">{post.readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Newsletter inline no blog
// ─────────────────────────────────────────────
function BlogNewsletter() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-amber-400/15 p-8"
        style={{
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #1a1400 60%, #0d0d1a 100%)",
        }}
      >
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full border border-amber-400/10" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-xs text-amber-400/60 tracking-widest mb-2">
              NEWSLETTER DO BLOG
            </p>
            <h3 className="text-xl font-medium text-white mb-1">
              Novos artigos toda semana
            </h3>
            <p className="text-sm text-white/40">
              Receba os melhores conteúdos de tech direto no seu e-mail.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto md:min-w-[320px]">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-black shrink-0"
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8960c)",
              }}
            >
              Assinar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <HeroWithParallax />
      <FeaturedPost />

      {/* Grid de posts */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-1 h-6 rounded-full bg-amber-400" />
          <h2 className="text-lg font-medium text-white">Artigos recentes</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {POSTS.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      </div>

      <BlogNewsletter />
    </div>
  );
}
