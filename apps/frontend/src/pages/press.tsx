/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimationFrame,
} from "framer-motion";

// ─────────────────────────────────────────────
// Dados da página
// ─────────────────────────────────────────────
const TICKER_ITEMS = [
  "🏆 LUXTECH eleita a melhor loja de tecnologia do Brasil 2024",
  "📈 Crescimento de 340% em receita no último ano fiscal",
  "🚀 LUXTECH anuncia expansão para Chile e Argentina em 2025",
  "💰 Rodada Serie A de R$50M liderada por fundo de Silicon Valley",
  "⭐ NPS de 94 — melhor do setor de e-commerce brasileiro",
  "📦 500.000 pedidos entregues em 2024",
  "🌎 LUXTECH presente em todas as capitais do Brasil",
  "🤝 Parceria estratégica com Samsung e Apple Brasil firmada",
];

const MEDIA_MENTIONS = [
  {
    outlet: "Folha de S.Paulo",
    logo: "📰",
    headline: "A startup que quer ser a Amazon brasileira de eletrônicos",
    date: "15 Mai 2026",
    type: "Perfil",
    url: "#",
    featured: true,
  },
  {
    outlet: "Globo Tecnologia",
    logo: "📺",
    headline:
      "LUXTECH: como uma empresa brasileira desafia as big techs no mercado de premium",
    date: "08 Mai 2026",
    type: "Entrevista",
    url: "#",
    featured: true,
  },
  {
    outlet: "Exame",
    logo: "📊",
    headline:
      "Serie A de R$50M: LUXTECH é o novo unicórnio brasileiro a observar",
    date: "01 Mai 2026",
    type: "Negócios",
    url: "#",
    featured: true,
  },
  {
    outlet: "TechCrunch Brasil",
    logo: "🚀",
    headline:
      "Brazilian e-commerce startup LUXTECH raises $10M to expand across LATAM",
    date: "28 Abr 2026",
    type: "Investimento",
    url: "#",
    featured: false,
  },
  {
    outlet: "Valor Econômico",
    logo: "💹",
    headline: "LUXTECH registra crescimento de 340% e mira IPO para 2027",
    date: "20 Abr 2026",
    type: "Mercado",
    url: "#",
    featured: false,
  },
  {
    outlet: "InfoMoney",
    logo: "💰",
    headline:
      "Como a LUXTECH usa tecnologia para transformar a experiência de compra",
    date: "12 Abr 2026",
    type: "Tecnologia",
    url: "#",
    featured: false,
  },
];

const PRESS_RELEASES = [
  {
    id: 1,
    date: "19 Mai 2026",
    category: "EXPANSÃO",
    title:
      "LUXTECH anuncia entrada nos mercados chileno e argentino para o segundo semestre de 2025",
    excerpt:
      "A operação começa com um investimento de R$15 milhões em infraestrutura logística e contratação de 50 profissionais locais em cada país.",
    icon: "🌎",
  },
  {
    id: 2,
    date: "01 Mai 2026",
    category: "INVESTIMENTO",
    title:
      "Rodada Serie A de R$50 milhões liderada pelo fundo Sequoia Capital Brasil",
    excerpt:
      "Os recursos serão utilizados para expansão de produto, contratação de talentos e aceleração da plataforma tecnológica da empresa.",
    icon: "💰",
  },
  {
    id: 3,
    date: "15 Abr 2026",
    category: "PARCERIA",
    title:
      "LUXTECH firma parceria estratégica com Samsung e Apple para distribuição premium no Brasil",
    excerpt:
      "O acordo garante acesso antecipado a lançamentos e condições exclusivas de precificação para clientes LUXTECH Premium.",
    icon: "🤝",
  },
  {
    id: 4,
    date: "01 Abr 2026",
    category: "PRODUTO",
    title:
      "LUXTECH lança programa de assinatura anual com benefícios exclusivos e frete grátis ilimitado",
    excerpt:
      "O LUXTECH Premium já conta com 50.000 assinantes e representa 40% da receita recorrente da empresa.",
    icon: "⭐",
  },
  {
    id: 5,
    date: "15 Mar 2026",
    category: "RECONHECIMENTO",
    title:
      "LUXTECH vence o Prêmio Reclame Aqui de Melhor E-commerce de Tecnologia 2025",
    excerpt:
      "Com NPS de 94 e índice de resolução de 98.7%, a LUXTECH supera concorrentes nacionais e internacionais na avaliação dos consumidores.",
    icon: "🏆",
  },
];

