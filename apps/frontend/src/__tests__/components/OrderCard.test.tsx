/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import OrderCard from "../../components/orders/OrderCard";

// 1. Funções de controle do Mock mapeadas fora do escopo
const mockPush = jest.fn();

// 2. Mock do pacote correto ('next/router')
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: {},
      asPath: "",
      push: mockPush,
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(true),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// 3. Mock atualizado com o status em CAIXA ALTA para o StatusBadge encontrar as classes
const mockOrder = {
  id: "123",
  status: "PENDING",
  total: 999.99,
  createdAt: new Date("2026-05-20T15:00:00.000Z").toISOString(),
  items: [
    {
      id: "i1",
      quantity: 1,
      price: 999.99,
      product: {
        title: "Pedido Especial",
      },
    },
  ],
} as any;

describe("OrderCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar os dados do pedido corretamente", () => {
    render(<OrderCard order={mockOrder} />);

    // Valida o número do pedido e o título formatado
    expect(screen.getByText(/123/)).toBeInTheDocument();
    expect(screen.getByText(/Pedido Especial/i)).toBeInTheDocument();

    // Valida o preço aceitando qualquer caractere de espaçamento (Intl BRL)
    expect(screen.getByText(/R\$.*999,99/)).toBeInTheDocument();
  });

  it("deve redirecionar ao clicar no card do pedido", async () => {
    const user = userEvent.setup();
    render(<OrderCard order={mockOrder} />);

    // Conforme o log do DOM, o clique ocorre na área interna que possui o texto do ID do pedido
    const clickableArea =
      screen.getByText(/123/).closest(".cursor-pointer") ||
      screen.getByText(/123/);

    await user.click(clickableArea);

    expect(mockPush).toHaveBeenCalledWith("/orders/123");
  });

  it("deve renderizar o status correspondente corretamente", () => {
    render(<OrderCard order={mockOrder} />);

    // O subcomponente StatusBadge renderizou "Aguardando pagamento"
    expect(screen.getByText(/Aguardando pagamento/i)).toBeInTheDocument();
  });
});
