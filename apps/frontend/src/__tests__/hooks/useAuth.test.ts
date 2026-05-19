import { renderHook, act } from "@testing-library/react";

// Mock do módulo de API inteiro
// Todas as funções (get, post, delete, patch) viram jest.fn()
jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

// Import DEPOIS do mock — garante que a versão mockada é usada
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

// Cast para acessar os métodos do mock com tipagem
const mockedApi = api as jest.Mocked<typeof api>;

// Mock do localStorage — jsdom tem localStorage mas
// queremos controle total sobre os valores
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// 1. Declare apenas a variável do push no escopo global (mantenha fora do describe)
const mockPush = jest.fn();

// 2. Adicione este mock explícito logo abaixo dos imports (no topo do arquivo)
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: mockPush,
    pathname: "/",
    query: {},
    asPath: "/",
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    // Por que? Para que o estado de um teste não
    // vaze para o próximo — isolamento
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  describe("login", () => {
    it("deve salvar o token e redirecionar após login bem-sucedido", async () => {
      // Configura o mock para retornar sucesso
      // mockResolvedValue simula uma Promise resolvida
      mockedApi.post.mockResolvedValue({
        data: {
          access_token: "fake-jwt-token",
          user: { id: "1", name: "Daniel", email: "daniel@test.com" },
        },
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({
          email: "daniel@test.com",
          password: "123456",
        });
      });

      // Verifica que a API foi chamada com os dados corretos
      expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "daniel@test.com",
        password: "123456",
      });

      // Verifica que o token foi salvo no localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "access_token",
        "fake-jwt-token",
      );

      // Verifica que o usuário foi salvo
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "user",
        JSON.stringify({ id: "1", name: "Daniel", email: "daniel@test.com" }),
      );

      // Verifica o redirect para /shop
      expect(mockPush).toHaveBeenCalledWith("/shop");
    });

    it("deve definir erro com credenciais inválidas", async () => {
      // mockRejectedValue simula uma Promise rejeitada (erro)
      mockedApi.post.mockRejectedValue(new Error("Unauthorized"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({
          email: "wrong@test.com",
          password: "wrong",
        });
      });

      // Verifica a mensagem de erro
      expect(result.current.error).toBe("E-mail ou senha incorretos");

      // Verifica que NÃO redirecionou
      expect(mockPush).not.toHaveBeenCalled();

      // Verifica que NÃO salvou nada no localStorage
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it("deve definir loading durante a requisição", async () => {
      // Cria uma Promise que nunca resolve para capturar
      // o estado de loading enquanto a requisição está pendente
      let resolvePromise!: (value: unknown) => void;
      const pendingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockedApi.post.mockReturnValue(pendingPromise);

      const { result } = renderHook(() => useAuth());

      // Inicia o login sem await — deixa pendente
      act(() => {
        void result.current.login({
          email: "test@test.com",
          password: "123456",
        });
      });

      // Nesse momento loading deve ser true
      expect(result.current.loading).toBe(true);

      // Resolve a Promise e verifica que loading voltou para false
      await act(async () => {
        resolvePromise({
          data: {
            access_token: "token",
            user: { id: "1", name: "Test", email: "test@test.com" },
          },
        });
      });

      expect(result.current.loading).toBe(false);
    });

    it("deve limpar o erro antes de nova tentativa", async () => {
      // Primeiro login falha
      mockedApi.post.mockRejectedValueOnce(new Error("fail"));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login({ email: "a@a.com", password: "1" });
      });

      expect(result.current.error).toBe("E-mail ou senha incorretos");

      // Segundo login sucede — erro deve sumir
      mockedApi.post.mockResolvedValue({
        data: {
          access_token: "token",
          user: { id: "1", name: "Test", email: "a@a.com" },
        },
      });

      await act(async () => {
        await result.current.login({ email: "a@a.com", password: "1" });
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("register", () => {
    it("deve chamar /users e depois fazer login automático", async () => {
      // Register chama /users primeiro, depois /auth/login
      mockedApi.post
        .mockResolvedValueOnce({ data: {} }) // POST /users
        .mockResolvedValueOnce({
          // POST /auth/login
          data: {
            access_token: "token",
            user: { id: "1", name: "Daniel", email: "daniel@test.com" },
          },
        });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.register({
          name: "Daniel",
          email: "daniel@test.com",
          password: "123456",
        });
      });

      // Deve ter chamado a API duas vezes
      expect(mockedApi.post).toHaveBeenCalledTimes(2);
      expect(mockedApi.post).toHaveBeenNthCalledWith(1, "/users", {
        name: "Daniel",
        email: "daniel@test.com",
        password: "123456",
      });
      expect(mockedApi.post).toHaveBeenNthCalledWith(2, "/auth/login", {
        email: "daniel@test.com",
        password: "123456",
      });
    });
  });

  describe("logout", () => {
    it("deve limpar localStorage e redirecionar para /auth", () => {
      const { result } = renderHook(() => useAuth());

      act(() => {
        result.current.logout();
      });

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("access_token");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("user");
      expect(mockPush).toHaveBeenCalledWith("/auth");
    });
  });
});
