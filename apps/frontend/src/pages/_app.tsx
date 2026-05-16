import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Header from "../components/layout/Header";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const showHeader = router.pathname !== "/auth";

  return (
    <>
      {showHeader && <Header />}
      <main className={showHeader ? "pt-16" : ""}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
