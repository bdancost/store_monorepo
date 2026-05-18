import { motion } from "framer-motion";

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  // sub é informação secundária — ex: "de 5 pedidos"
  sub?: string;
  delay?: number;
}

// Componente puramente visual — zero lógica
// Recebe tudo via props e só renderiza
// Isso é o que chamamos de "dumb component" ou
// "presentational component" — fácil de testar,
// fácil de reutilizar, fácil de entender
export default function StatCard({
  icon,
  label,
  value,
  sub,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col gap-3 p-5 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-colors"
    >
      {/* Ícone com fundo sutil */}
      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl">
        {icon}
      </div>

      {/* Label */}
      <p className="text-xs text-white/40 tracking-wide">{label}</p>

      {/* Valor principal */}
      <p className="text-2xl font-medium text-white leading-none">{value}</p>

      {/* Info secundária */}
      {sub && <p className="text-xs text-white/25">{sub}</p>}
    </motion.div>
  );
}
