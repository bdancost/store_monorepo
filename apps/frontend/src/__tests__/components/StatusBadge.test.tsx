import { render, screen } from "@testing-library/react";
import StatusBadge from "../../components/orders/StatusBadge";
import type { OrderStatus } from "../../hooks/useOrder";

describe("StatusBadge", () => {
  // Testa cada status individualmente
  // Por que não um único teste com todos?
  // Testes granulares facilitam encontrar o problema
  // quando um falha — você sabe exatamente qual status quebrou

  const statusCases: { status: OrderStatus; expectedLabel: string }[] = [
    { status: "PENDING", expectedLabel: "Aguardando pagamento" },
    { status: "PAID", expectedLabel: "Pagamento confirmado" },
    { status: "SHIPPED", expectedLabel: "Em transporte" },
    { status: "DELIVERED", expectedLabel: "Entregue" },
    { status: "CANCELLED", expectedLabel: "Cancelado" },
  ];

  // test.each: roda o mesmo teste para cada caso
  // Evita repetir o mesmo bloco it() 5 vezes
  // O %s no nome é substituído pelo valor do array
  test.each(statusCases)(
    "deve exibir o label correto para status $status",
    ({ status, expectedLabel }) => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    },
  );

  it("deve exibir o ícone por padrão", () => {
    render(<StatusBadge status="DELIVERED" />);
    // O ícone é o emoji 📦 — verificamos por texto
    expect(screen.getByText("📦")).toBeInTheDocument();
  });

  it("não deve exibir o ícone quando showIcon=false", () => {
    render(<StatusBadge status="DELIVERED" showIcon={false} />);
    expect(screen.queryByText("📦")).not.toBeInTheDocument();
  });

  it("deve exibir o dot animado para status não finais", () => {
    const { container } = render(<StatusBadge status="PENDING" />);
    // O dot é um span com animate-pulse
    // Testamos pela classe pois não tem texto
    const dot = container.querySelector(".animate-pulse");
    expect(dot).toBeInTheDocument();
  });

  it("não deve exibir dot para status DELIVERED", () => {
    const { container } = render(<StatusBadge status="DELIVERED" />);
    const dot = container.querySelector(".animate-pulse");
    expect(dot).not.toBeInTheDocument();
  });

  it("não deve exibir dot para status CANCELLED", () => {
    const { container } = render(<StatusBadge status="CANCELLED" />);
    const dot = container.querySelector(".animate-pulse");
    expect(dot).not.toBeInTheDocument();
  });
});
