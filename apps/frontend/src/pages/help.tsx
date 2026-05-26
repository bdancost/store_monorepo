/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Base de conhecimento — dados separados do JSX
// Em produção viria de um CMS como Contentful ou Sanity
// ─────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "pedidos",
    icon: "📦",
    title: "Pedidos",
    description: "Acompanhamento, cancelamento e alterações",
    color: "from-blue-500/10 to-transparent",
    border: "border-blue-500/20",
    accent: "text-blue-400",
    count: 8,
  },
  {
    id: "pagamentos",
    icon: "💳",
    title: "Pagamentos",
    description: "Formas de pagamento, parcelamento e cobranças",
    color: "from-green-500/10 to-transparent",
    border: "border-green-500/20",
    accent: "text-green-400",
    count: 6,
  },
  {
    id: "entrega",
    icon: "🚚",
    title: "Entrega",
    description: "Prazos, rastreamento e regiões atendidas",
    color: "from-amber-500/10 to-transparent",
    border: "border-amber-500/20",
    accent: "text-amber-400",
    count: 7,
  },
  {
    id: "trocas",
    icon: "🔄",
    title: "Trocas e devoluções",
    description: "Política, prazos e como solicitar",
    color: "from-purple-500/10 to-transparent",
    border: "border-purple-500/20",
    accent: "text-purple-400",
    count: 5,
  },
  {
    id: "conta",
    icon: "👤",
    title: "Minha conta",
    description: "Cadastro, senha e dados pessoais",
    color: "from-pink-500/10 to-transparent",
    border: "border-pink-500/20",
    accent: "text-pink-400",
    count: 6,
  },
  {
    id: "produtos",
    icon: "🛍️",
    title: "Produtos",
    description: "Garantia, especificações e disponibilidade",
    color: "from-orange-500/10 to-transparent",
    border: "border-orange-500/20",
    accent: "text-orange-400",
    count: 9,
  },
];

