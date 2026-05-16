import { motion } from "framer-motion";

interface CategoryFiltersProps {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
  counts: Record<string, number>;
}

const categoryIcons: Record<string, string> = {
  todos: "⚡",
  electronics: "📱",
  jewelery: "💍",
  "men's clothing": "👔",
  "women's clothing": "👗",
};

function getIcon(category: string): string {
  return categoryIcons[category.toLowerCase()] ?? "🏷️";
}

function formatLabel(category: string): string {
  if (category === "todos") return "Todos";
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function CategoryFilters({
  categories,
  active,
  onChange,
  counts,
}: CategoryFiltersProps) {
  const allCategories = ["todos", ...categories];

  return (
    <div className="flex gap-2 flex-wrap">
      {allCategories.map((category) => {
        const isActive = active === category;
        const count =
          category === "todos"
            ? Object.values(counts).reduce((a, b) => a + b, 0)
            : (counts[category] ?? 0);

        return (
          <motion.button
            key={category}
            onClick={() => onChange(category)}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-colors ${
              isActive
                ? "text-black"
                : "text-white/50 bg-white/[.04] border border-white/[.08] hover:border-amber-400/30 hover:text-white/80"
            }`}
          >
            {/* Background animado da pill ativa */}
            {isActive && (
              <motion.div
                layoutId="category-pill"
                className="absolute inset-0 rounded-full"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}

            <span className="relative z-10">{getIcon(category)}</span>
            <span className="relative z-10">{formatLabel(category)}</span>
            <span
              className={`relative z-10 text-[9px] px-1.5 py-0.5 rounded-full ${
                isActive
                  ? "bg-black/20 text-black/70"
                  : "bg-white/[.08] text-white/30"
              }`}
            >
              {count}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
