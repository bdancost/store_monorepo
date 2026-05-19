import { useState, useEffect } from "react";

interface ClockData {
  hours: string;
  minutes: string;
  seconds: string;
  date: string;
}

export function useClock(): ClockData {
  // Iniciamos o estado estritamente como null.
  // Isso garante que o primeiríssimo ciclo de renderização síncrona (SSR ou primeiro frame do teste)
  // use o fallback dos placeholders.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Definimos uma função para capturar a data atual.
    const tick = () => setNow(new Date());

    // Importante: Executamos o tick dentro do useEffect.
    // Mudar o estado aqui dentro para inicializar o componente após a montagem é
    // perfeitamente válido pelo linter porque estamos sincronizando com um sistema externo (o relógio).
    tick();

    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // Se 'now' for null, significa que estamos no render inicial (servidor ou montagem síncrona)
  if (!now) {
    return { hours: "--", minutes: "--", seconds: "--", date: "" };
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  const date = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return {
    hours: pad(now.getHours()),
    minutes: pad(now.getMinutes()),
    seconds: pad(now.getSeconds()),
    date: date.charAt(0).toUpperCase() + date.slice(1),
  };
}
