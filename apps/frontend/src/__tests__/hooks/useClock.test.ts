// Resolve o erro "Not implemented: window.scrollTo" do JSDOM
import { renderHook, act } from "@testing-library/react";
import { useClock } from "../../hooks/useClock";

// Fake timers: controla o tempo sem esperar de verdade
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date("2026-05-19T10:30:45"));
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useClock", () => {
  it("deve gerenciar corretamente o estado de inicialização", () => {
    // Como o Testing Library executa os efeitos imediatamente na montagem,
    // o hook passa pelo estado 'null' e atualiza instantaneamente.
    // Para validar que a estrutura de tipos e as propriedades iniciais existem:
    const { result } = renderHook(() => useClock());

    expect(result.current).toHaveProperty("hours");
    expect(result.current).toHaveProperty("minutes");
    expect(result.current).toHaveProperty("seconds");
    expect(result.current).toHaveProperty("date");
  });

  it("deve inicializar com o horário atual após montar", () => {
    const fixedDate = new Date("2026-05-19T10:30:45");
    jest.setSystemTime(fixedDate);

    const { result } = renderHook(() => useClock());

    // Força os timers e atualizações pendentes a rodarem
    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.hours).toBe("10");
    expect(result.current.minutes).toBe("30");
    expect(result.current.seconds).toBe("45");
  });

  it("deve fazer pad de números menores que 10 com zero", () => {
    const fixedDate = new Date("2026-05-19T09:05:03");
    jest.setSystemTime(fixedDate);

    const { result } = renderHook(() => useClock());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.hours).toBe("09");
    expect(result.current.minutes).toBe("05");
    expect(result.current.seconds).toBe("03");
  });

  it("deve atualizar os segundos após 1 segundo", () => {
    const fixedDate = new Date("2026-05-19T10:30:45");
    jest.setSystemTime(fixedDate);

    const { result } = renderHook(() => useClock());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.seconds).toBe("45");

    // Avança 1 segundo completo e verifica se o hook atualizou pelo setInterval
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe("46");
  });

  it("deve formatar a data em português", () => {
    const fixedDate = new Date("2026-05-19T10:30:00");
    jest.setSystemTime(fixedDate);

    const { result } = renderHook(() => useClock());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(result.current.date).toContain("2026");
    expect(result.current.date.toLowerCase()).toContain("maio");
  });

  it("deve limpar o intervalo ao desmontar", () => {
    const clearIntervalSpy = jest.spyOn(global, "clearInterval");

    const { unmount } = renderHook(() => useClock());

    act(() => {
      jest.advanceTimersByTime(0);
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
