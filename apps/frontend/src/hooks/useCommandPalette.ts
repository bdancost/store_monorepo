import { useState, useEffect, useCallback } from "react";

interface UseCommandPaletteReturn {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
  toggle: () => void;
}

export function useCommandPalette(): UseCommandPaletteReturn {
  const [open, setOpen] = useState(false);

  const openPalette = useCallback(() => setOpen(true), []);
  const closePalette = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // ⌘K no Mac, Ctrl+K no Windows/Linux
      // Por que checar os dois?
      // metaKey = tecla Command no Mac
      // ctrlKey = Ctrl no Windows/Linux
      // Sem isso, o atalho só funciona em um sistema
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const triggerKey = isMac ? e.metaKey : e.ctrlKey;

      if (triggerKey && e.key === "k") {
        // preventDefault: evita que o browser abra
        // sua própria busca (Ctrl+K no Firefox abre a barra de endereço)
        e.preventDefault();
        toggle();
      }

      // Fecha com Escape
      if (e.key === "Escape") {
        closePalette();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggle, closePalette]);

  // Bloqueia scroll quando aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return { open, openPalette, closePalette, toggle };
}
