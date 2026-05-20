/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

// Interface do evento de instalação do browser
// Não está nos tipos padrão do TypeScript — precisamos declarar
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  prompt(): Promise<void>;
}

interface UsePWAReturn {
  canInstall: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  install: () => Promise<void>;
}

export function usePWA(): UsePWAReturn {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Verifica se já está instalado como PWA
    // standalone = rodando fora do browser (instalado)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as { standalone?: boolean }).standalone === true);

    setIsInstalled(isStandalone);
    setIsOffline(!navigator.onLine);

    // beforeinstallprompt: browser dispara quando o app
    // pode ser instalado. Guardamos o evento para usar depois
    // Por que guardar? Para mostrar o prompt no momento certo
    // (ex: após o usuário adicionar ao carrinho) em vez de
    // deixar o browser decidir quando mostrar
    function handleInstallPrompt(e: Event) {
      e.preventDefault(); // Impede o prompt automático do browser
      setInstallPrompt(e as BeforeInstallPromptEvent);
    }

    // appinstalled: dispara quando o usuário instala
    function handleAppInstalled() {
      setIsInstalled(true);
      setInstallPrompt(null);
    }

    // online/offline: monitora a conexão
    function handleOnline() {
      setIsOffline(false);
    }
    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setInstallPrompt(null);
    }
  }

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    isOffline,
    install,
  };
}
