/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Dados das vagas — configuração separada do JSX
// ─────────────────────────────────────────────
const JOBS = [
  // Engenharia
  {
    id: 1,
    title: "Senior Backend Engineer",
    department: "Engenharia",
    location: "São Paulo · Híbrido",
    type: "CLT",
    level: "Sênior",
    salary: "R$ 18.000 – 25.000",
    description:
      "Construa a infraestrutura que processa milhões de transações por dia. Você vai trabalhar com NestJS, PostgreSQL, Redis e sistemas distribuídos que precisam de 99.9% de uptime.",
    requirements: [
      "NestJS ou Node.js avançado",
      "PostgreSQL e Redis",
      "Arquitetura de microsserviços",
      "5+ anos de experiência",
    ],
    icon: "⚙️",
    hot: true,
  },
  {
    id: 2,
    title: "Frontend Engineer — Next.js",
    department: "Engenharia",
    location: "Remoto",
    type: "CLT",
    level: "Pleno",
    salary: "R$ 12.000 – 18.000",
    description:
      "Construa interfaces que milhares de pessoas usam todo dia para comprar a tecnologia que amam. React, Next.js, TypeScript e obsessão por performance.",
    requirements: [
      "React e Next.js avançado",
      "TypeScript",
      "CSS avançado e Tailwind",
      "3+ anos de experiência",
    ],
    icon: "🖥️",
    hot: true,
  },
  {
    id: 3,
    title: "Tech Lead — Plataforma",
    department: "Engenharia",
    location: "São Paulo · Presencial",
    type: "CLT",
    level: "Lead",
    salary: "R$ 28.000 – 38.000",
    description:
      "Lidere um time de 8 engenheiros na construção da plataforma de e-commerce mais avançada do Brasil. Decisões técnicas, mentoria e entrega de alto impacto.",
    requirements: [
      "Liderança técnica comprovada",
      "Arquitetura de sistemas distribuídos",
      "Mentoria de times",
      "8+ anos de experiência",
    ],
    icon: "🚀",
    hot: false,
  },
  {
    id: 4,
    title: "DevOps / Platform Engineer",
    department: "Engenharia",
    location: "Remoto",
    type: "CLT",
    level: "Sênior",
    salary: "R$ 16.000 – 22.000",
    description:
      "Construa e mantenha a infraestrutura que garante que nosso sistema nunca para. Kubernetes, AWS, CI/CD e cultura de SRE.",
    requirements: [
      "Kubernetes e Docker",
      "AWS ou GCP",
      "CI/CD pipelines",
      "Terraform ou Pulumi",
    ],
    icon: "🛠️",
    hot: false,
  },
  {
    id: 5,
    title: "Mobile Engineer — React Native",
    department: "Engenharia",
    location: "Remoto",
    type: "CLT ou PJ",
    level: "Pleno",
    salary: "R$ 12.000 – 16.000",
    description:
      "Construa o app que vai colocar a LUXTECH no bolso de milhões de brasileiros. React Native, performance nativa e experiência premium.",
    requirements: [
      "React Native avançado",
      "iOS e Android",
      "Expo ou CLI",
      "2+ anos mobile",
    ],
    icon: "📱",
    hot: false,
  },
  // Produto
  {
    id: 6,
    title: "Product Manager — Growth",
    department: "Produto",
    location: "São Paulo · Híbrido",
    type: "CLT",
    level: "Sênior",
    salary: "R$ 20.000 – 28.000",
    description:
      "Dono do funil de aquisição e retenção. Você vai trabalhar com dados, experimentos e uma equipe que executa rápido para crescer a base de clientes.",
    requirements: [
      "Experiência em growth hacking",
      "SQL e análise de dados",
      "A/B testing",
      "4+ anos em produto digital",
    ],
    icon: "📈",
    hot: true,
  },
  {
    id: 7,
    title: "UX/UI Designer — Product",
    department: "Produto",
    location: "Remoto",
    type: "CLT",
    level: "Pleno",
    salary: "R$ 10.000 – 15.000",
    description:
      "Design que converte. Você vai criar interfaces que fazem o usuário querer comprar — sem truques, com clareza e beleza.",
    requirements: [
      "Figma avançado",
      "Design system",
      "Pesquisa com usuários",
      "Portfolio com cases de e-commerce",
    ],
    icon: "🎨",
    hot: false,
  },
  // Vendas
  {
    id: 8,
    title: "Head of Sales",
    department: "Vendas",
    location: "São Paulo · Presencial",
    type: "CLT",
    level: "Diretor",
    salary: "R$ 30.000 – 45.000",
    description:
      "Construa e lidere o time comercial que vai levar a LUXTECH para toda a América Latina. Estratégia, execução e resultados.",
    requirements: [
      "Liderança de times de vendas",
      "Experiência em e-commerce ou varejo",
      "Inglês fluente",
      "10+ anos em vendas",
    ],
    icon: "💼",
    hot: false,
  },
  {
    id: 9,
    title: "Gerente de Contas — B2B",
    department: "Vendas",
    location: "São Paulo · Híbrido",
    type: "CLT",
    level: "Pleno",
    salary: "R$ 8.000 – 14.000",
    description:
      "Gerencie e expanda nossa base de clientes corporativos. Venda tecnologia premium para empresas que entendem o valor de investir em qualidade.",
    requirements: [
      "Experiência em vendas B2B",
      "CRM (Salesforce ou HubSpot)",
      "Negociação e fechamento",
      "3+ anos em vendas consultivas",
    ],
    icon: "🤝",
    hot: false,
  },
  // Marketing
  {
    id: 10,
    title: "Head of Marketing Digital",
    department: "Marketing",
    location: "São Paulo · Híbrido",
    type: "CLT",
    level: "Diretor",
    salary: "R$ 22.000 – 32.000",
    description:
      "Construa a estratégia que vai tornar a LUXTECH a marca de tecnologia mais desejada do Brasil. Performance, brand e conteúdo.",
    requirements: [
      "Performance marketing (Meta, Google)",
      "Brand building",
      "Time de criação",
      "7+ anos em marketing digital",
    ],
    icon: "📣",
    hot: true,
  },
  {
    id: 11,
    title: "Data Analyst — E-commerce",
    department: "Dados",
    location: "Remoto",
    type: "CLT",
    level: "Pleno",
    salary: "R$ 10.000 – 16.000",
    description:
      "Transforme dados em decisões. Você vai construir dashboards, modelos preditivos e insights que guiam toda a empresa.",
    requirements: [
      "SQL avançado",
      "Python ou R",
      "dbt e Looker",
      "Experiência em e-commerce",
    ],
    icon: "📊",
    hot: false,
  },
  {
    id: 12,
    title: "Customer Success Manager",
    department: "Operações",
    location: "São Paulo · Híbrido",
    type: "CLT",
    level: "Pleno",
    salary: "R$ 7.000 – 11.000",
    description:
      "O NPS de 94% tem um segredo: pessoas que realmente se importam. Você vai garantir que cada cliente tenha uma experiência que o faça voltar.",
    requirements: [
      "Experiência em CS ou suporte premium",
      "Empatia comprovada",
      "CRM e ferramentas de atendimento",
      "Inglês intermediário",
    ],
    icon: "💛",
    hot: false,
  },
];

