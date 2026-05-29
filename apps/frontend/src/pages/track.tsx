/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Dados simulados de rastreamento
// Em produção viriam da API de logística
// ─────────────────────────────────────────────
const MOCK_ORDERS: Record<string, TrackingData> = {
  "LUX-2026-00123": {
    orderId: "LUX-2026-00123",
    status: "SHIPPED",
    estimatedDelivery: "Amanhã, 28 de Maio",
    carrier: "JADLOG",
    trackingCode: "JD123456789BR",
    product: {
      title: "iPhone 15 Pro Max 256GB",
      image:
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200&q=80",
      quantity: 1,
    },
    origin: "São Paulo, SP",
    destination: "Rio de Janeiro, RJ",
    progressPercent: 72,
    events: [
      {
        id: 1,
        status: "delivered_hub",
        title: "Em rota de entrega",
        description: "Saiu para entrega no seu endereço",
        location: "Rio de Janeiro, RJ",
        date: "27 Mai 2026",
        time: "08:14",
        done: true,
        current: true,
      },
      {
        id: 2,
        status: "in_transit",
        title: "Chegou ao centro de distribuição",
        description: "Produto no CD do Rio de Janeiro",
        location: "Rio de Janeiro, RJ",
        date: "26 Mai 2026",
        time: "22:40",
        done: true,
        current: false,
      },
      {
        id: 3,
        status: "in_transit",
        title: "Em trânsito",
        description: "Produto a caminho do destino",
        location: "Juiz de Fora, MG",
        date: "26 Mai 2026",
        time: "11:23",
        done: true,
        current: false,
      },
      {
        id: 4,
        status: "dispatched",
        title: "Pedido despachado",
        description: "Entregue à transportadora JADLOG",
        location: "São Paulo, SP",
        date: "25 Mai 2026",
        time: "14:55",
        done: true,
        current: false,
      },
      {
        id: 5,
        status: "preparing",
        title: "Pedido em preparação",
        description: "Produto separado e embalado",
        location: "São Paulo, SP",
        date: "25 Mai 2026",
        time: "09:30",
        done: true,
        current: false,
      },
      {
        id: 6,
        status: "confirmed",
        title: "Pedido confirmado",
        description: "Pagamento aprovado e pedido confirmado",
        location: "São Paulo, SP",
        date: "24 Mai 2026",
        time: "16:22",
        done: true,
        current: false,
      },
    ],
  },
  "LUX-2026-00456": {
    orderId: "LUX-2026-00456",
    status: "DELIVERED",
    estimatedDelivery: "Entregue em 25 de Maio",
    carrier: "CORREIOS",
    trackingCode: "BR987654321SP",
    product: {
      title: "MacBook Air M3 16GB",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&q=80",
      quantity: 1,
    },
    origin: "São Paulo, SP",
    destination: "Belo Horizonte, MG",
    progressPercent: 100,
    events: [
      {
        id: 1,
        status: "delivered",
        title: "Entregue com sucesso! 🎉",
        description: "Recebido por: DANIELA F.",
        location: "Belo Horizonte, MG",
        date: "25 Mai 2026",
        time: "14:33",
        done: true,
        current: true,
      },
      {
        id: 2,
        status: "out_for_delivery",
        title: "Saiu para entrega",
        description: "Produto com entregador",
        location: "Belo Horizonte, MG",
        date: "25 Mai 2026",
        time: "08:15",
        done: true,
        current: false,
      },
      {
        id: 3,
        status: "confirmed",
        title: "Pedido confirmado",
        description: "Pagamento aprovado",
        location: "São Paulo, SP",
        date: "23 Mai 2026",
        time: "10:00",
        done: true,
        current: false,
      },
    ],
  },
};

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface TrackingEvent {
  id: number;
  status: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  done: boolean;
  current: boolean;
}

interface TrackingData {
  orderId: string;
  status: string;
  estimatedDelivery: string;
  carrier: string;
  trackingCode: string;
  product: {
    title: string;
    image: string;
    quantity: number;
  };
  origin: string;
  destination: string;
  progressPercent: number;
  events: TrackingEvent[];
}

// ─────────────────────────────────────────────
// Status config
// ─────────────────────────────────────────────
const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: string;
  }
> = {
  PENDING: {
    label: "Aguardando",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/25",
    icon: "⏳",
  },
  PAID: {
    label: "Confirmado",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/25",
    icon: "✅",
  },
  SHIPPED: {
    label: "Em trânsito",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/25",
    icon: "🚚",
  },
  DELIVERED: {
    label: "Entregue",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/25",
    icon: "📦",
  },
};

