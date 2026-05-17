import { motion } from "framer-motion";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Gera array de páginas com reticências
  function getPages(): (number | "...")[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  const pages = getPages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex items-center justify-center gap-2 mt-10"
    >
      {/* Anterior */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[.08] text-white/40 disabled:opacity-25 hover:border-amber-400/30 hover:text-white/80 transition-colors text-sm"
      >
        ‹
      </motion.button>

      {/* Páginas */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="text-white/20 text-sm px-1">
            ···
          </span>
        ) : (
          <motion.button
            key={p}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(p as number)}
            className={`relative w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
              page === p
                ? "text-black"
                : "text-white/50 border border-white/[.08] hover:border-amber-400/30 hover:text-white/80"
            }`}
          >
            {page === p && (
              <motion.div
                layoutId="page-indicator"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{p}</span>
          </motion.button>
        ),
      )}

      {/* Próxima */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/[.08] text-white/40 disabled:opacity-25 hover:border-amber-400/30 hover:text-white/80 transition-colors text-sm"
      >
        ›
      </motion.button>

      {/* Info */}
      <span className="text-xs text-white/20 ml-2 hidden sm:block">
        página {page} de {totalPages}
      </span>
    </motion.div>
  );
}