const DEPARTMENTS = [
  "Todos",
  "Engenharia",
  "Produto",
  "Vendas",
  "Marketing",
  "Dados",
  "Operações",
];

const BENEFITS = [
  {
    icon: "💰",
    title: "Salário competitivo",
    description: "Top 10% do mercado, revisado anualmente",
  },
  {
    icon: "🏠",
    title: "Remote first",
    description:
      "Trabalhe de onde quiser. Escritório disponível, nunca obrigatório",
  },
  {
    icon: "📚",
    title: "Educação ilimitada",
    description: "R$3.000/ano para cursos, livros e conferências",
  },
  {
    icon: "🏥",
    title: "Saúde premium",
    description: "Plano de saúde e odontológico sem mensalidade",
  },
  {
    icon: "🍽️",
    title: "Vale refeição",
    description: "R$1.500/mês em cartão de benefícios flexíveis",
  },
  {
    icon: "⚡",
    title: "Home office setup",
    description: "R$5.000 para montar seu escritório em casa",
  },
  {
    icon: "📈",
    title: "Stock options",
    description: "Participação na empresa para todos os CLTs",
  },
  {
    icon: "🌴",
    title: "Férias + folgas",
    description: "30 dias + aniversário + 3 dias de descanso mental/ano",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Candidatura",
    description:
      "Envie seu currículo e portfólio. Respondemos em até 5 dias úteis.",
  },
  {
    step: "02",
    title: "Conversa inicial",
    description:
      "30 minutos com RH para alinhar expectativas e contar sobre a vaga.",
  },
  {
    step: "03",
    title: "Desafio técnico",
    description:
      "Um case prático relevante para a função. Sem pegadinhas — queremos ver como você pensa.",
  },
  {
    step: "04",
    title: "Entrevista técnica",
    description:
      "Conversa com o time técnico sobre o desafio e experiências anteriores.",
  },
  {
    step: "05",
    title: "Fit cultural",
    description: "Conversa com liderança sobre valores, missão e alinhamento.",
  },
  {
    step: "06",
    title: "Oferta",
    description: "Se chegou aqui, temos uma proposta boa esperando por você.",
  },
];