// ─────────────────────────────────────────────
// Skeleton de resultado
// Reproduz exatamente o layout para evitar CLS
// ─────────────────────────────────────────────
function TrackingSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-6">
      {/* Card do produto */}
      <div className="rounded-2xl border border-white/[.06] p-5 flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-white/[.06]" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 bg-white/[.06] rounded-full w-2/3" />
          <div className="h-3 bg-white/[.06] rounded-full w-1/3" />
          <div className="h-6 bg-white/[.06] rounded-full w-24 mt-1" />
        </div>
      </div>
      {/* Barra de progresso */}
      <div className="rounded-2xl border border-white/[.06] p-5">
        <div className="h-3 bg-white/[.06] rounded-full w-1/3 mb-4" />
        <div className="h-2 bg-white/[.06] rounded-full w-full mb-2" />
        <div className="flex justify-between">
          <div className="h-3 bg-white/[.06] rounded-full w-20" />
          <div className="h-3 bg-white/[.06] rounded-full w-20" />
        </div>
      </div>
      {/* Timeline */}
      <div className="rounded-2xl border border-white/[.06] p-5 flex flex-col gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/[.06] shrink-0" />
            <div className="flex-1 flex flex-col gap-2 pt-1">
              <div className="h-3.5 bg-white/[.06] rounded-full w-1/2" />
              <div className="h-3 bg-white/[.06] rounded-full w-3/4" />
              <div className="h-3 bg-white/[.06] rounded-full w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Barra de progresso da entrega