const MEDIA_KIT_ITEMS = [
  {
    icon: "⚡",
    title: "Logo LUXTECH",
    description: "SVG, PNG e variações para fundo claro e escuro",
    size: "2.4 MB",
    format: "ZIP",
  },
  {
    icon: "🖼️",
    title: "Fotos institucionais",
    description: "20 fotos em alta resolução do time e escritório",
    size: "48 MB",
    format: "ZIP",
  },
  {
    icon: "📊",
    title: "Dados & métricas",
    description: "Números oficiais, crescimento e indicadores de 2024",
    size: "1.2 MB",
    format: "PDF",
  },
  {
    icon: "📝",
    title: "Fact sheet",
    description: "Resumo executivo com história, missão e liderança",
    size: "890 KB",
    format: "PDF",
  },
];

const STATS = [
  { value: "R$50M+", label: "Captados em funding", icon: "💰" },
  { value: "500K+", label: "Clientes ativos", icon: "👥" },
  { value: "340%", label: "Crescimento YoY", icon: "📈" },
  { value: "94", label: "NPS score", icon: "⭐" },
];

// ─────────────────────────────────────────────
// Ticker de notícias animado
// ─────────────────────────────────────────────
function NewsTicker() {
  const [offset, setOffset] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // useAnimationFrame — roda a cada frame (60fps)
  // mais suave que setInterval para animações contínuas
  // Por que não CSS animation?
  // Porque precisamos controlar a velocidade e pausar no hover
  const isPaused = useRef(false);

  useAnimationFrame(() => {
    if (isPaused.current) return;
    if (!contentRef.current) return;

    const contentWidth = contentRef.current.scrollWidth / 2;

    setOffset((prev) => {
      const next = prev - 0.5; // velocidade do ticker
      // Quando percorreu metade (conteúdo duplicado), volta ao início
      // cria loop infinito sem pulo visual
      if (Math.abs(next) >= contentWidth) return 0;
      return next;
    });
  });

  // Duplicamos o conteúdo para criar loop seamless
  const allItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div
      className="border-b border-amber-400/10 bg-amber-400/5 overflow-hidden"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      <div className="flex items-center h-10">
        {/* Label fixo */}
        <div className="flex items-center gap-2 px-4 border-r border-amber-400/20 h-full shrink-0 bg-amber-400/10">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-red-400"
          />
          <span className="text-[10px] font-medium text-amber-400 tracking-widest">
            AO VIVO
          </span>
        </div>

        {/* Ticker animado */}
        <div ref={tickerRef} className="flex-1 overflow-hidden">
          <div
            ref={contentRef}
            className="flex items-center gap-12 whitespace-nowrap"
            style={{ transform: `translateX(${offset}px)` }}
          >
            {allItems.map((item, i) => (
              <span
                key={i}
                className="text-xs text-white/60 shrink-0 flex items-center gap-3"
              >
                {item}
                <span className="text-amber-400/30">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Hero com parallax — imagem de redação/newsroom
// ─────────────────────────────────────────────
function PressHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative h-[75vh] flex items-center overflow-hidden"
    >
      {/* Imagem de fundo — newsroom/mídia */}
      <motion.div style={{ y: imageY }} className="absolute inset-0 scale-110">
        <img
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1920&q=85"
          alt="LUXTECH Sala de Imprensa"
          className="w-full h-full object-cover"
        />
        {/* Overlay com tom mais frio — transmite credibilidade jornalística */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(10,10,15,0.92) 0%, rgba(10,10,20,0.75) 50%, rgba(10,10,15,0.85) 100%)",
          }}
        />
        {/* Overlay dourado sutil — mantém identidade da marca */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 70% 50%, rgba(212,175,55,0.06) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/25 bg-amber-400/8 backdrop-blur-sm mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-amber-400 tracking-widest font-medium">
              SALA DE IMPRENSA
            </span>
          </motion.div>

          {/* Headline estilo jornalístico */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-medium text-white leading-tight mb-6"
          >
            A história que{" "}
            <span
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                backgroundClip: "text",
              }}
            >
              o mundo
            </span>{" "}
            está contando
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="text-lg text-white/50 leading-relaxed mb-10 max-w-xl"
          >
            Assets de mídia, releases oficiais e contato direto com nossa
            assessoria. Tudo que você precisa para contar a história da LUXTECH.
          </motion.p>

          {/* Stats em destaque */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
                className="flex flex-col gap-1 p-4 rounded-xl border border-white/[.08] bg-white/[.04] backdrop-blur-sm"
              >
                <span className="text-lg">{stat.icon}</span>
                <span className="text-xl font-medium text-amber-400">
                  {stat.value}
                </span>
                <span className="text-[10px] text-white/35 leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Cobertura na mídia
// ─────────────────────────────────────────────
function MediaCoverage() {
  const featured = MEDIA_MENTIONS.filter((m) => m.featured);
  const others = MEDIA_MENTIONS.filter((m) => !m.featured);

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-10"
      >
        <div className="w-1 h-6 rounded-full bg-amber-400" />
        <h2 className="text-lg font-medium text-white">LUXTECH na mídia</h2>
        <span className="text-xs text-white/25 ml-2">
          {MEDIA_MENTIONS.length} coberturas recentes
        </span>
      </motion.div>

      {/* Cards em destaque */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        {featured.map((mention, i) => (
          <motion.a
            key={mention.outlet}
            href={mention.url}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, borderColor: "rgba(212,175,55,0.3)" }}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[.06] bg-white/[.02] transition-all cursor-pointer group"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{mention.logo}</span>
                <span className="text-sm font-medium text-white/70">
                  {mention.outlet}
                </span>
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400">
                {mention.type}
              </span>
            </div>

            {/* Headline */}
            <p className="text-base font-medium text-white/80 leading-snug group-hover:text-white transition-colors flex-1">
              &ldquo;{mention.headline}&quot;
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[.04]">
              <span className="text-xs text-white/25">{mention.date}</span>
              <motion.span
                className="text-xs text-amber-400/50 group-hover:text-amber-400 transition-colors"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Ler →
              </motion.span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Lista compacta */}
      <div className="flex flex-col gap-3">
        {others.map((mention, i) => (
          <motion.a
            key={mention.outlet}
            href={mention.url}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ x: 4 }}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-all cursor-pointer group"
          >
            <span className="text-xl shrink-0">{mention.logo}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                &quot;{mention.headline}&quot;
              </p>
              <p className="text-xs text-white/25 mt-0.5">{mention.outlet}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-[10px] text-white/25 hidden sm:block">
                {mention.date}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[.04] border border-white/[.06] text-white/30">
                {mention.type}
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Press releases — design tipográfico de jornal
// ─────────────────────────────────────────────
function PressReleases() {
  return (
    <div
      className="border-y border-white/[.04] py-16"
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-1 h-6 rounded-full bg-amber-400" />
          <h2 className="text-lg font-medium text-white">Press Releases</h2>
        </motion.div>

        <div className="flex flex-col gap-0">
          {PRESS_RELEASES.map((release, i) => (
            <motion.div
              key={release.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ x: 6 }}
              className="flex items-start gap-6 py-6 border-b border-white/[.04] last:border-0 cursor-pointer group"
            >
              {/* Número do release — estilo jornal */}
              <div className="flex flex-col items-center gap-1 shrink-0 w-12">
                <span
                  className="text-2xl font-mono font-bold"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage:
                      "linear-gradient(135deg, #d4af37, #f5d56e)",
                    backgroundClip: "text",
                  }}
                >
                  {String(release.id).padStart(2, "0")}
                </span>
              </div>

              {/* Ícone */}
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-xl shrink-0 mt-0.5">
                {release.icon}
              </div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-medium text-amber-400 tracking-widest">
                    {release.category}
                  </span>
                  <span className="text-white/15">·</span>
                  <span className="text-xs text-white/25">{release.date}</span>
                </div>
                <h3 className="text-base font-medium text-white/85 leading-snug mb-2 group-hover:text-white transition-colors">
                  {release.title}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed line-clamp-2">
                  {release.excerpt}
                </p>
              </div>

              {/* Seta */}
              <motion.span
                className="text-white/20 group-hover:text-amber-400 transition-colors shrink-0 mt-1 text-lg"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Media Kit interativo
// ─────────────────────────────────────────────
function MediaKit() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-3 mb-3"
      >
        <div className="w-1 h-6 rounded-full bg-amber-400" />
        <h2 className="text-lg font-medium text-white">Kit de Mídia</h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-sm text-white/35 mb-8 ml-5"
      >
        Assets oficiais prontos para uso editorial. Sem precisar pedir
        autorização.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {MEDIA_KIT_ITEMS.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col gap-4 p-5 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/25 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-[10px] px-2 py-1 rounded-full bg-white/[.04] border border-white/[.06] text-white/30 font-mono">
                {item.format}
              </span>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-medium text-white mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-white/35 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[.04]">
              <span className="text-xs text-white/25">{item.size}</span>
              <motion.span
                className="text-xs text-amber-400/60 group-hover:text-amber-400 transition-colors flex items-center gap-1"
                whileHover={{ x: 2 }}
              >
                Download ↓
              </motion.span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Download tudo */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex justify-center"
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-medium text-black relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
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
          <span className="relative z-10 text-lg">⬇</span>
          <span className="relative z-10">
            Baixar kit completo de mídia (52 MB)
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Contato com assessoria
// ─────────────────────────────────────────────
function PressContact() {
  return (
    <div
      className="border-t border-white/[.04] py-16"
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs text-amber-400/60 tracking-widest mb-4">
              ASSESSORIA DE IMPRENSA
            </p>
            <h2 className="text-3xl font-medium text-white mb-4">
              Vamos contar essa história juntos
            </h2>
            <p className="text-white/40 leading-relaxed mb-6">
              Nossa equipe de comunicação responde em até 4 horas úteis. Para
              entrevistas com liderança, o prazo é de 24 horas.
            </p>

            <div className="flex flex-col gap-4">
              {[
                {
                  icon: "📧",
                  label: "E-mail",
                  value: "imprensa@luxtech.com.br",
                },
                {
                  icon: "📱",
                  label: "WhatsApp Assessoria",
                  value: "+55 (11) 99999-0000",
                },
                {
                  icon: "🕐",
                  label: "Horário de atendimento",
                  value: "Seg–Sex, 9h–18h (BRT)",
                },
              ].map((contact) => (
                <div key={contact.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/15 flex items-center justify-center text-base shrink-0">
                    {contact.icon}
                  </div>
                  <div>
                    <p className="text-[10px] text-white/25 tracking-wide">
                      {contact.label}
                    </p>
                    <p className="text-sm text-white/70">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Formulário de contato */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6 flex flex-col gap-4"
          >
            <h3 className="text-base font-medium text-white mb-2">
              Solicitar entrevista ou material
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/30 tracking-wide">
                  NOME
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="bg-white/[.04] border border-white/[.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-white/30 tracking-wide">
                  VEÍCULO
                </label>
                <input
                  type="text"
                  placeholder="Nome do veículo"
                  className="bg-white/[.04] border border-white/[.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/30 tracking-wide">
                E-MAIL PROFISSIONAL
              </label>
              <input
                type="email"
                placeholder="redacao@veiculo.com.br"
                className="bg-white/[.04] border border-white/[.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/30 tracking-wide">
                TIPO DE SOLICITAÇÃO
              </label>
              <select className="bg-white/[.04] border border-white/[.08] rounded-xl px-3 py-2.5 text-sm text-white/60 outline-none focus:border-amber-400/40 transition-colors">
                <option value="" className="bg-[#0f0f1a]">
                  Selecione...
                </option>
                <option value="interview" className="bg-[#0f0f1a]">
                  Entrevista com liderança
                </option>
                <option value="data" className="bg-[#0f0f1a]">
                  Dados e métricas
                </option>
                <option value="assets" className="bg-[#0f0f1a]">
                  Assets visuais
                </option>
                <option value="release" className="bg-[#0f0f1a]">
                  Press release
                </option>
                <option value="other" className="bg-[#0f0f1a]">
                  Outro
                </option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-white/30 tracking-wide">
                MENSAGEM
              </label>
              <textarea
                rows={3}
                placeholder="Descreva sua pauta ou solicitação..."
                className="bg-white/[.04] border border-white/[.08] rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors resize-none"
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-xl text-sm font-medium text-black mt-1"
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8960c)",
              }}
            >
              Enviar solicitação →
            </motion.button>

            <p className="text-[10px] text-white/20 text-center">
              Resposta em até 4 horas úteis · Seg–Sex 9h–18h
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function PressPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NewsTicker />
      <PressHero />
      <MediaCoverage />
      <PressReleases />
      <MediaKit />
      <PressContact />
    </div>
  );
}
