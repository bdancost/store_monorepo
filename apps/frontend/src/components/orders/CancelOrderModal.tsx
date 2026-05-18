import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CancelOrderModalProps {
  open: boolean;
  orderId: string | null;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export default function CancelOrderModal({
  open,
  orderId,
  onConfirm,
  onClose,
  loading,
}: CancelOrderModalProps) {
  // Ref para o botão de confirmar
  // Usado para devolver foco quando o modal fechar
  // Isso é um requisito de acessibilidade — o foco
  // não pode "desaparecer" quando um modal fecha
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Fecha com Escape e bloqueia scroll
  useEffect(() => {
    if (!open) return;

    // Bloqueia scroll do body
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKey);

    // Foca o botão de confirmar automaticamente
    // Para usuários de teclado poderem confirmar com Enter
    // ou cancelar com Escape sem usar o mouse
    setTimeout(() => confirmRef.current?.focus(), 100);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
            }}
            // aria-hidden: o overlay não precisa ser lido
            // por leitores de tela — é só decorativo
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            // role="dialog" e aria-modal="true" informam
            // leitores de tela que é um diálogo modal
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="w-full max-w-sm rounded-2xl border border-white/[.08] p-6 pointer-events-auto"
              style={{ background: "rgba(15, 15, 26, 0.98)" }}
              // Impede que cliques dentro do modal
              // propaguem para o overlay e fechem o modal
              onClick={(e) => e.stopPropagation()}
            >
              {/* Ícone de aviso */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center text-2xl mx-auto mb-4"
              >
                ⚠️
              </motion.div>

              {/* Título */}
              <h2
                id="modal-title"
                className="text-base font-medium text-white text-center mb-2"
              >
                Cancelar pedido?
              </h2>

              {/* Descrição */}
              <p className="text-sm text-white/40 text-center mb-1">
                Esta ação não pode ser desfeita.
              </p>

              {/* ID do pedido */}
              {orderId && (
                <p className="text-xs text-amber-400/60 text-center font-mono mb-6">
                  #{orderId.slice(0, 8).toUpperCase()}
                </p>
              )}

              {/* Aviso de consequência */}
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-red-400/5 border border-red-400/10 mb-6">
                <span className="text-red-400 text-xs mt-0.5 shrink-0">⚠</span>
                <p className="text-xs text-red-400/70 leading-relaxed">
                  O pedido será cancelado e você precisará fazer uma nova compra
                  caso queira os produtos.
                </p>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-3">
                {/* Cancelar (fechar modal) — ação secundária à esquerda */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm text-white/60 border border-white/[.08] hover:border-white/20 hover:text-white/80 transition-colors disabled:opacity-40"
                >
                  Manter pedido
                </motion.button>

                {/* Confirmar cancelamento — ação destrutiva à direita */}
                {/* Ação destrutiva sempre em vermelho e sempre à direita
                    Padrão universal de UX para ações irreversíveis */}
                <motion.button
                  ref={confirmRef}
                  whileTap={{ scale: 0.96 }}
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 border border-red-500/30 transition-colors disabled:opacity-60 relative overflow-hidden"
                >
                  {loading && (
                    <motion.div
                      className="absolute inset-0 -skew-x-12"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                      }}
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {loading ? "Cancelando..." : "Sim, cancelar"}
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
