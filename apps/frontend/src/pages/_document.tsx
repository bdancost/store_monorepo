import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* PWA — Web Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Cor da barra de status no mobile */}
        <meta name="theme-color" content="#d4af37" />

        {/* iOS — comportamento de app standalone */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="LUXTECH" />

        {/* Ícones para iOS — Apple não usa o manifest */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/icon-192x192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/icons/icon-144x144.png"
        />

        {/* Splash screens para iOS */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-72x72.png"
        />

        {/* SEO básico */}
        <meta
          name="description"
          content="LUXTECH — Loja premium de eletrônicos e gadgets"
        />
        <meta
          name="keywords"
          content="eletrônicos, gadgets, smartphones, laptops, premium"
        />

        {/* Open Graph — aparece ao compartilhar no WhatsApp, etc */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="LUXTECH Premium Store" />
        <meta
          property="og:description"
          content="Os melhores eletrônicos e gadgets do mercado"
        />
        <meta property="og:image" content="/icons/icon-512x512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