// ─────────────────────────────────────────────
function DeliveryProgress({
  percent,
  origin,
  destination,
  status,
}: {
  percent: number;
  origin: string;
  destination: string;
  status: string;
}) {
  const isDelivered = status === "DELIVERED";

  return (
    <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-white/40 tracking-widest">
          PROGRESSO DA ENTREGA
        </p>
        <span className="text-xs text-amber-400 font-medium">{percent}%</span>
      </div>

      {/* Barra principal */}
      <div className="relative h-2 bg-white/[.06] rounded-full overflow-visible mb-5">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: isDelivered
              ? "linear-gradient(90deg, #22c55e, #16a34a)"
              : "linear-gradient(90deg, #d4af37, #f5d56e)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        />

        {/* Ponto atual pulsando */}
        {!isDelivered && (
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 -ml-2"
            style={{ left: `${percent}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-amber-400/30"
            />
            <div className="relative w-full h-full rounded-full bg-amber-400 border-2 border-[#0a0a0f]" />
          </motion.div>
        )}
      </div>

      {/* Origem → Destino */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs text-white/50">{origin}</span>
        </div>
        <div className="flex-1 mx-3 border-t border-dashed border-white/[.08]" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/50">{destination}</span>
          <div
            className={`w-2 h-2 rounded-full ${
              isDelivered ? "bg-green-400" : "bg-white/20"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Timeline de eventos
// ─────────────────────────────────────────────
function EventTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-5">
      <p className="text-xs text-white/40 tracking-widest mb-5">
        HISTÓRICO DE EVENTOS
      </p>

      <div className="flex flex-col gap-0">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex gap-4 pb-5 last:pb-0"
          >
            {/* Ícone + linha */}
            <div className="flex flex-col items-center shrink-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: i * 0.08 + 0.2,
                  type: "spring",
                  stiffness: 300,
                }}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center text-base relative z-10 ${
                  event.current
                    ? "border-amber-400/40 bg-amber-400/15"
                    : event.done
                      ? "border-green-400/25 bg-green-400/10"
                      : "border-white/[.08] bg-white/[.03]"
                }`}
              >
                {event.current ? (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🚚
                  </motion.span>
                ) : event.done ? (
                  "✓"
                ) : (
                  "○"
                )}
              </motion.div>

              {/* Linha conectora */}
              {i < events.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.08 + 0.4, duration: 0.3 }}
                  className="w-px flex-1 my-1.5"
                  style={{
                    background: event.done
                      ? "rgba(74,222,128,0.2)"
                      : "rgba(255,255,255,0.06)",
                    transformOrigin: "top",
                  }}
                />
              )}
            </div>

            {/* Conteúdo do evento */}
            <div className="flex-1 pt-1 pb-2">
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`text-sm font-medium leading-snug ${
                    event.current
                      ? "text-amber-400"
                      : event.done
                        ? "text-white/75"
                        : "text-white/30"
                  }`}
                >
                  {event.title}
                </h4>
                <span className="text-[10px] text-white/25 shrink-0 font-mono">
                  {event.time}
                </span>
              </div>

              <p className="text-xs text-white/35 mt-0.5 leading-relaxed">
                {event.description}
              </p>

              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[9px] text-white/20">📍</span>
                <span className="text-[10px] text-white/25">
                  {event.location}
                </span>
                <span className="text-white/10">·</span>
                <span className="text-[10px] text-white/20">{event.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Card do produto rastreado
// ─────────────────────────────────────────────
function ProductCard({ data }: { data: TrackingData }) {
  const statusConfig = STATUS_CONFIG[data.status] ?? STATUS_CONFIG.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/[.06] bg-white/[.02] p-5"
    >
      <div className="flex items-start gap-4">
        {/* Imagem */}
        <div className="w-16 h-16 rounded-xl bg-white/[.04] border border-white/[.06] flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={data.product.image}
            alt={data.product.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white/80 line-clamp-1">
                {data.product.title}
              </p>
              <p className="text-xs text-white/30 mt-0.5">
                Qtd: {data.product.quantity} · Pedido #{data.orderId}
              </p>
            </div>

            {/* Badge de status */}
            <span
              className={`text-[10px] px-2.5 py-1 rounded-full border font-medium shrink-0 flex items-center gap-1 ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}
            >
              <motion.span
                animate={
                  data.status === "SHIPPED" ? { opacity: [1, 0.4, 1] } : {}
                }
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ●
              </motion.span>
              {statusConfig.label}
            </span>
          </div>

          {/* Estimativa de entrega */}
          <div
            className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl border ${
              data.status === "DELIVERED"
                ? "border-green-400/20 bg-green-400/[.06]"
                : "border-amber-400/15 bg-amber-400/[.06]"
            }`}
          >
            <span className="text-sm">
              {data.status === "DELIVERED" ? "✅" : "📅"}
            </span>
            <span
              className={`text-xs font-medium ${
                data.status === "DELIVERED"
                  ? "text-green-400"
                  : "text-amber-400"
              }`}
            >
              {data.estimatedDelivery}
            </span>
          </div>
        </div>
      </div>

      {/* Transportadora */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[.04]">
        <div className="flex items-center gap-2">
          <span className="text-white/25 text-xs">Transportadora:</span>
          <span className="text-xs font-medium text-white/60">
            {data.carrier}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/25 text-xs">Código:</span>
          <span className="text-xs font-mono text-amber-400/70">
            {data.trackingCode}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Formulário de busca
// ─────────────────────────────────────────────
function SearchForm({
  onSearch,
  loading,
}: {
  onSearch: (query: string) => void;
  loading: boolean;
}) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"order" | "email">("order");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  // Sugestões de exemplo para o usuário testar
  const examples =
    mode === "order"
      ? ["LUX-2026-00123", "LUX-2026-00456"]
      : ["daniel@test.com"];

  return (
    <div className="max-w-xl mx-auto">
      {/* Toggle modo de busca */}
      <div className="flex bg-white/[.04] rounded-xl p-1 mb-5">
        {(["order", "email"] as const).map((m) => (
          <motion.button
            key={m}
            onClick={() => {
              setMode(m);
              setQuery("");
            }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors relative`}
          >
            {mode === m && (
              <motion.div
                layoutId="search-mode"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={`relative z-10 ${
                mode === m ? "text-black" : "text-white/40"
              }`}
            >
              {m === "order" ? "📦 Número do pedido" : "📧 E-mail"}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Campo de busca */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <AnimatePresence mode="wait">
          <motion.input
            key={mode}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            type={mode === "email" ? "email" : "text"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "order" ? "Ex: LUX-2026-00123" : "Ex: seu@email.com"
            }
            className="flex-1 bg-white/[.06] border border-white/[.10] rounded-2xl px-5 py-4 text-base text-white placeholder-white/25 outline-none focus:border-amber-400/50 transition-colors font-mono"
          />
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={!query.trim() || loading}
          whileTap={{ scale: 0.96 }}
          className="px-6 py-4 rounded-2xl text-sm font-medium text-black disabled:opacity-40 shrink-0 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
            />
          ) : (
            "Rastrear →"
          )}
        </motion.button>
      </form>

      {/* Exemplos para testar */}
      <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
        <span className="text-[10px] text-white/20">Testar com:</span>
        {examples.map((ex) => (
          <motion.button
            key={ex}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setQuery(ex);
              setTimeout(() => onSearch(ex), 100);
            }}
            className="text-[10px] text-amber-400/50 hover:text-amber-400 border border-amber-400/15 hover:border-amber-400/30 px-2 py-1 rounded-lg font-mono transition-colors"
          >
            {ex}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Resultado do rastreamento
// ─────────────────────────────────────────────
function TrackingResult({ data }: { data: TrackingData }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto flex flex-col gap-5"
    >
      <ProductCard data={data} />
      <DeliveryProgress
        percent={data.progressPercent}
        origin={data.origin}
        destination={data.destination}
        status={data.status}
      />
      <EventTimeline events={data.events} />

      {/* Ações */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link href="/contact" className="flex-1">
          <motion.span
            whileTap={{ scale: 0.96 }}
            className="flex justify-center items-center gap-2 w-full py-3 rounded-xl text-sm text-white/50 border border-white/[.08] hover:border-amber-400/30 hover:text-white/70 transition-colors cursor-pointer"
          >
            💬 Falar com suporte
          </motion.span>
        </Link>
        <Link href="/returns" className="flex-1">
          <motion.span
            whileTap={{ scale: 0.96 }}
            className="flex justify-center items-center gap-2 w-full py-3 rounded-xl text-sm text-white/50 border border-white/[.08] hover:border-amber-400/30 hover:text-white/70 transition-colors cursor-pointer"
          >
            🔄 Solicitar troca
          </motion.span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function TrackPage() {
  const [searchResult, setSearchResult] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  function handleSearch(query: string) {
    setLoading(true);
    setNotFound(false);
    setHasSearched(true);

    // Simula delay de API — torna a experiência mais realista
    // Em produção seria uma chamada real à API de logística
    setTimeout(() => {
      const result =
        MOCK_ORDERS[query.toUpperCase()] ??
        Object.values(MOCK_ORDERS).find((o) => o.trackingCode === query);

      if (result) {
        setSearchResult(result);
      } else {
        setSearchResult(null);
        setNotFound(true);
      }
      setLoading(false);
    }, 1400);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 60%), #0a0a0f",
        }}
      >
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
            {/* Ícone com animação de caminhão */}
            <motion.div
              animate={{ x: [-4, 4, -4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl mb-6 inline-block"
            >
              🚚
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-400 tracking-widest">
                RASTREAMENTO EM TEMPO REAL
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-medium text-white mb-4 leading-tight"
            >
              Onde está{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  backgroundClip: "text",
                }}
              >
                seu pedido?
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 max-w-md mx-auto mb-10"
            >
              Rastreie em tempo real com número do pedido ou e-mail cadastrado.
            </motion.p>

            {/* Formulário de busca */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <SearchForm onSearch={handleSearch} loading={loading} />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Resultado ── */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <AnimatePresence mode="wait">
          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto mt-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full"
                />
                <span className="text-sm text-white/40">
                  Buscando informações do pedido...
                </span>
              </div>
              <TrackingSkeleton />
            </motion.div>
          )}

          {/* Resultado encontrado */}
          {!loading && searchResult && (
            <motion.div key="result" className="mt-8">
              <div className="flex items-center gap-3 max-w-2xl mx-auto mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                  className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center text-[10px] font-bold text-black"
                >
                  ✓
                </motion.div>
                <span className="text-sm text-white/40">Pedido encontrado</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchResult(null);
                    setHasSearched(false);
                    setNotFound(false);
                  }}
                  className="ml-auto text-xs text-white/25 hover:text-white/50 transition-colors"
                >
                  ← Nova busca
                </motion.button>
              </div>
              <TrackingResult data={searchResult} />
            </motion.div>
          )}

          {/* Não encontrado */}
          {!loading && notFound && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-md mx-auto mt-12 text-center flex flex-col items-center gap-5"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="text-5xl"
              >
                🔍
              </motion.div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Pedido não encontrado
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Verifique se o número do pedido está correto. Pedidos recentes
                  podem levar até 2 horas para aparecer no sistema.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setNotFound(false);
                    setHasSearched(false);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-medium text-black"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #b8960c)",
                  }}
                >
                  Tentar novamente
                </motion.button>
                <Link href="/contact">
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className="flex w-full justify-center py-3 rounded-xl text-sm text-white/50 border border-white/[.08] hover:border-amber-400/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    Falar com suporte →
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Estado inicial — sem busca */}
        {!hasSearched && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto mt-12"
          >
            {/* Dicas */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-5 rounded-full bg-amber-400" />
              <p className="text-xs text-white/30 tracking-widest">
                ONDE ENCONTRAR MEU NÚMERO DE PEDIDO?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "📧",
                  title: "E-mail de confirmação",
                  description:
                    'Enviamos para seu e-mail logo após a compra. Assunto: "Pedido confirmado #LUX-..."',
                },
                {
                  icon: "👤",
                  title: "Minha conta",
                  description:
                    'Acesse "Meus Pedidos" na sua conta LUXTECH para ver todos os seus pedidos.',
                },
                {
                  icon: "💬",
                  title: "Suporte",
                  description:
                    "Não encontrou? Nosso time localiza seu pedido em menos de 2 minutos.",
                },
              ].map((tip, i) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex flex-col gap-3 p-4 rounded-2xl border border-white/[.06] bg-white/[.02]"
                >
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white/70 mb-1">
                      {tip.title}
                    </p>
                    <p className="text-xs text-white/30 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