const FAQS = [
  // Pedidos
  {
    id: 1,
    category: "pedidos",
    question: "Como acompanho meu pedido?",
    answer:
      "Você pode acompanhar seu pedido de duas formas: pelo e-mail de confirmação que enviamos com o link de rastreamento, ou acessando 'Meus Pedidos' na sua conta LUXTECH. O status é atualizado em tempo real assim que há movimentação na entrega.",
    helpful: 0,
    views: 2847,
  },
  {
    id: 2,
    category: "pedidos",
    question: "Posso cancelar meu pedido?",
    answer:
      "Sim! Pedidos com status 'Aguardando pagamento' ou 'Pagamento confirmado' podem ser cancelados diretamente pelo app ou site. Acesse 'Meus Pedidos', selecione o pedido e clique em 'Cancelar pedido'. Após o envio, não é possível cancelar — mas você pode solicitar devolução em até 30 dias.",
    helpful: 0,
    views: 1923,
  },
  {
    id: 3,
    category: "pedidos",
    question: "Meu pedido está atrasado. O que fazer?",
    answer:
      "Verificamos automaticamente pedidos com atraso superior a 2 dias úteis. Você receberá um e-mail com atualização. Se preferir, entre em contato via chat — nosso time tem acesso direto à transportadora e resolve em até 2 horas úteis.",
    helpful: 0,
    views: 3102,
  },
  // Pagamentos
  {
    id: 4,
    category: "pagamentos",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos cartão de crédito (até 12x sem juros nos produtos elegíveis), cartão de débito, PIX com 5% de desconto, boleto bancário e LUXTECH Pay — nosso sistema de crédito exclusivo para membros Premium.",
    helpful: 0,
    views: 4521,
  },
  {
    id: 5,
    category: "pagamentos",
    question: "O PIX tem desconto?",
    answer:
      "Sim! Pagamentos via PIX têm 5% de desconto automático sobre o valor do pedido. O desconto é aplicado no checkout antes da confirmação. Não é cumulativo com outros cupons percentuais, mas é válido junto com frete grátis.",
    helpful: 0,
    views: 2198,
  },
  {
    id: 6,
    category: "pagamentos",
    question: "Meu pagamento foi recusado. O que faço?",
    answer:
      "Pagamentos recusados geralmente acontecem por: limite insuficiente no cartão, dados digitados incorretamente, ou bloqueio antifraude do banco. Sugerimos: verificar os dados do cartão, tentar outro cartão, ou usar PIX para aprovação imediata.",
    helpful: 0,
    views: 1876,
  },
  // Entrega
  {
    id: 7,
    category: "entrega",
    question: "Qual o prazo de entrega?",
    answer:
      "O prazo varia por região e produto. Para capitais: 1–3 dias úteis. Para interior: 3–7 dias úteis. Produtos em estoque local são entregues em até 24h em São Paulo capital. O prazo exato aparece no checkout antes de finalizar o pedido.",
    helpful: 0,
    views: 5234,
  },
  {
    id: 8,
    category: "entrega",
    question: "Entregam em todo o Brasil?",
    answer:
      "Sim, entregamos em todo o território nacional, incluindo zonas rurais. Para localidades muito remotas, o prazo pode ser de 10–15 dias úteis e o frete calculado no checkout. Algumas regiões da Amazônia têm restrições para itens de grande volume.",
    helpful: 0,
    views: 1654,
  },
  {
    id: 9,
    category: "entrega",
    question: "Como funciona o frete grátis?",
    answer:
      "Frete grátis automático em pedidos acima de R$299. Para membros LUXTECH Premium, o frete é sempre grátis independente do valor. O benefício aparece automaticamente no checkout quando o critério é atingido — sem cupom necessário.",
    helpful: 0,
    views: 3891,
  },
  // Trocas
  {
    id: 10,
    category: "trocas",
    question: "Qual o prazo para devolver um produto?",
    answer:
      "Você tem 30 dias corridos a partir da data de entrega para solicitar devolução ou troca, conforme o Código de Defesa do Consumidor. Para defeito de fabricação, o prazo é de 90 dias. O produto precisa estar em sua embalagem original com todos os acessórios.",
    helpful: 0,
    views: 2943,
  },
  {
    id: 11,
    category: "trocas",
    question: "A devolução tem custo?",
    answer:
      "Não! A coleta para devolução é gratuita em todo o Brasil. Agendamos a retirada no endereço de entrega original em até 2 dias úteis após a solicitação. O reembolso é processado em até 5 dias úteis após recebermos o produto.",
    helpful: 0,
    views: 2187,
  },
  // Conta
  {
    id: 12,
    category: "conta",
    question: "Esqueci minha senha. Como recupero?",
    answer:
      "Na tela de login, clique em 'Esqueci minha senha'. Você receberá um e-mail com link de redefinição em até 2 minutos. O link expira em 30 minutos por segurança. Se não receber, verifique a caixa de spam ou entre em contato com o suporte.",
    helpful: 0,
    views: 3421,
  },
  {
    id: 13,
    category: "conta",
    question: "Como altero meu e-mail cadastrado?",
    answer:
      "Acesse 'Meu Perfil' → 'Informações da conta' → 'Alterar e-mail'. Por segurança, enviaremos um código de verificação para o e-mail atual antes de confirmar a alteração. O processo leva menos de 2 minutos.",
    helpful: 0,
    views: 1234,
  },
  // Produtos
  {
    id: 14,
    category: "produtos",
    question: "Os produtos têm garantia?",
    answer:
      "Todos os produtos têm garantia mínima de 12 meses do fabricante. Eletrônicos premium têm 24 meses. Além disso, oferecemos a Garantia LUXTECH: se o produto apresentar defeito nos primeiros 7 dias, trocamos por um novo sem burocracia.",
    helpful: 0,
    views: 4123,
  },
  {
    id: 15,
    category: "produtos",
    question: "Os produtos são originais?",
    answer:
      "100% originais e com nota fiscal. Todos os nossos produtos vêm diretamente dos fabricantes ou distribuidores autorizados. Cada produto possui número de série verificável no site do fabricante. Nunca vendemos réplicas ou produtos recondicionados sem indicação explícita.",
    helpful: 0,
    views: 3876,
  },
];

