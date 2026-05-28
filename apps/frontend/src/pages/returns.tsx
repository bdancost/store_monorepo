/* eslint-disable react-hooks/purity */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Dados do processo de devolução
// ─────────────────────────────────────────────
const ELIGIBILITY_CHECKLIST = [
  {
    id: "timeframe",
    label: "O produto foi recebido há menos de 30 dias",
    detail: "A data de entrega consta no e-mail de confirmação",
  },
  {
    id: "original_box",
    label: "Tenho a embalagem original do produto",
    detail: "Caixa, isopor, plásticos e todos os acessórios",
  },
  {
    id: "not_used",
    label: "O produto não foi usado ou está com defeito de fábrica",
    detail: "Produtos com uso normal não são elegíveis para devolução",
  },
  {
    id: "accessories",
    label: "Todos os acessórios e manuais estão presentes",
    detail: "Carregador, cabos, brindes e documentação",
  },
];

const RETURN_REASONS = [
  { id: "defect", label: "Produto com defeito", icon: "⚠️", priority: "Alta" },
  {
    id: "wrong_product",
    label: "Produto errado enviado",
    icon: "📦",
    priority: "Alta",
  },
  {
    id: "changed_mind",
    label: "Desisti da compra",
    icon: "💭",
    priority: "Normal",
  },
  { id: "damaged", label: "Chegou danificado", icon: "💔", priority: "Alta" },
  {
    id: "not_as_described",
    label: "Diferente da descrição",
    icon: "📋",
    priority: "Normal",
  },
  {
    id: "duplicate",
    label: "Comprei duplicado",
    icon: "🔁",
    priority: "Normal",
  },
];

const PROCESS_TIMELINE = [
  {
    step: 1,
    icon: "📋",
    title: "Solicitação aprovada",
    description: "Avaliamos e aprovamos em até 2 horas úteis",
    time: "~2h",
    color: "text-blue-400",
    bg: "bg-blue-400/10 border-blue-400/20",
  },
  {
    step: 2,
    icon: "🚚",
    title: "Coleta agendada",
    description: "Coletamos gratuitamente no seu endereço",
    time: "1–2 dias",
    color: "text-purple-400",
    bg: "bg-purple-400/10 border-purple-400/20",
  },
  {
    step: 3,
    icon: "🔍",
    title: "Análise do produto",
    description: "Nosso time inspeciona e confirma o defeito",
    time: "1–3 dias",
    color: "text-amber-400",
    bg: "bg-amber-400/10 border-amber-400/20",
  },
  {
    step: 4,
    icon: "✅",
    title: "Reembolso ou troca",
    description: "Estorno no cartão ou novo produto enviado",
    time: "3–5 dias",
    color: "text-green-400",
    bg: "bg-green-400/10 border-green-400/20",
  },
];

const POLICIES = [
  {
    icon: "📅",
    title: "30 dias para devolução",
    description:
      "Você tem 30 dias corridos após o recebimento para solicitar devolução por qualquer motivo.",
    highlight: "30 dias",
  },
  {
    icon: "🔧",
    title: "90 dias para defeitos",
    description:
      "Defeitos de fabricação têm prazo estendido de 90 dias, conforme o Código de Defesa do Consumidor.",
    highlight: "90 dias",
  },
  {
    icon: "🚚",
    title: "Coleta 100% gratuita",
    description:
      "Agendamos a coleta no seu endereço sem nenhum custo, em qualquer parte do Brasil.",
    highlight: "Grátis",
  },
  {
    icon: "💰",
    title: "Reembolso em 5 dias úteis",
    description:
      "Após recebermos e inspecionarmos o produto, o reembolso é processado em até 5 dias úteis.",
    highlight: "5 dias úteis",
  },
];

