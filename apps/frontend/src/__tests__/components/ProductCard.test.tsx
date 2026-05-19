import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock("../../services/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
}));

jest.mock("../../contexts/CartContext", () => ({
  useCartContext: jest.fn(() => ({
    refetch: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock("../../contexts/ToastContext", () => ({
  useToast: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}));

import api from "../../services/api";
import { useCartContext } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import ProductCard from "../../components/shop/ProductCard";
import type { Product } from "../../hooks/useProducts";

const mockedApi = api as jest.Mocked<typeof api>;
const mockRefetch = jest.fn().mockResolvedValue(undefined);
const mockShowToast = jest.fn();

const mockProduct: Product = {
  id: "prod-1",
  title: "iPhone 15 Pro Max 256GB Titanium",
  price: 999.99,
  description: "O melhor iPhone de todos os tempos",
  category: "smartphones",
  image: "https://example.com/iphone.jpg",
};

beforeEach(() => {
  jest.clearAllMocks();
  (useCartContext as jest.Mock).mockReturnValue({ refetch: mockRefetch });
  (useToast as jest.Mock).mockReturnValue({ showToast: mockShowToast });
});

describe("ProductCard", () => {
  describe("renderização", () => {
    it("deve exibir o título do produto", () => {
      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );
      expect(
        screen.getByText("iPhone 15 Pro Max 256GB Titanium"),
      ).toBeInTheDocument();
    });

    it("deve exibir o preço formatado em BRL", () => {
      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );
      // Corrigido para buscar o formato exato "R$ 999,99" renderizado no HTML
      expect(screen.getByText("R$ 999,99")).toBeInTheDocument();
    });

    it("deve exibir a categoria como badge", () => {
      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );
      expect(screen.getByText("smartphones")).toBeInTheDocument();
    });

    it("deve exibir o botão de adicionar ao carrinho", () => {
      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /\+ carrinho/i }),
      ).toBeInTheDocument();
    });

    it("deve exibir a imagem com alt correto", () => {
      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );
      const img = screen.getByAltText("iPhone 15 Pro Max 256GB Titanium");
      expect(img).toBeInTheDocument();
    });
  });

  describe("adicionar ao carrinho", () => {
    it("deve chamar a API ao clicar em adicionar", async () => {
      const user = userEvent.setup();
      mockedApi.post.mockResolvedValue({ data: {} });

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );

      const button = screen.getByRole("button", { name: /\+ carrinho/i });
      await user.click(button);

      await waitFor(() => {
        expect(mockedApi.post).toHaveBeenCalledWith("/cart/add", {
          productId: "prod-1",
          quantity: 1,
        });
      });
    });

    it('deve mostrar "..." durante o loading', async () => {
      const user = userEvent.setup();

      let resolve!: (v: unknown) => void;
      mockedApi.post.mockReturnValue(new Promise((r) => (resolve = r)));

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );

      const button = screen.getByRole("button", { name: /\+ carrinho/i });
      await user.click(button);

      expect(screen.getByText("...")).toBeInTheDocument();

      // Envolvido em act ao resolver para garantir que a atualização de estado subsequente limpe corretamente
      await act(async () => {
        resolve({ data: {} });
      });
    });

    it('deve mostrar "✓ Adicionado" após sucesso', async () => {
      const user = userEvent.setup();
      mockedApi.post.mockResolvedValue({ data: {} });

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );

      await user.click(screen.getByRole("button", { name: /\+ carrinho/i }));

      await waitFor(() => {
        expect(screen.getByText("✓ Adicionado")).toBeInTheDocument();
      });
    });

    it("deve chamar refetch do carrinho após adicionar", async () => {
      const user = userEvent.setup();
      mockedApi.post.mockResolvedValue({ data: {} });

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );

      await user.click(screen.getByRole("button", { name: /\+ carrinho/i }));

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    it("deve mostrar toast de sucesso", async () => {
      const user = userEvent.setup();
      mockedApi.post.mockResolvedValue({ data: {} });

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );

      await user.click(screen.getByRole("button", { name: /\+ carrinho/i }));

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          expect.stringContaining("adicionado"),
        );
      });
    });

    it("deve abrir o drawer após adicionar", async () => {
      const user = userEvent.setup();
      const onCartOpen = jest.fn();
      mockedApi.post.mockResolvedValue({ data: {} });

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={onCartOpen} />,
      );

      await user.click(screen.getByRole("button", { name: /\+ carrinho/i }));

      await waitFor(
        () => {
          expect(onCartOpen).toHaveBeenCalled();
        },
        { timeout: 1200 },
      );
    });

    it("deve mostrar toast de erro quando a API falha", async () => {
      const user = userEvent.setup();
      mockedApi.post.mockRejectedValue(new Error("Network error"));

      render(
        <ProductCard product={mockProduct} index={0} onCartOpen={jest.fn()} />,
      );

      await user.click(screen.getByRole("button", { name: /\+ carrinho/i }));

      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith(
          "Erro ao adicionar ao carrinho",
          "error",
        );
      });
    });
  });
});
