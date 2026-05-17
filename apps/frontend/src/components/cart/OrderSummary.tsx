import { motion } from "framer-motion";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  hasFreeShipping: boolean;
  freeShippingProgress: number;
  amountToFreeShipping: number;
  onCheckout: () => void;
  checkoutStatus: "idle" | "loading" | "success" | "error";
}

// Mapa de label por status — lógica fora do JSX
// Por que fora do JSX? JSX com ternários encadeados
// é difícil de ler. Um objeto de lookup é mais limpo
const buttonLabels: Record<string, string> = {
  idle: "Finalizar pedido →",
  loading: "Processando pedido...",
  success: "✓ Pedido criado!",
  error: "Tente novamente",
};

// Mapa de cor por status
const buttonColors: Record<string, string> = {
  idle: "linear-gradient(135deg, #d4af37, #b8960c)",
  loading: "linear-gradient(135deg, #b8960c, #8a6f09)",
  success: "linear-gradient(135deg, #22c55e, #16a34a)",
  error: "linear-gradient(135deg, #ef4444, #dc2626)",
};

// Componente auxiliar para linha de valor
// Por que extrair? Porque o padrão label + valor
// se repete 3 vezes — DRY principle
function SummaryRow({
  label,
  value,
  highlight = false,
  positive = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${highlight ? "text-white font-medium" : "text-white/50"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-medium ${
          highlight
            ? "text-amber-400 text-base"
            : positive
              ? "text-green-400"
              : "text-white/70"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export default function OrderSummary({
  subtotal,
  shipping,
  discount,
  total,
  hasFreeShipping,
  freeShippingProgress,
  amountToFreeShipping,
  onCheckout,
  checkoutStatus,
}: OrderSummaryProps) {
  // Formatador de moeda reutilizado localmente
  // Por que não criar um utils/formatCurrency?
  // Para projetos pequenos, inline está ok.
  // Em projetos maiores, extrair para utils/format.ts
  function formatBRL(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/[.06] bg-white/[.02] p-6 flex flex-col gap-5 sticky top-24"
      // sticky top-24: o resumo fica fixo enquanto
      // o usuário rola a lista de itens
      // top-24 = 96px = altura do header (64px) + margin (32px)
    >
      <h2 className="text-base font-medium text-white">Resumo do pedido</h2>

      {/* Barra de progresso para frete grátis */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40">
            {hasFreeShipping ? (
              <span className="text-green-400 flex items-center gap-1">
                ✅ Frete grátis conquistado!
              </span>
            ) : (
              <>
                Falta{" "}
                <span className="text-amber-400 font-medium">
                  {formatBRL(amountToFreeShipping)}
                </span>{" "}
                para frete grátis
              </>
            )}
          </span>
        </div>

        {/* Barra de progresso animada */}
        <div className="h-1.5 bg-white/[.06] rounded-full overflow-hidden">
          <motion.div
            // Anima a largura quando o progresso muda
            // Isso acontece em tempo real conforme o usuário
            // adiciona ou remove itens
            initial={{ width: 0 }}
            animate={{ width: `${freeShippingProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: hasFreeShipping
                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                : "linear-gradient(90deg, #d4af37, #b8960c)",
            }}
          />
        </div>
      </div>

      {/* Separador */}
      <div className="h-px bg-white/[.06]" />

      {/* Linhas de valor */}
      <div className="flex flex-col gap-3">
        <SummaryRow label="Subtotal" value={formatBRL(subtotal)} />

        <SummaryRow
          label="Frete"
          value={hasFreeShipping ? "Grátis" : formatBRL(shipping)}
          positive={hasFreeShipping}
        />

        {/* Desconto só aparece se houver cupom aplicado */}
        {discount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <SummaryRow
              label="Desconto"
              value={`− ${formatBRL(discount)}`}
              positive
            />
          </motion.div>
        )}
      </div>

      {/* Separador */}
      <div className="h-px bg-white/[.06]" />

      {/* Total */}
      <SummaryRow label="Total" value={formatBRL(total)} highlight />

      {/* Botão de checkout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onCheckout}
        disabled={checkoutStatus === "loading" || checkoutStatus === "success"}
        className="w-full py-3.5 rounded-xl text-sm font-medium text-black disabled:opacity-80 transition-all relative overflow-hidden"
        style={{ background: buttonColors[checkoutStatus] }}
        // Anima a troca de cor entre estados
        animate={{ background: buttonColors[checkoutStatus] }}
      >
        {checkoutStatus === "loading" && (
          <motion.div
            className="absolute inset-0 -skew-x-12"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
        )}
        <motion.span
          key={checkoutStatus}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          {buttonLabels[checkoutStatus]}
        </motion.span>
      </motion.button>

      {/* Selos de segurança */}
      <div className="flex items-center justify-center gap-4 pt-1">
        {["🔒 SSL", "✅ Seguro", "📦 Garantido"].map((badge) => (
          <span key={badge} className="text-[10px] text-white/20">
            {badge}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
