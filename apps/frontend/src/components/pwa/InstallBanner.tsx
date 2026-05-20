import { motion, AnimatePresence } from "framer-motion";
import { usePWA } from "../../hooks/usePWA";
import { useState } from "react";

export default function InstallBanner() {
  const { canInstall, isOffline, install } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {/* Banner de instalação */}
      <AnimatePresence>
        {canInstall && !dismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
          >
            <div
              className="rounded-2xl border border-amber-400/20 p-4 flex items-center gap-4"
              style={{
                background: "rgba(10,10,20,0.97)",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Ícone do app */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f5d56e)",
                }}
              >
                ⚡
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  Instalar LUXTECH
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  Acesse mais rápido, funciona offline
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                {/* Dispensar */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setDismissed(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/30 hover:text-white/60 transition-colors"
                >
                  ✕
                </motion.button>

                {/* Instalar */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => void install()}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-black"
                  style={{
                    background: "linear-gradient(135deg, #d4af37, #b8960c)",
                  }}
                >
                  Instalar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner de offline */}
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-50 flex items-center justify-center px-4 py-2"
            style={{
              background: "rgba(239,68,68,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2">
              {/* Dot pulsando — indica estado ativo */}
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-red-400"
              />
              <span className="text-xs text-red-400 font-medium">
                Sem conexão — modo offline ativo
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