// ─────────────────────────────────────────────
// Card de vaga
// ─────────────────────────────────────────────
function JobCard({ job, index }: { job: (typeof JOBS)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  const levelColors: Record<string, string> = {
    Sênior: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    Pleno: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    Lead: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    Diretor: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-colors overflow-hidden"
    >
      {/* Header do card */}
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-start gap-4 p-5 text-left"
      >
        {/* Ícone */}
        <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl shrink-0">
          {job.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-base font-medium text-white">{job.title}</h3>
            {job.hot && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium">
                🔥 Hot
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-1.5">
            <span className="text-xs text-white/40">{job.department}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/40">{job.location}</span>
            <span className="text-white/20">·</span>
            <span className="text-xs text-white/40">{job.type}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`text-[10px] px-2.5 py-1 rounded-full border font-medium ${levelColors[job.level] ?? "text-white/40 bg-white/[.04] border-white/[.08]"}`}
          >
            {job.level}
          </span>
          <span className="text-xs text-amber-400 font-medium">
            {job.salary}
          </span>
        </div>
      </button>

      {/* Detalhes expandíveis */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-white/[.04] pt-4">
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                {job.description}
              </p>

              <div className="mb-5">
                <p className="text-xs text-white/30 tracking-widest mb-3">
                  REQUISITOS
                </p>
                <div className="flex flex-wrap gap-2">
                  {job.requirements.map((req) => (
                    <span
                      key={req}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/[.08] bg-white/[.03] text-white/50"
                    >
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-black"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                Candidatar-se →
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CareersPage() {
  const [activeDept, setActiveDept] = useState("Todos");

  const filteredJobs = useMemo(() => {
    if (activeDept === "Todos") return JOBS;
    return JOBS.filter((j) => j.department === activeDept);
  }, [activeDept]);

  const hotJobs = JOBS.filter((j) => j.hot).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(212,175,55,0.07) 0%, transparent 60%), #0a0a0f",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-amber-400 tracking-widest">
                {hotJobs} VAGAS QUENTES ABERTAS
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-medium text-white leading-tight mb-6">
              Venha construir o{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  backgroundClip: "text",
                }}
              >
                futuro
              </span>{" "}
              com a gente
            </h1>

            <p className="text-lg text-white/40 leading-relaxed mb-8 max-w-xl">
              Somos um time de pessoas apaixonadas que acreditam que tecnologia
              muda vidas. Se você também acredita nisso, tem um lugar aqui.
            </p>

            {/* Stats rápidos */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: `${JOBS.length}`, label: "vagas abertas" },
                { value: "150+", label: "colaboradores" },
                { value: "4.9⭐", label: "no Glassdoor" },
                { value: "Remote", label: "first culture" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-xl font-medium text-amber-400">
                    {stat.value}
                  </span>
                  <span className="text-xs text-white/30">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Benefícios ── */}
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
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-medium text-white mb-3">
              Por que a LUXTECH?
            </h2>
            <p className="text-sm text-white/40">
              Além do salário, temos o ambiente que faz você querer ficar.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-all"
              >
                <span className="text-2xl mb-3 block">{benefit.icon}</span>
                <h3 className="text-sm font-medium text-white mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-white/35 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Vagas ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl font-medium text-white mb-1">
              Vagas abertas
            </h2>
            <p className="text-sm text-white/30">
              {filteredJobs.length} vaga{filteredJobs.length !== 1 ? "s" : ""}{" "}
              {activeDept !== "Todos" ? `em ${activeDept}` : "disponíveis"}
            </p>
          </div>
        </motion.div>

        {/* Filtros por departamento */}
        <div className="flex flex-wrap gap-2 mb-8">
          {DEPARTMENTS.map((dept) => (
            <motion.button
              key={dept}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDept(dept)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeDept === dept
                  ? "text-black"
                  : "text-white/50 border border-white/[.08] hover:text-white/70"
              }`}
            >
              {activeDept === dept && (
                <motion.div
                  layoutId="dept-pill"
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #b8960c)",
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{dept}</span>
              <span
                className={`relative z-10 ml-1.5 text-[10px] ${
                  activeDept === dept ? "text-black/60" : "text-white/25"
                }`}
              >
                {dept === "Todos"
                  ? JOBS.length
                  : JOBS.filter((j) => j.department === dept).length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Lista de vagas */}
        <AnimatePresence mode="popLayout">
          <div className="flex flex-col gap-4">
            {filteredJobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </div>
        </AnimatePresence>
      </div>

      {/* ── Processo seletivo ── */}
      <div
        className="border-t border-white/[.04] py-16"
        style={{
          background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-medium text-white mb-3">
              Como é o processo
            </h2>
            <p className="text-sm text-white/40">
              Transparente, rápido e respeitoso. Levamos no máximo 3 semanas do
              início ao fim.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-2xl border border-white/[.06] bg-white/[.02]"
              >
                <span
                  className="text-2xl font-mono font-medium shrink-0"
                  style={{
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundImage:
                      "linear-gradient(135deg, #d4af37, #f5d56e)",
                    backgroundClip: "text",
                  }}
                >
                  {step.step}
                </span>
                <div>
                  <h3 className="text-sm font-medium text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/35 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA final ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-amber-400/15 p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, #0d0d1a 0%, #1a1400 50%, #0d0d1a 100%)",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400/30"
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
            <p className="text-sm text-amber-400/60 tracking-widest mb-4">
              NÃO ENCONTROU A VAGA CERTA?
            </p>
            <h2 className="text-2xl md:text-3xl font-medium text-white mb-4">
              Mande seu currículo mesmo assim
            </h2>
            <p className="text-white/40 max-w-md mx-auto mb-8">
              Guardamos talentos para vagas futuras. Se você é incrível, vamos
              encontrar um lugar para você.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl text-sm font-medium text-black"
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8960c)",
              }}
            >
              Enviar currículo espontâneo →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
