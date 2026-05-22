import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

// Variantes de animação para o sol e a lua
// Por que AnimatePresence com mode="wait"?
// Garante que o ícone saindo termina de sair
// antes do novo entrar — sem sobreposição
const iconVariants = {
  initial: { opacity: 0, rotate: -90, scale: 0.5 },
  animate: { opacity: 1, rotate: 0, scale: 1 },
  exit: { opacity: 0, rotate: 90, scale: 0.5 },
};

interface ThemeToggleProps {
  // compact: versão menor para o header
  // full: versão com label para menus e configurações
  variant?: "compact" | "full";
}

export default function ThemeToggle({ variant = "compact" }: ThemeToggleProps) {
  const { isDark, toggleTheme, mounted } = useTheme();

  // Não renderiza até montar para evitar hydration mismatch
  if (!mounted) {
    return (
      <div
        className={
          variant === "compact"
            ? "w-10 h-10 rounded-xl border border-white/[.08] bg-white/[.04]"
            : "w-full h-10 rounded-xl border border-white/[.08] bg-white/[.04]"
        }
      />
    );
  }

  if (variant === "full") {
    return (
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={toggleTheme}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border hover:border-amber-400/30 transition-colors"
        style={{
          borderColor: "var(--border-default)",
          backgroundColor: "var(--bg-surface)",
        }}
      >
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            <motion.span
              key={isDark ? "moon" : "sun"}
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="text-lg"
            >
              {isDark ? "🌙" : "☀️"}
            </motion.span>
          </AnimatePresence>
          <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {isDark ? "Tema escuro" : "Tema claro"}
          </span>
        </div>

        {/* Toggle pill */}
        <div
          className="relative w-11 h-6 rounded-full transition-colors duration-300"
          style={{
            background: isDark ? "var(--gold-muted)" : "var(--gold-primary)",
          }}
        >
          <motion.div
            animate={{ x: isDark ? 2 : 22 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full"
            style={{ background: isDark ? "var(--gold-primary)" : "#fff" }}
          />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="w-10 h-10 flex items-center justify-center rounded-xl border transition-colors"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-surface)",
      }}
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="text-base"
        >
          {isDark ? "🌙" : "☀️"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
