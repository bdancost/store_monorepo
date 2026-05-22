import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "../components/layout/Header";
import { CartProvider } from "../contexts/CartContext";
import { ToastProvider } from "../contexts/ToastContext";
import InstallBanner from "../components/pwa/InstallBanner";
import { CommandPaletteProvider } from "../contexts/CommandPaletteContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";
import "../styles/globals.css";
import "../styles/skeleton.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname !== "/auth";

  return (
    // ThemeProvider deve ser o mais externo possível
    // attribute="data-theme": usa data-theme no <html>
    // em vez de class — funciona melhor com CSS variables
    // defaultTheme="dark": padrão escuro (nossa identidade)
    // enableSystem: respeita a preferência do sistema operacional
    // storageKey: chave do localStorage para persistência
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem
      storageKey="luxtech-theme"
    >
      <ToastProvider>
        <CartProvider>
          <NotificationsProvider>
            <CommandPaletteProvider>
              {showHeader && <Header />}
              <main className={showHeader ? "pt-16" : ""}>
                <Component {...pageProps} />
              </main>
              <InstallBanner />
            </CommandPaletteProvider>
          </NotificationsProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
