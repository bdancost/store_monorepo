/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/purity */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Configuração dos canais de suporte
// ─────────────────────────────────────────────
const SUPPORT_CHANNELS = [
  {
    id: "chat",
    icon: "💬",
    title: "Chat ao vivo",
    subtitle: "Mais rápido",
    waitTime: "~2 min",
    agentsOnline: 8,
    available: true,
    color: "border-green-400/30 bg-green-400/[.04]",
    badge: "text-green-400",
    badgeBg: "bg-green-400/10 border-green-400/20",
    recommended: true,
  },
  {
    id: "whatsapp",
    icon: "📱",
    title: "WhatsApp",
    subtitle: "Atendimento humanizado",
    waitTime: "~15 min",
    agentsOnline: 4,
    available: true,
    color: "border-white/[.08] bg-white/[.02]",
    badge: "text-amber-400",
    badgeBg: "bg-amber-400/10 border-amber-400/20",
    recommended: false,
  },
  {
    id: "email",
    icon: "📧",
    title: "E-mail",
    subtitle: "Para questões complexas",
    waitTime: "~4 horas",
    agentsOnline: 12,
    available: true,
    color: "border-white/[.08] bg-white/[.02]",
    badge: "text-blue-400",
    badgeBg: "bg-blue-400/10 border-blue-400/20",
    recommended: false,
  },
];

// ─────────────────────────────────────────────
// Assuntos e campos dinâmicos
// ─────────────────────────────────────────────
const SUBJECTS = [
  {
    id: "order",
    label: "Problema com pedido",
    icon: "📦",
    extraFields: [
      {
        id: "order_number",
        label: "Número do pedido",
        placeholder: "Ex: LUX-2026-00123",
        type: "text",
      },
    ],
  },
  {
    id: "payment",
    label: "Dúvida sobre pagamento",
    icon: "💳",
    extraFields: [],
  },
  {
    id: "product",
    label: "Informação sobre produto",
    icon: "🛍️",
    extraFields: [
      {
        id: "product_model",
        label: "Modelo do produto",
        placeholder: "Ex: iPhone 15 Pro Max 256GB",
        type: "text",
      },
    ],
  },
  {
    id: "return",
    label: "Troca ou devolução",
    icon: "🔄",
    extraFields: [
      {
        id: "order_number",
        label: "Número do pedido",
        placeholder: "Ex: LUX-2026-00123",
        type: "text",
      },
    ],
  },
  {
    id: "account",
    label: "Problema com minha conta",
    icon: "👤",
    extraFields: [],
  },
  {
    id: "other",
    label: "Outro assunto",
    icon: "💡",
    extraFields: [],
  },
];

