/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"; // Correção do 'toBeInTheDocument'
import { useRouter } from "next/navigation"; // Ajuste para 'next/router' se usar Pages Router
import OrderCard from "../../components/orders/OrderCard";

jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: "",
      asPath: "",
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// 1. Mock do módulo do Next.js
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock do tipo do componente (ajuste com as propriedades reais do seu OrderCard)
const mockOrder = {
  id: "123",
  status: "pending",
  total: 999.99,
  createdAt: new Date().toISOString(),
  items: [{ id: "i1", name: "Item 1", quantity: 1, price: 999.99 }],
} as any;

describe("OrderCard Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // 2. Configuração correta do retorno do useRouter mockado
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: jest.fn(),
      back: jest.fn(),
    });
  });

  it("deve renderizar os dados do pedido corretamente", () => {
    render(<OrderCard order={mockOrder} />);

    // Verifica o título do pedido
    expect(screen.getByText("Pedido de Teste")).toBeInTheDocument();

    // 3. Correção do erro de espaço da moeda (Usa Regex para evitar falha do non-breaking space)
    expect(screen.getByText(/R\$.*999,99/)).toBeInTheDocument();
  });

  it("deve redirecionar ao clicar no card do pedido", async () => {
    const user = userEvent.setup();
    render(<OrderCard order={mockOrder} />);

    const card =
      screen.getByRole("button", { name: /ver detalhes/i }) ||
      screen.getByTestId("order-card");
    await user.click(card);

    // Verifica se a navegação foi chamada com a rota esperada
    expect(mockPush).toHaveBeenCalledWith("/orders/123");
  });

  it("deve lidar com interações assíncronas sem erro de act()", async () => {
    const user = userEvent.setup();
    render(<OrderCard order={mockOrder} />);

    const actionButton = screen.getByRole("button", { name: /adicionar/i });
    await user.click(actionButton);

    // 4. Correção do erro de 'act()': espera a atualização de estado assíncrona acontecer
    await waitFor(() => {
      expect(screen.getByText(/adicionado/i)).toBeInTheDocument();
    });
  });
});
