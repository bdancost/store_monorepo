import { createContext, useContext, ReactNode } from "react";
import { useCommandPalette } from "../hooks/useCommandPalette";
import CommandPalette from "../components/command/CommandPalette";
import { useTheme } from "../hooks/useTheme";

const { toggleTheme, isDark } = useTheme();

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

<CommandPalette
  open={open}
  onClose={closePalette}
  toggleTheme={toggleTheme}
  isDark={isDark}
/>;

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