const POPULAR_ARTICLES = FAQS.sort((a, b) => b.views - a.views).slice(0, 4);

// ─────────────────────────────────────────────
// Highlight de termo de busca no texto
// Divide o texto pelo termo e envolve em <mark>
// ─────────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-400/25 text-amber-300 rounded px-0.5 not-italic"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
}

// ─────────────────────────────────────────────
// Item de FAQ com accordion
// ─────────────────────────────────────────────
function FAQItem({
  faq,
  isOpen,
  onToggle,
  query,
}: {
  faq: (typeof FAQS)[0];
  isOpen: boolean;
  onToggle: () => void;
  query: string;
}) {
  const [feedback, setFeedback] = useState<"helpful" | "not_helpful" | null>(
    null,
  );

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-colors overflow-hidden ${
        isOpen
          ? "border-amber-400/25 bg-amber-400/[.03]"
          : "border-white/[.06] bg-white/[.02] hover:border-white/[.10]"
      }`}
    >
      {/* Pergunta — clicável */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        {/* Ícone rotacionável */}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`text-lg shrink-0 transition-colors ${
            isOpen ? "text-amber-400" : "text-white/30"
          }`}
        >
          +
        </motion.span>

        <span
          className={`flex-1 text-sm font-medium leading-snug transition-colors ${
            isOpen ? "text-amber-400" : "text-white/75"
          }`}
        >
          <HighlightText text={faq.question} query={query} />
        </span>

        {/* Contador de visualizações */}
        <span className="text-[10px] text-white/20 shrink-0 hidden sm:block">
          {faq.views.toLocaleString("pt-BR")} visualizações
        </span>
      </button>

      {/* Resposta expandível */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-amber-400/10 pt-4">
              <p className="text-sm text-white/55 leading-relaxed mb-5">
                <HighlightText text={faq.answer} query={query} />
              </p>

              {/* Feedback de utilidade */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/25">Isso te ajudou?</span>

                {feedback ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs text-amber-400"
                  >
                    {feedback === "helpful"
                      ? "✅ Ótimo! Fico feliz em ajudar."
                      : "😔 Vamos melhorar isso. Obrigado pelo feedback!"}
                  </motion.span>
                ) : (
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFeedback("helpful")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[.08] bg-white/[.04] text-xs text-white/40 hover:border-green-400/30 hover:text-green-400 transition-colors"
                    >
                      👍 Sim
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setFeedback("not_helpful")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[.08] bg-white/[.04] text-xs text-white/40 hover:border-red-400/30 hover:text-red-400 transition-colors"
                    >
                      👎 Não
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Barra de busca inteligente
// ─────────────────────────────────────────────
function SmartSearch({
  value,
  onChange,
  resultCount,
}: {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}) {
  const suggestions = [
    "Como rastrear meu pedido?",
    "Prazo de entrega",
    "Política de devolução",
    "Parcelamento sem juros",
  ];

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="relative">
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Como podemos te ajudar?"
          className="w-full bg-white/[.06] border border-white/[.10] rounded-2xl pl-14 pr-6 py-4 text-base text-white placeholder-white/30 outline-none focus:border-amber-400/50 transition-colors shadow-lg"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}
        />
        {/* Contador de resultados */}
        <AnimatePresence>
          {value && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
            >
              <span className="text-xs text-amber-400/70 bg-amber-400/10 border border-amber-400/20 px-2.5 py-1 rounded-full">
                {resultCount} resultado{resultCount !== 1 ? "s" : ""}
              </span>
              {value && (
                <button
                  onClick={() => onChange("")}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-white/[.08] text-white/40 hover:text-white/70 transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sugestões de busca */}
      {!value && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center gap-2 mt-4"
        >
          {suggestions.map((suggestion) => (
            <motion.button
              key={suggestion}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full border border-white/[.08] bg-white/[.04] text-white/40 hover:border-amber-400/30 hover:text-amber-400/80 transition-colors"
            >
              {suggestion}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function HelpPage() {
  const [search, setSearchRaw] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce — não filtra a cada tecla
  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setOpenFAQ(null); // fecha accordion ao buscar
    }, 300);
  }, []);

  // Filtragem com busca + categoria
  const filteredFAQs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchCategory = !activeCategory || faq.category === activeCategory;
      const searchLower = debouncedSearch.toLowerCase();
      const matchSearch =
        !debouncedSearch ||
        faq.question.toLowerCase().includes(searchLower) ||
        faq.answer.toLowerCase().includes(searchLower);
      return matchCategory && matchSearch;
    });
  }, [activeCategory, debouncedSearch]);

  function handleToggleFAQ(id: number) {
    setOpenFAQ((prev) => (prev === id ? null : id));
  }

  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <div
        ref={heroRef}
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.12) 0%, transparent 65%), #0a0a0f",
        }}
      >
        {/* Grade decorativa */}
        <div
          className="absolute inset-0 opacity-[.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,175,55,1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Ícone animado */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6 block"
            >
              🎯
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-amber-400 tracking-widest">
                CENTRAL DE AJUDA · SUPORTE 24/7
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-medium text-white mb-4 leading-tight"
            >
              Como podemos{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  backgroundClip: "text",
                }}
              >
                te ajudar?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 mb-10 max-w-md mx-auto"
            >
              Mais de {FAQS.length} artigos de ajuda. Encontre sua resposta em
              segundos.
            </motion.p>

            {/* Busca inteligente */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SmartSearch
                value={search}
                onChange={setSearch}
                resultCount={filteredFAQs.length}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Categorias visuais ── */}
      <AnimatePresence>
        {!debouncedSearch && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 py-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-amber-400" />
              <h2 className="text-base font-medium text-white">
                Explorar por categoria
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat.id ? null : cat.id)
                  }
                  className={`relative flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all text-center ${
                    activeCategory === cat.id
                      ? `${cat.border} bg-gradient-to-br ${cat.color}`
                      : "border-white/[.06] bg-white/[.02] hover:border-white/[.12]"
                  }`}
                >
                  {activeCategory === cat.id && (
                    <motion.div
                      layoutId="category-glow"
                      className="absolute inset-0 rounded-2xl"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08), transparent 70%)",
                      }}
                    />
                  )}

                  <motion.span
                    animate={
                      activeCategory === cat.id
                        ? { scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }
                        : {}
                    }
                    transition={{ duration: 0.4 }}
                    className="text-3xl relative z-10"
                  >
                    {cat.icon}
                  </motion.span>

                  <div className="relative z-10">
                    <p
                      className={`text-xs font-medium mb-0.5 ${
                        activeCategory === cat.id ? cat.accent : "text-white/70"
                      }`}
                    >
                      {cat.title}
                    </p>
                    <p className="text-[10px] text-white/25">
                      {cat.count} artigos
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Artigos populares (sem busca e sem categoria) ── */}
      <AnimatePresence>
        {!debouncedSearch && !activeCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-7xl mx-auto px-6 pb-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-6 rounded-full bg-amber-400" />
              <h2 className="text-base font-medium text-white">
                Mais acessados
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {POPULAR_ARTICLES.map((article, i) => (
                <motion.button
                  key={article.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    const cat = CATEGORIES.find(
                      (c) => c.id === article.category,
                    );
                    setActiveCategory(article.category);
                    setTimeout(() => setOpenFAQ(article.id), 100);
                  }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-all text-left group"
                >
                  <span className="text-xl shrink-0">
                    {CATEGORIES.find((c) => c.id === article.category)?.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/70 group-hover:text-white transition-colors truncate">
                      {article.question}
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">
                      {article.views.toLocaleString("pt-BR")} visualizações
                    </p>
                  </div>
                  <span className="text-white/20 group-hover:text-amber-400 transition-colors text-sm shrink-0">
                    →
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Lista de FAQs ── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Header da seção */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 rounded-full bg-amber-400" />
            <h2 className="text-base font-medium text-white">
              {debouncedSearch
                ? `Resultados para "${debouncedSearch}"`
                : activeCategory
                  ? CATEGORIES.find((c) => c.id === activeCategory)?.title
                  : "Todos os artigos"}
            </h2>
            <span className="text-xs text-white/25">
              {filteredFAQs.length} artigo{filteredFAQs.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Limpar filtro */}
          {(activeCategory || debouncedSearch) && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(null);
                setSearch("");
                setOpenFAQ(null);
              }}
              className="text-xs text-white/30 hover:text-white/60 border border-white/[.08] px-3 py-1.5 rounded-lg transition-colors"
            >
              Limpar filtros ✕
            </motion.button>
          )}
        </div>

        {/* FAQs */}
        <AnimatePresence mode="popLayout">
          {filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4 text-center"
            >
              <span className="text-5xl">🔍</span>
              <h3 className="text-lg font-medium text-white">
                Nenhum resultado encontrado
              </h3>
              <p className="text-sm text-white/40 max-w-sm">
                Tente buscar com outros termos ou fale diretamente com nosso
                suporte.
              </p>
              <Link href="/contact">
                <motion.span
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex mt-2 px-6 py-3 rounded-xl text-sm font-medium text-black cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #b8960c)",
                  }}
                >
                  Falar com suporte →
                </motion.span>
              </Link>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredFAQs.map((faq, i) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <FAQItem
                    faq={faq}
                    isOpen={openFAQ === faq.id}
                    onToggle={() => handleToggleFAQ(faq.id)}
                    query={debouncedSearch}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CTA de suporte humano ── */}
      <div
        className="border-t border-white/[.04] py-16"
        style={{
          background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-medium text-white mb-3">
              Não encontrou sua resposta?
            </h2>
            <p className="text-white/40">
              Nosso time está pronto para te ajudar em tempo real.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "💬",
                title: "Chat ao vivo",
                description: "Resposta em menos de 2 minutos",
                status: "Online agora",
                statusColor: "text-green-400",
                action: "Iniciar chat",
                href: "/contact",
                primary: true,
              },
              {
                icon: "📧",
                title: "E-mail",
                description: "Resposta em até 4 horas úteis",
                status: "24/7 disponível",
                statusColor: "text-blue-400",
                action: "Enviar e-mail",
                href: "/contact",
                primary: false,
              },
              {
                icon: "📱",
                title: "WhatsApp",
                description: "Atendimento humanizado",
                status: "Seg–Sex 9h–18h",
                statusColor: "text-amber-400",
                action: "Abrir WhatsApp",
                href: "#",
                primary: false,
              },
            ].map((channel, i) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`flex flex-col gap-4 p-6 rounded-2xl border transition-all ${
                  channel.primary
                    ? "border-amber-400/25 bg-amber-400/[.04]"
                    : "border-white/[.06] bg-white/[.02] hover:border-white/[.12]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{channel.icon}</span>
                  <span
                    className={`text-[10px] font-medium ${channel.statusColor}`}
                  >
                    ● {channel.status}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-base font-medium text-white mb-1">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-white/40">{channel.description}</p>
                </div>

                <Link href={channel.href}>
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className={`inline-flex w-full justify-center py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      channel.primary
                        ? "text-black"
                        : "text-white/60 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80"
                    }`}
                    style={
                      channel.primary
                        ? {
                            background:
                              "linear-gradient(135deg, #d4af37, #b8960c)",
                          }
                        : {}
                    }
                  >
                    {channel.action} →
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
