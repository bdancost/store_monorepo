/* eslint-disable react-hooks/set-state-in-effect */
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

interface UseThemeReturn {
  theme: "dark" | "light";
  toggleTheme: () => void;
  isDark: boolean;
  isLight: boolean;
  // mounted: evita hydration mismatch
  // O tema só é conhecido no cliente
  // renderizar antes de montar causaria diferença entre
  // HTML do servidor e do cliente
  mounted: boolean;
}

export function useTheme(): UseThemeReturn {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  // Só renderiza o toggle após montar no cliente
  // Por que? O next-themes lê o localStorage no cliente
  // O servidor não tem acesso ao localStorage
  // sem esse guard, o servidor renderiza com tema padrão
  // e o cliente re-renderiza com o tema salvo → flash
  useEffect(() => {
    setMounted(true);
  }, []);

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const currentTheme = (resolvedTheme ?? theme ?? "dark") as "dark" | "light";

  return {
    theme: currentTheme,
    toggleTheme,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
    mounted,
  };
}
