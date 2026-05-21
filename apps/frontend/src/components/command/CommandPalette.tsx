/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../hooks/useProducts";
import { useCommandSearch } from "../../hooks/useCommandSearch";
import type { Command } from "../../hooks/useCommandSearch";

// Agrupa os resultados por group para exibição organizada
// Record<string, Command[]> = { 'páginas': [...], 'produtos': [...] }
function groupCommands(commands: Command[]): Record<string, Command[]> {
  return commands.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.group]) acc[cmd.group] = [];
    acc[cmd.group].push(cmd);
    return acc;
  }, {});
}

// Label legível para cada grupo
const GROUP_LABELS: Record<string, string> = {
  páginas: "Navegação",
  ações: "Ações",
  produtos: "Produtos",
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { products } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    executeSelected,
  } = useCommandSearch({ products, onClose });

  // Foca o input quando abre
  // setTimeout necessário porque o AnimatePresence precisa
  // montar o elemento antes do focus funcionar
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Navegação por teclado — setas cima/baixo e Enter
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(
            selectedIndex < results.length - 1 ? selectedIndex + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(
            selectedIndex > 0 ? selectedIndex - 1 : results.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          executeSelected();
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, results, setSelectedIndex, executeSelected]);

  // Scroll automático para o item selecionado
  // Sem isso, setas para baixo podem deixar o item fora da tela
  useEffect(() => {
    const selectedEl = listRef.current?.querySelector('[data-selected="true"]');
    selectedEl?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const grouped = groupCommands(results);
  const groupOrder = ["páginas", "ações", "produtos"];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
            }}
          />

          {/* Paleta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
            // Impede que o clique na paleta feche o overlay
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-2xl border border-white/[.08] overflow-hidden shadow-2xl"
              style={{ background: "rgba(12,12,22,0.98)" }}
            >
              {/* Input de busca */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[.06]">
                {/* Ícone de busca */}
                <span className="text-white/30 text-lg shrink-0">🔍</span>

                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar produtos, páginas, ações..."
                  className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none"
                />

                {/* Dica do atalho */}
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[.06] text-[10px] text-white/30 shrink-0">
                  ESC
                </kbd>
              </div>

              {/* Lista de resultados */}
              <div
                ref={listRef}
                className="max-h-80 overflow-y-auto py-2"
                style={{ scrollbarWidth: "none" }}
              >
                {results.length === 0 ? (
                  // Empty state
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <span className="text-3xl">🔍</span>
                    <p className="text-sm text-white/30">
                      Nenhum resultado para "{query}"
                    </p>
                  </div>
                ) : (
                  // Grupos de resultados
                  groupOrder
                    .filter((g) => grouped[g])
                    .map((group) => (
                      <div key={group} className="mb-2">
                        {/* Label do grupo */}
                        <p className="px-4 py-1.5 text-[10px] font-medium text-white/25 tracking-widest uppercase">
                          {GROUP_LABELS[group] ?? group}
                        </p>

                        {/* Itens do grupo */}
                        {grouped[group].map((cmd) => {
                          // Encontra o índice global do comando
                          // para comparar com selectedIndex
                          const globalIndex = results.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <motion.button
                              key={cmd.id}
                              data-selected={isSelected}
                              onClick={cmd.onSelect}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                isSelected
                                  ? "bg-amber-400/10"
                                  : "hover:bg-white/[.04]"
                              }`}
                            >
                              {/* Ícone do comando */}
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 ${
                                  isSelected
                                    ? "bg-amber-400/20 border border-amber-400/30"
                                    : "bg-white/[.04] border border-white/[.06]"
                                }`}
                              >
                                {cmd.icon}
                              </span>

                              {/* Label e descrição */}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm font-medium truncate ${
                                    isSelected
                                      ? "text-amber-400"
                                      : "text-white/80"
                                  }`}
                                >
                                  {cmd.label}
                                </p>
                                {cmd.description && (
                                  <p className="text-xs text-white/30 truncate mt-0.5">
                                    {cmd.description}
                                  </p>
                                )}
                              </div>

                              {/* Indicador Enter para item selecionado */}
                              {isSelected && (
                                <motion.kbd
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="px-2 py-1 rounded-md bg-amber-400/10 border border-amber-400/20 text-[10px] text-amber-400 shrink-0"
                                >
                                  ↵
                                </motion.kbd>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    ))
                )}
              </div>

              {/* Footer com dicas de teclado */}
              <div className="px-4 py-2.5 border-t border-white/[.04] flex items-center gap-4">
                {[
                  { keys: ["↑", "↓"], label: "navegar" },
                  { keys: ["↵"], label: "selecionar" },
                  { keys: ["ESC"], label: "fechar" },
                ].map((hint) => (
                  <div key={hint.label} className="flex items-center gap-1.5">
                    {hint.keys.map((key) => (
                      <kbd
                        key={key}
                        className="px-1.5 py-0.5 rounded bg-white/[.06] text-[9px] text-white/25 font-mono"
                      >
                        {key}
                      </kbd>
                    ))}
                    <span className="text-[10px] text-white/20">
                      {hint.label}
                    </span>
                  </div>
                ))}

                <div className="ml-auto text-[10px] text-white/15">
                  {results.length} resultado{results.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
