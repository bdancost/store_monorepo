import { useState, useEffect } from "react";

interface ClockData {
  hours: string;
  minutes: string;
  seconds: string;
  date: string;
}

export function useClock(): ClockData {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Inicializa no client para evitar hydration mismatch no Next.js
    const tick = () => setNow(new Date());

    // Executa a primeira vez para não esperar 1 segundo em branco
    tick();
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