// ─────────────────────────────────────────────
// Chat simulado com typing indicator
// ─────────────────────────────────────────────
const CHAT_MESSAGES = [
  {
    id: 1,
    from: "agent",
    name: "Sofia — Suporte LUXTECH",
    avatar: "SM",
    text: "Olá! 👋 Sou a Sofia, do time de suporte da LUXTECH. Como posso te ajudar hoje?",
    delay: 0,
  },
  {
    id: 2,
    from: "agent",
    name: "Sofia — Suporte LUXTECH",
    avatar: "SM",
    text: "Enquanto você digita, já vou puxando o histórico da sua conta aqui. ⚡",
    delay: 2000,
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-white/40"
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

function LiveChat() {
  const [messages, setMessages] = useState<typeof CHAT_MESSAGES>([]);
  const [showTyping, setShowTyping] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);
  const [agentOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simula o agente aparecendo e digitando
  useEffect(() => {
    if (!chatStarted) return;

    // Mostra typing indicator
    setShowTyping(true);

    const timers: ReturnType<typeof setTimeout>[] = [];

    CHAT_MESSAGES.forEach((msg, i) => {
      // Esconde typing antes de mostrar mensagem
      timers.push(
        setTimeout(() => {
          setShowTyping(false);
          setMessages((prev) => [...prev, msg]);

          // Mostra typing novamente se houver próxima mensagem
          if (i < CHAT_MESSAGES.length - 1) {
            setTimeout(() => setShowTyping(true), 200);
          }
        }, msg.delay + 1500),
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [chatStarted]);

  // Scroll automático para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTyping]);

  if (!chatStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-64 gap-5 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          💬
        </motion.div>
        <div>
          <p className="text-base font-medium text-white mb-1">
            Chat ao vivo disponível
          </p>
          <p className="text-sm text-white/40">
            8 agentes online agora · Espera ~2 minutos
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setChatStarted(true)}
          className="px-6 py-3 rounded-xl text-sm font-medium text-black"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          Iniciar conversa →
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-80">
      {/* Header do chat */}
      <div className="flex items-center gap-3 pb-3 border-b border-white/[.06] mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium text-black shrink-0"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          SM
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">
            Sofia — Suporte LUXTECH
          </p>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-green-400"
            />
            <p className="text-[10px] text-green-400">Online agora</p>
          </div>
        </div>
        <span className="text-xs text-white/20">Encriptado 🔒</span>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex items-end gap-2"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-black shrink-0"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                {msg.avatar}
              </div>
              <div
                className="max-w-[80%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm text-white/80"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {showTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-end gap-2"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-medium text-black shrink-0"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                SM
              </div>
              <div
                className="px-3 py-1 rounded-2xl rounded-bl-sm"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <TypingIndicator />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input do chat */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-white/[.06]">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-black shrink-0"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          ↗
        </motion.button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Formulário adaptativo
// ─────────────────────────────────────────────
function AdaptiveForm() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    order_number: "",
    product_model: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");

  const subject = SUBJECTS.find((s) => s.id === selectedSubject);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-12 gap-5 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="text-6xl"
        >
          ✅
        </motion.div>
        <div>
          <h3 className="text-xl font-medium text-white mb-2">
            Mensagem enviada!
          </h3>
          <p className="text-sm text-white/40 max-w-sm">
            Nosso time recebeu sua mensagem e responderá em até{" "}
            <span className="text-amber-400">4 horas úteis</span>. Você receberá
            uma confirmação por e-mail.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl border border-amber-400/15 bg-amber-400/5">
          <p className="text-xs text-white/30">Número do protocolo</p>
          <p className="text-base font-mono font-medium text-amber-400">
            #SUP-{Math.random().toString(36).slice(2, 8).toUpperCase()}
          </p>
          <p className="text-[10px] text-white/20">
            Guarde esse número para acompanhar seu atendimento
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => {
            setSubmitted(false);
            setSelectedSubject(null);
            setFormData({
              name: "",
              email: "",
              message: "",
              order_number: "",
              product_model: "",
            });
          }}
          className="text-sm text-white/40 hover:text-white/60 transition-colors"
        >
          Enviar nova mensagem
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Seletor de assunto */}
      <div>
        <label className="text-[10px] text-white/30 tracking-widest mb-3 block">
          ASSUNTO
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SUBJECTS.map((subj) => (
            <motion.button
              key={subj.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedSubject(subj.id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all text-left ${
                selectedSubject === subj.id
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  : "border-white/[.08] bg-white/[.03] text-white/50 hover:border-white/[.15]"
              }`}
            >
              <span>{subj.icon}</span>
              <span className="text-xs leading-tight">{subj.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Campos dinâmicos por assunto */}
      <AnimatePresence>
        {subject?.extraFields.map((field) => (
          <motion.div
            key={field.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <label className="text-[10px] text-white/30 tracking-widest mb-2 block">
              {field.label.toUpperCase()}
            </label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id as keyof typeof formData]}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
              }
              className="w-full bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Campos base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/30 tracking-widest">
            NOME
          </label>
          <input
            type="text"
            required
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/30 tracking-widest">
            E-MAIL
          </label>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
      </div>

      {/* Prioridade */}
      <div>
        <label className="text-[10px] text-white/30 tracking-widest mb-2 block">
          PRIORIDADE
        </label>
        <div className="flex gap-2">
          {[
            {
              id: "normal",
              label: "Normal",
              icon: "🟡",
              desc: "Resposta em 4h",
            },
            {
              id: "urgent",
              label: "Urgente",
              icon: "🔴",
              desc: "Resposta em 1h",
            },
          ].map((p) => (
            <motion.button
              key={p.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setPriority(p.id as "normal" | "urgent")}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                priority === p.id
                  ? "border-amber-400/40 bg-amber-400/10 text-amber-400"
                  : "border-white/[.08] bg-white/[.03] text-white/50"
              }`}
            >
              <span>{p.icon}</span>
              <div className="text-left">
                <p className="text-xs font-medium">{p.label}</p>
                <p className="text-[10px] text-white/30">{p.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mensagem */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/30 tracking-widest">
          MENSAGEM
        </label>
        <textarea
          required
          rows={4}
          placeholder="Descreva em detalhes como podemos te ajudar..."
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors resize-none"
        />
        <p className="text-[10px] text-white/20 text-right">
          {formData.message.length}/500 caracteres
        </p>
      </div>

      {/* Enviar */}
      <motion.button
        type="submit"
        whileTap={{ scale: 0.97 }}
        disabled={!selectedSubject}
        className="w-full py-3.5 rounded-xl text-sm font-medium text-black disabled:opacity-40 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
      >
        <motion.div
          className="absolute inset-0 -skew-x-12"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative z-10">
          {selectedSubject ? "Enviar mensagem →" : "Selecione um assunto"}
        </span>
      </motion.button>

      {!selectedSubject && (
        <p className="text-[10px] text-white/20 text-center">
          Selecione o assunto acima para habilitar o envio
        </p>
      )}
    </form>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function ContactPage() {
  const [activeChannel, setActiveChannel] = useState("chat");

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

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-6 block"
            >
              🤝
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-400/20 bg-green-400/5 mb-6"
            >
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-green-400"
              />
              <span className="text-xs text-green-400 tracking-widest">
                8 AGENTES ONLINE AGORA
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-medium text-white mb-4 leading-tight"
            >
              Estamos aqui{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  backgroundClip: "text",
                }}
              >
                para você
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 max-w-md mx-auto"
            >
              Escolha o canal que prefere. Prometemos: sem scripts prontos, sem
              transferências desnecessárias.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Seletor de canal ── */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {SUPPORT_CHANNELS.map((channel, i) => (
            <motion.button
              key={channel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveChannel(channel.id)}
              className={`relative flex flex-col gap-4 p-5 rounded-2xl border transition-all text-left ${
                activeChannel === channel.id
                  ? channel.color
                  : "border-white/[.06] bg-white/[.02] hover:border-white/[.12]"
              }`}
            >
              {/* Badge recomendado */}
              {channel.recommended && (
                <div className="absolute -top-2.5 left-4">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400 text-black font-medium">
                    ⭐ Recomendado
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between mt-1">
                <span className="text-2xl">{channel.icon}</span>
                <span
                  className={`text-[10px] px-2 py-1 rounded-full border font-medium ${channel.badgeBg} ${channel.badge}`}
                >
                  ● {channel.waitTime}
                </span>
              </div>

              <div>
                <h3 className="text-base font-medium text-white mb-0.5">
                  {channel.title}
                </h3>
                <p className="text-xs text-white/40">{channel.subtitle}</p>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {[...Array(Math.min(3, channel.agentsOnline))].map((_, j) => (
                    <div
                      key={j}
                      className="w-5 h-5 rounded-full border border-[#0a0a0f] flex items-center justify-center text-[8px] font-medium text-black"
                      style={{
                        background: `linear-gradient(135deg, hsl(${40 + j * 30}, 70%, 50%), hsl(${60 + j * 30}, 70%, 40%))`,
                      }}
                    >
                      {String.fromCharCode(65 + j)}
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-white/30">
                  {channel.agentsOnline} agentes disponíveis
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* ── Área principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Painel do canal selecionado */}
          <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChannel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {activeChannel === "chat" && (
                  <>
                    <h2 className="text-base font-medium text-white mb-1">
                      Chat ao vivo
                    </h2>
                    <p className="text-xs text-white/30 mb-5">
                      Conectando você com um agente real
                    </p>
                    <LiveChat />
                  </>
                )}

                {activeChannel === "whatsapp" && (
                  <div className="flex flex-col items-center justify-center h-64 gap-5 text-center">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl"
                    >
                      📱
                    </motion.div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-2">
                        WhatsApp LUXTECH
                      </h3>
                      <p className="text-sm text-white/40 max-w-xs">
                        Clique abaixo para abrir uma conversa direta com nosso
                        time. Atendimento Seg–Sex, 9h–18h.
                      </p>
                    </div>
                    <motion.a
                      href="https://wa.me/5511999990000"
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.96 }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white"
                      style={{ background: "#25D366" }}
                    >
                      <span>📱</span> Abrir WhatsApp →
                    </motion.a>
                    <p className="text-xs text-white/20">+55 (11) 99999-0000</p>
                  </div>
                )}

                {activeChannel === "email" && (
                  <div className="flex flex-col items-center justify-center h-64 gap-5 text-center">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl"
                    >
                      📧
                    </motion.div>
                    <div>
                      <h3 className="text-base font-medium text-white mb-2">
                        Enviar e-mail
                      </h3>
                      <p className="text-sm text-white/40 max-w-xs">
                        Para questões complexas que precisam de documentação.
                        Resposta em até 4 horas úteis.
                      </p>
                    </div>
                    <motion.a
                      href="mailto:suporte@luxtech.com.br"
                      whileTap={{ scale: 0.96 }}
                      className="px-6 py-3 rounded-xl text-sm font-medium text-black"
                      style={{
                        background: "linear-gradient(135deg, #d4af37, #b8960c)",
                      }}
                    >
                      suporte@luxtech.com.br →
                    </motion.a>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Formulário adaptativo */}
          <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6">
            <h2 className="text-base font-medium text-white mb-1">
              Ou envie uma mensagem
            </h2>
            <p className="text-xs text-white/30 mb-5">
              Formulário inteligente — os campos mudam conforme o assunto
            </p>
            <AdaptiveForm />
          </div>
        </div>
      </div>

      {/* ── FAQ rápido ── */}
      <div
        className="border-t border-white/[.04] py-12 mt-8"
        style={{
          background: "linear-gradient(135deg, #0d0d1a 0%, #0a0a0f 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-white/30 mb-4">
            Talvez sua dúvida já tenha resposta
          </p>
          <Link href="/help">
            <motion.span
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-white/60 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80 transition-colors cursor-pointer"
            >
              🎯 Acessar Central de Ajuda com{" "}
              <span className="text-amber-400">15+ artigos</span>
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  );
}
