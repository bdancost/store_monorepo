import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SortOption } from "../../hooks/useProductFilters";

const options: { value: SortOption; label: string; icon: string }[] = [
  { value: "relevance", label: "Relevância", icon: "⭐" },
  { value: "price-asc", label: "Menor preço", icon: "📈" },
  { value: "price-desc", label: "Maior preço", icon: "📉" },
  { value: "name-asc", label: "A → Z", icon: "🔤" },
  { value: "name-desc", label: "Z → A", icon: "🔡" },
];

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={ref}>
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/[.08] bg-white/[.04] text-sm text-white/60 hover:border-amber-400/30 hover:text-white/80 transition-colors"
      >
        <span>{active.icon}</span>
        <span className="hidden sm:block">{active.label}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-amber-400/50 text-xs ml-1"
        >
          ▾
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-amber-400/15 overflow-hidden z-30"
            style={{
              background: "rgba(15, 15, 26, 0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            {options.map((option, i) => (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                  value === option.value
                    ? "text-amber-400 bg-amber-400/10"
                    : "text-white/60 hover:text-white hover:bg-white/[.05]"
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
                {value === option.value && (
                  <span className="ml-auto text-amber-400 text-xs">✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
