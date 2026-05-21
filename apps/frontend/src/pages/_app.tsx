import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "../components/layout/Header";
import { CartProvider } from "../contexts/CartContext";
import { ToastProvider } from "../contexts/ToastContext";
import InstallBanner from "../components/pwa/InstallBanner";
import { CommandPaletteProvider } from "../contexts/CommandPaletteContext";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname !== "/auth";

  return (
    <ToastProvider>
      <CartProvider>
        <CommandPaletteProvider>
          {showHeader && <Header />}
          <main className={showHeader ? "pt-16" : ""}>
            <Component {...pageProps} />
          </main>
          <InstallBanner />
        </CommandPaletteProvider>
      </CartProvider>
    </ToastProvider>
  );
}
