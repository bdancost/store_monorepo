import { createContext, useContext, ReactNode } from "react";
import { useCommandPalette } from "../hooks/useCommandPalette";
import CommandPalette from "../components/command/CommandPalette";

interface CommandPaletteContextType {
  open: boolean;
  openPalette: () => void;
  closePalette: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextType>({
  open: false,
  openPalette: () => {},
  closePalette: () => {},
});

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const { open, openPalette, closePalette } = useCommandPalette();

  return (
    <CommandPaletteContext.Provider value={{ open, openPalette, closePalette }}>
      {children}
      {/* CommandPalette vive aqui para garantir que
          está fora de qualquer contexto de z-index */}
      <CommandPalette open={open} onClose={closePalette} />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPaletteContext() {
  return useContext(CommandPaletteContext);
}
