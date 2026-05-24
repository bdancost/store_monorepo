import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Dados da página — configuração separada do JSX
// ─────────────────────────────────────────────
const MILESTONES = [
  {
    year: "2019",
    title: "O começo em uma garagem",
    description:
      "Tudo começou com R$3.000, um notebook usado e uma obsessão: por que comprar tecnologia premium no Brasil precisava ser tão complicado e caro? Daniel e sua equipe decidiram mudar isso.",
    icon: "🏠",
  },
  {
    year: "2020",
    title: "O primeiro grande obstáculo",
    description:
      "A pandemia chegou. Estoque parado, logística travada, incerteza total. Mas a demanda por tecnologia explodiu. Em vez de recuar, dobramos a aposta e pivotamos para o digital.",
    icon: "⚡",
  },
  {
    year: "2021",
    title: "A virada",
    description:
      "Atingimos R$1 milhão em vendas em um único mês. Não por acidente — por causa da obsessão com experiência do cliente. Cada detalhe importava. Cada entrega era uma carta de amor à tecnologia.",
    icon: "🚀",
  },
  {
    year: "2022",
    title: "Construindo o time dos sonhos",
    description:
      "Contratamos as mentes mais brilhantes que encontramos. Engenheiros, designers, especialistas em produto. Gente que acredita que tecnologia muda vidas — porque já mudou as nossas.",
    icon: "👥",
  },
  {
    year: "2023",
    title: "Referência nacional",
    description:
      "Fomos eleitos a loja de tecnologia com melhor NPS do Brasil. 94% dos clientes voltam. Não vendemos produtos — criamos experiências que fazem as pessoas voltarem.",
    icon: "🏆",
  },
  {
    year: "2024+",
    title: "O futuro que estamos construindo",
    description:
      "Estamos expandindo para toda a América Latina. Mais produtos, mais categorias, mais inovação. A missão continua a mesma: democratizar o acesso à tecnologia premium.",
    icon: "🌎",
  },
];

const STATS = [
  { value: "500K+", label: "Clientes satisfeitos", icon: "😊" },
  { value: "98%", label: "Taxa de satisfação", icon: "⭐" },
  { value: "48h", label: "Entrega média", icon: "🚚" },
  { value: "R$50M+", label: "Em produtos vendidos", icon: "💰" },
  { value: "150+", label: "Colaboradores", icon: "👥" },
  { value: "6 anos", label: "De história", icon: "🏆" },
];

const VALUES = [
  {
    icon: "🔥",
    title: "Obsessão pelo cliente",
    description:
      "Cada decisão começa com uma pergunta: isso é bom para o cliente? Se a resposta for não, a decisão muda.",
  },
  {
    icon: "💡",
    title: "Inovação constante",
    description:
      "O mercado muda todo dia. Quem para de inovar, para de existir. Reinventamos nossos processos sem parar.",
  },
  {
    icon: "🤝",
    title: "Transparência total",
    description:
      "Sem letras miúdas, sem surpresas. O que você vê é o que você leva — em produtos, preços e atendimento.",
  },
  {
    icon: "🌱",
    title: "Crescimento com propósito",
    description:
      "Crescer rápido é fácil. Crescer bem é difícil. Escolhemos o caminho difícil porque é o único que dura.",
  },
];

const TEAM = [
  {
    name: "Daniel Fernandes",
    role: "CEO & Co-fundador",
    description:
      "Ex-engenheiro de software que largou tudo para resolver o problema que mais o irritava como consumidor.",
    avatar: "DF",
    gradient: "from-amber-400 to-yellow-600",
  },
  {
    name: "Sofia Mendes",
    role: "CTO & Co-fundadora",
    description:
      "15 anos em big tech. Construiu sistemas para milhões de usuários antes de decidir construir algo seu.",
    avatar: "SM",
    gradient: "from-purple-400 to-purple-600",
  },
  {
    name: "Rafael Costa",
    role: "Head of Product",
    description:
      "Acredita que bom produto é aquele que o usuário nem percebe que está usando — só sente que funciona.",
    avatar: "RC",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    name: "Ana Lima",
    role: "Head of Customer Success",
    description:
      "Transformou o suporte ao cliente de custo em vantagem competitiva. NPS de 94% tem o nome dela.",
    avatar: "AL",
    gradient: "from-green-400 to-green-600",
  },
];

