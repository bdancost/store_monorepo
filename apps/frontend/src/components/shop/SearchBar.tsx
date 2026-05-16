import { motion } from "framer-motion";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  total: number;
  loading: boolean;
}

export default function SearchBar({
  value,
  onChange,
  total,
  loading,
}: SearchBarProps) {
  return (
    <div className="relative flex-1 max-w-md">
      {/* Ícone */}
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400/40 text-base pointer-events-none">
        🔍
      </span>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar produtos..."
        className="w-full bg-white/[.04] border border-white/[.08] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-amber-400/40 transition-colors"
      />

      {/* Contador de resultados */}
      {!loading && value.trim() !== "" && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-400/60 bg-amber-400/10 px-2 py-0.5 rounded-full"
        >
          {total}
        </motion.span>
      )}
    </div>
  );
}