// ─────────────────────────────────────────────
// Progress bar do wizard
// ─────────────────────────────────────────────
function WizardProgress({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const steps = ["Elegibilidade", "Motivo", "Dados", "Confirmação"];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
            <motion.div
              animate={{
                scale: currentStep === i + 1 ? 1.15 : 1,
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 transition-colors ${
                currentStep > i + 1
                  ? "border-amber-400 bg-amber-400 text-black"
                  : currentStep === i + 1
                    ? "border-amber-400 bg-amber-400/20 text-amber-400"
                    : "border-white/[.12] bg-transparent text-white/25"
              }`}
            >
              {currentStep > i + 1 ? "✓" : i + 1}
            </motion.div>
            <span
              className={`text-[9px] tracking-wide hidden sm:block ${
                currentStep >= i + 1 ? "text-white/50" : "text-white/20"
              }`}
            >
              {step.toUpperCase()}
            </span>
          </div>
        ))}

        {/* Linhas conectoras */}
        <div className="absolute left-0 right-0 flex items-center px-6 pointer-events-none">
          {steps.slice(0, -1).map((_, i) => (
            <div key={i} className="flex-1 h-px mx-4 relative">
              <div className="absolute inset-0 bg-white/[.08]" />
              <motion.div
                className="absolute inset-0 bg-amber-400"
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: currentStep > i + 1 ? 1 : 0,
                  transformOrigin: "left",
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Barra de progresso contínua */}
      <div className="h-1 bg-white/[.06] rounded-full overflow-hidden mt-2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #d4af37, #f5d56e)" }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Etapa 1 — Checklist de elegibilidade
// ─────────────────────────────────────────────
function StepEligibility({ onNext }: { onNext: () => void }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const allChecked = useMemo(
    () => ELIGIBILITY_CHECKLIST.every((item) => checked[item.id]),
    [checked],
  );

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h3 className="text-lg font-medium text-white mb-1">
          Verificar elegibilidade
        </h3>
        <p className="text-sm text-white/40">
          Confirme que seu produto atende aos critérios antes de iniciar.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ELIGIBILITY_CHECKLIST.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => toggle(item.id)}
            className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
              checked[item.id]
                ? "border-green-400/30 bg-green-400/[.05]"
                : "border-white/[.06] bg-white/[.02] hover:border-white/[.12]"
            }`}
          >
            {/* Checkbox animado */}
            <motion.div
              animate={{
                scale: checked[item.id] ? [1, 1.2, 1] : 1,
                backgroundColor: checked[item.id]
                  ? "rgba(74,222,128,0.2)"
                  : "rgba(255,255,255,0.04)",
                borderColor: checked[item.id]
                  ? "rgba(74,222,128,0.5)"
                  : "rgba(255,255,255,0.12)",
              }}
              className="w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5"
            >
              <AnimatePresence>
                {checked[item.id] && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="text-green-400 text-xs font-bold"
                  >
                    ✓
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="flex-1">
              <p
                className={`text-sm font-medium transition-colors ${
                  checked[item.id] ? "text-white/80" : "text-white/60"
                }`}
              >
                {item.label}
              </p>
              <p className="text-xs text-white/30 mt-0.5 leading-relaxed">
                {item.detail}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Feedback de elegibilidade */}
      <AnimatePresence>
        {allChecked && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-green-400/25 bg-green-400/[.07]"
          >
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm font-medium text-green-400">
                Produto elegível para devolução
              </p>
              <p className="text-xs text-green-400/60">
                Você pode prosseguir com a solicitação
              </p>
            </div>
          </motion.div>
        )}

        {!allChecked && Object.keys(checked).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-white/25 text-center"
          >
            {ELIGIBILITY_CHECKLIST.filter((i) => !checked[i.id]).length} item(s)
            não confirmado(s)
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNext}
        disabled={!allChecked}
        className="w-full py-3.5 rounded-xl text-sm font-medium text-black disabled:opacity-30 transition-opacity"
        style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
      >
        Continuar →
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Etapa 2 — Motivo da devolução
// ─────────────────────────────────────────────
function StepReason({
  onNext,
  onBack,
}: {
  onNext: (reason: string) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h3 className="text-lg font-medium text-white mb-1">
          Motivo da devolução
        </h3>
        <p className="text-sm text-white/40">
          Isso nos ajuda a resolver mais rápido e melhorar nossos produtos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RETURN_REASONS.map((reason, i) => (
          <motion.button
            key={reason.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(reason.id)}
            className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
              selected === reason.id
                ? "border-amber-400/35 bg-amber-400/[.06]"
                : "border-white/[.06] bg-white/[.02] hover:border-white/[.12]"
            }`}
          >
            <span className="text-2xl">{reason.icon}</span>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  selected === reason.id ? "text-amber-400" : "text-white/70"
                }`}
              >
                {reason.label}
              </p>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  reason.priority === "Alta"
                    ? "text-red-400 bg-red-400/10"
                    : "text-white/25 bg-white/[.04]"
                }`}
              >
                Prioridade {reason.priority}
              </span>
            </div>
            {selected === reason.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-bold text-black shrink-0"
              >
                ✓
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-sm text-white/50 border border-white/[.08] hover:border-white/[.18] transition-colors"
        >
          ← Voltar
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => selected && onNext(selected)}
          disabled={!selected}
          className="flex-1 py-3 rounded-xl text-sm font-medium text-black disabled:opacity-30"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          Continuar →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Etapa 3 — Dados do pedido
// ─────────────────────────────────────────────
function StepDetails({
  onNext,
  onBack,
}: {
  onNext: (data: Record<string, string>) => void;
  onBack: () => void;
}) {
  const [formData, setFormData] = useState({
    order_number: "",
    name: "",
    email: "",
    phone: "",
    preference: "refund",
  });

  const isValid = formData.order_number && formData.name && formData.email;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-5"
    >
      <div>
        <h3 className="text-lg font-medium text-white mb-1">Dados do pedido</h3>
        <p className="text-sm text-white/40">
          Precisamos dessas informações para localizar seu pedido.
        </p>
      </div>

      {/* Número do pedido */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] text-white/30 tracking-widest">
          NÚMERO DO PEDIDO *
        </label>
        <input
          type="text"
          required
          placeholder="Ex: LUX-2026-00123"
          value={formData.order_number}
          onChange={(e) =>
            setFormData((p) => ({ ...p, order_number: e.target.value }))
          }
          className="bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors font-mono"
        />
        <p className="text-[10px] text-white/20">
          Encontre no e-mail de confirmação ou em &apos;Meus Pedidos&apos;
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/30 tracking-widest">
            NOME COMPLETO *
          </label>
          <input
            type="text"
            required
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) =>
              setFormData((p) => ({ ...p, name: e.target.value }))
            }
            className="bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-white/30 tracking-widest">
            E-MAIL *
          </label>
          <input
            type="email"
            required
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({ ...p, email: e.target.value }))
            }
            className="bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 transition-colors"
          />
        </div>
      </div>

      {/* Preferência de resolução */}
      <div>
        <label className="text-[10px] text-white/30 tracking-widest mb-3 block">
          PREFERÊNCIA DE RESOLUÇÃO
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "refund",
              icon: "💰",
              label: "Reembolso",
              desc: "Estorno em 5 dias úteis",
            },
            {
              id: "exchange",
              icon: "🔄",
              label: "Troca",
              desc: "Novo produto enviado",
            },
            {
              id: "credit",
              icon: "🎁",
              label: "Crédito LUXTECH",
              desc: "+10% de bônus",
            },
          ].map((option) => (
            <motion.button
              key={option.id}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setFormData((p) => ({ ...p, preference: option.id }))
              }
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
                formData.preference === option.id
                  ? "border-amber-400/35 bg-amber-400/[.06]"
                  : "border-white/[.06] bg-white/[.02] hover:border-white/[.12]"
              }`}
            >
              <span className="text-2xl">{option.icon}</span>
              <div>
                <p
                  className={`text-xs font-medium ${
                    formData.preference === option.id
                      ? "text-amber-400"
                      : "text-white/60"
                  }`}
                >
                  {option.label}
                </p>
                <p className="text-[10px] text-white/25 mt-0.5">
                  {option.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-sm text-white/50 border border-white/[.08] hover:border-white/[.18] transition-colors"
        >
          ← Voltar
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => isValid && onNext(formData)}
          disabled={!isValid}
          className="flex-1 py-3 rounded-xl text-sm font-medium text-black disabled:opacity-30"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          Revisar →
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Etapa 4 — Confirmação
// ─────────────────────────────────────────────
function StepConfirmation({
  reason,
  details,
  onBack,
  onConfirm,
}: {
  reason: string;
  details: Record<string, string>;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const reasonData = RETURN_REASONS.find((r) => r.id === reason);
  const preferenceLabels: Record<string, string> = {
    refund: "Reembolso",
    exchange: "Troca por novo produto",
    credit: "Crédito LUXTECH (+10%)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-5"
    >
      <div>
        <h3 className="text-lg font-medium text-white mb-1">
          Revisar solicitação
        </h3>
        <p className="text-sm text-white/40">
          Confirme os dados antes de enviar.
        </p>
      </div>

      {/* Resumo */}
      <div className="rounded-2xl border border-white/[.08] bg-white/[.02] overflow-hidden">
        {[
          {
            label: "Número do pedido",
            value: details.order_number,
            mono: true,
          },
          { label: "Nome", value: details.name },
          { label: "E-mail", value: details.email },
          {
            label: "Motivo",
            value: `${reasonData?.icon} ${reasonData?.label}`,
          },
          {
            label: "Resolução desejada",
            value: preferenceLabels[details.preference] ?? details.preference,
          },
        ].map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-3.5 ${
              i < 4 ? "border-b border-white/[.04]" : ""
            }`}
          >
            <span className="text-xs text-white/35">{row.label}</span>
            <span
              className={`text-sm text-white/75 ${row.mono ? "font-mono text-amber-400" : ""}`}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Aviso de prazo */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-2xl border border-amber-400/15 bg-amber-400/[.05]">
        <span className="text-lg shrink-0">⏱️</span>
        <div>
          <p className="text-sm font-medium text-amber-400">
            Tempo estimado total: 7–12 dias úteis
          </p>
          <p className="text-xs text-white/35 mt-0.5">
            Da aprovação ao reembolso ou envio do produto substituto.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="flex-1 py-3 rounded-xl text-sm text-white/50 border border-white/[.08] hover:border-white/[.18] transition-colors"
        >
          ← Voltar
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl text-sm font-medium text-black"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          Confirmar solicitação ✓
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Tela de sucesso
// ─────────────────────────────────────────────
function SuccessScreen({ onReset }: { onReset: () => void }) {
  const protocol = `RET-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-6 py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
        className="text-6xl"
      >
        🎉
      </motion.div>

      <div>
        <h3 className="text-xl font-medium text-white mb-2">
          Solicitação enviada!
        </h3>
        <p className="text-sm text-white/40 max-w-sm">
          Nossa equipe analisará e responderá em até{" "}
          <span className="text-amber-400">2 horas úteis</span> com as
          instruções de coleta.
        </p>
      </div>

      {/* Protocolo */}
      <div className="flex flex-col items-center gap-2 px-8 py-5 rounded-2xl border border-amber-400/15 bg-amber-400/5 w-full">
        <p className="text-xs text-white/30">Protocolo de devolução</p>
        <p className="text-2xl font-mono font-medium text-amber-400">
          #{protocol}
        </p>
        <p className="text-[10px] text-white/20">
          Você receberá esse número por e-mail com as próximas instruções
        </p>
      </div>

      {/* O que acontece agora */}
      <div className="w-full">
        <p className="text-xs text-white/30 mb-3 tracking-widest">
          PRÓXIMOS PASSOS
        </p>
        <div className="flex flex-col gap-2">
          {[
            {
              time: "Agora",
              text: "E-mail de confirmação enviado",
              done: true,
            },
            {
              time: "~2h",
              text: "Aprovação e agendamento da coleta",
              done: false,
            },
            { time: "1–2 dias", text: "Coleta no seu endereço", done: false },
            {
              time: "3–5 dias",
              text: "Reembolso ou produto enviado",
              done: false,
            },
          ].map((step, i) => (
            <motion.div
              key={step.time}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${
                  step.done ? "bg-green-400" : "bg-white/20"
                }`}
              />
              <span className="text-[10px] text-white/25 w-14 shrink-0">
                {step.time}
              </span>
              <span
                className={`text-xs ${
                  step.done ? "text-white/60" : "text-white/35"
                }`}
              >
                {step.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onReset}
        className="text-sm text-white/30 hover:text-white/50 transition-colors"
      >
        Iniciar nova solicitação
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Wizard principal
// ─────────────────────────────────────────────
function ReturnWizard() {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);

  function reset() {
    setStep(1);
    setReason("");
    setDetails({});
    setCompleted(false);
  }

  if (completed) {
    return <SuccessScreen onReset={reset} />;
  }

  return (
    <div>
      <WizardProgress currentStep={step} totalSteps={4} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1">
            <StepEligibility onNext={() => setStep(2)} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step2">
            <StepReason
              onNext={(r) => {
                setReason(r);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="step3">
            <StepDetails
              onNext={(d) => {
                setDetails(d);
                setStep(4);
              }}
              onBack={() => setStep(2)}
            />
          </motion.div>
        )}
        {step === 4 && (
          <motion.div key="step4">
            <StepConfirmation
              reason={reason}
              details={details}
              onBack={() => setStep(3)}
              onConfirm={() => setCompleted(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function ReturnsPage() {
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
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="text-6xl mb-6 block"
            >
              🔄
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-400/20 bg-amber-400/5 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs text-amber-400 tracking-widest">
                COLETA GRATUITA · REEMBOLSO EM 5 DIAS
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-medium text-white mb-4 leading-tight"
            >
              Trocas e{" "}
              <span
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundImage: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  backgroundClip: "text",
                }}
              >
                devoluções
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-white/40 max-w-md mx-auto"
            >
              Sem burocracia. Sem letras miúdas. Processo 100% online em menos
              de 3 minutos.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── Políticas ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {POLICIES.map((policy, i) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col gap-3 p-5 rounded-2xl border border-white/[.06] bg-white/[.02] text-center"
            >
              <span className="text-3xl">{policy.icon}</span>
              <span className="text-lg font-medium text-amber-400">
                {policy.highlight}
              </span>
              <div>
                <p className="text-sm font-medium text-white/70 mb-1">
                  {policy.title}
                </p>
                <p className="text-xs text-white/30 leading-relaxed">
                  {policy.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Layout principal ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Wizard */}
          <div className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 rounded-full bg-amber-400" />
              <h2 className="text-base font-medium text-white">
                Iniciar solicitação
              </h2>
            </div>
            <ReturnWizard />
          </div>

          {/* Timeline do processo */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 rounded-full bg-amber-400" />
                <h2 className="text-base font-medium text-white">
                  Como funciona o processo
                </h2>
              </div>

              <div className="flex flex-col gap-0">
                {PROCESS_TIMELINE.map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 pb-6 last:pb-0"
                  >
                    {/* Linha conectora */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        whileInView={{ scale: [0, 1.2, 1] }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.2, type: "spring" }}
                        className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl shrink-0 ${item.bg}`}
                      >
                        {item.icon}
                      </motion.div>
                      {i < PROCESS_TIMELINE.length - 1 && (
                        <div className="w-px flex-1 my-2 bg-white/[.06]" />
                      )}
                    </div>

                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-white/80">
                          {item.title}
                        </h3>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full border ${item.bg} ${item.color} font-mono`}
                        >
                          {item.time}
                        </span>
                      </div>
                      <p className="text-xs text-white/35 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dúvidas */}
            <div className="rounded-2xl border border-amber-400/15 bg-amber-400/[.04] p-5">
              <p className="text-xs text-amber-400/70 tracking-widest mb-2">
                PRECISA DE AJUDA?
              </p>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">
                Nossa equipe de trocas está disponível para te guiar pelo
                processo.
              </p>
              <div className="flex gap-2">
                <Link href="/help">
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex px-4 py-2 rounded-lg text-xs text-white/50 border border-white/[.08] hover:border-amber-400/30 hover:text-white/70 transition-colors cursor-pointer"
                  >
                    Central de ajuda
                  </motion.span>
                </Link>
                <Link href="/contact">
                  <motion.span
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex px-4 py-2 rounded-lg text-xs font-medium text-black cursor-pointer"
                    style={{
                      background: "linear-gradient(135deg, #d4af37, #b8960c)",
                    }}
                  >
                    Falar com suporte →
                  </motion.span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