// ─────────────────────────────────────────────
// Componentes da página
// ─────────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div
      ref={ref}
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* Fundo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 60%), #0a0a0f",
        }}
      />

      {/* Grade decorativa */}
      <div
        className="absolute inset-0 opacity-[.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Partículas */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-amber-400/50"
          style={{
            left: `${10 + i * 11}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        />
      ))}

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-7xl mx-auto px-6 w-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 tracking-widest">
              NOSSA HISTÓRIA
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-medium text-white leading-tight mb-6"
          >
            Nascemos da{" "}
            <span
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                backgroundClip: "text",
              }}
            >
              frustração
            </span>{" "}
            de quem ama tecnologia
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-white/50 leading-relaxed mb-10 max-w-2xl"
          >
            Em 2019, um engenheiro de software cansado de pagar caro por
            tecnologia ruim decidiu construir a loja que ele sempre quis ter.
            Hoje, somos a referência em tecnologia premium no Brasil.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/shop">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex px-8 py-4 rounded-2xl text-sm font-medium text-black cursor-pointer relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10">Explorar produtos →</span>
              </motion.span>
            </Link>
            <Link href="/careers">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex px-8 py-4 rounded-2xl text-sm text-white/60 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80 transition-colors cursor-pointer"
              >
                Trabalhe conosco
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-xs text-white/20 tracking-widest">SCROLL</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </div>
  );
}

function StatsSection() {
  return (
    <div className="border-y border-white/[.04] bg-white/[.02] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-medium text-amber-400">
                {stat.value}
              </p>
              <p className="text-xs text-white/30">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineSection() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-medium text-white mb-4">
          6 anos de história
        </h2>
        <p className="text-white/40">
          Cada ano com uma lição. Cada obstáculo com uma virada.
        </p>
      </motion.div>

      <div className="relative">
        {/* Linha vertical */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/30 via-amber-400/10 to-transparent" />

        <div className="flex flex-col gap-12">
          {MILESTONES.map((milestone, i) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-8 pl-0"
            >
              {/* Ícone na linha */}
              <div className="flex flex-col items-center shrink-0">
                <motion.div
                  whileInView={{ scale: [0, 1] }} // <--- Apenas início e fim
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.1 + 0.2,
                    type: "spring",
                    bounce: 0.4,
                  }} // <--- Adicionado bounce para dar o efeito elástico
                  className="w-16 h-16 rounded-2xl border border-amber-400/20 bg-amber-400/10 flex items-center justify-center text-2xl z-10"
                >
                  {milestone.icon}
                </motion.div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-amber-400/60 tracking-widest">
                    {milestone.year}
                  </span>
                  <div className="flex-1 h-px bg-white/[.04]" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {milestone.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValuesSection() {
  return (
    <div
      className="py-24 border-y border-white/[.04]"
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-medium text-white mb-4">
            O que nos guia
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            Valores não são palavras em uma parede. São decisões que tomamos
            todo dia quando ninguém está olhando.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-all"
            >
              <span className="text-3xl mb-4 block">{value.icon}</span>
              <h3 className="text-base font-medium text-white mb-2">
                {value.title}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-medium text-white mb-4">
          As pessoas por trás da LUXTECH
        </h2>
        <p className="text-white/40 max-w-lg mx-auto">
          Somos obcecados por tecnologia, movidos por propósito e unidos pela
          crença de que podemos fazer melhor.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="flex flex-col gap-4 p-6 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-all"
          >
            {/* Avatar */}
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-medium text-white bg-gradient-to-br ${member.gradient}`}
            >
              {member.avatar}
            </div>

            <div>
              <h3 className="text-base font-medium text-white">
                {member.name}
              </h3>
              <p className="text-xs text-amber-400/70 mt-0.5">{member.role}</p>
            </div>

            <p className="text-sm text-white/40 leading-relaxed flex-1">
              {member.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-amber-400/15 p-12 text-center"
        style={{
          background:
            "linear-gradient(135deg, #0d0d1a 0%, #1a1400 50%, #0d0d1a 100%)",
        }}
      >
        {/* Decoração */}
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full border border-amber-400/10" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 rounded-full border border-amber-400/8" />

        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-400/40"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 2) * 40}%` }}
            animate={{ y: [0, -16, 0], opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2.5 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        <div className="relative z-10">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-5xl mb-6 block"
          >
            ⚡
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-medium text-white mb-4">
            Faça parte dessa história
          </h2>
          <p className="text-white/40 max-w-xl mx-auto mb-8 text-lg">
            Seja como cliente, colaborador ou parceiro — há espaço para quem
            acredita que tecnologia pode ser melhor.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex px-8 py-4 rounded-2xl text-sm font-medium text-black cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                Comprar agora →
              </motion.span>
            </Link>
            <Link href="/careers">
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex px-8 py-4 rounded-2xl text-sm text-white/60 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80 transition-colors cursor-pointer"
              >
                Ver vagas abertas
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <HeroSection />
      <StatsSection />
      <TimelineSection />
      <ValuesSection />
      <TeamSection />
      <CTASection />
    </div>
  );
}
