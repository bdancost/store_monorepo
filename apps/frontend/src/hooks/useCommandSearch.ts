/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-render */
import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import type { Product } from "./useProducts";

// Tipo de comando — cada item da palette é um Command
export interface Command {
  id: string;
  label: string;
  description?: string;
  icon: string;
  group: "produtos" | "páginas" | "ações";
  // onSelect: o que acontece quando o usuário escolhe
  onSelect: () => void;
  // keywords: termos extras para a busca encontrar o item
  // ex: "sair" encontra "Logout" via keywords
  keywords?: string[];
}

// Fuzzy search — encontra mesmo com erros de digitação
// Por que implementar manualmente?
// Para mostrar que você entende o algoritmo
// Em produção poderia usar fuse.js, mas entender o conceito
// é o que diferencia um dev que usa biblioteca de um que sabe por quê
function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true;
  let queryIndex = 0;
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  for (const char of textLower) {
    if (char === queryLower[queryIndex]) queryIndex++;
    if (queryIndex === queryLower.length) return true;
  }
  return false;
}

// Score de relevância — ordena resultados mais relevantes primeiro
// match exato > começa com a query > fuzzy match
function getScore(text: string, query: string): number {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();

  if (textLower === queryLower) return 3; // match exato
  if (textLower.startsWith(queryLower)) return 2; // começa com
  if (textLower.includes(queryLower)) return 1; // contém
  return 0; // fuzzy
}

interface UseCommandSearchProps {
  products: Product[];
  onClose: () => void;
}

interface UseCommandSearchReturn {
  query: string;
  setQuery: (value: string) => void;
  results: Command[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  executeSelected: () => void;
}

export function useCommandSearch({
  products,
  onClose,
}: UseCommandSearchProps): UseCommandSearchReturn {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // Comandos estáticos — páginas e ações
  // Por que useMemo sem dependências?
  // router e onClose têm referência estável — não mudam
  // Memoizamos para não recriar o array a cada render
  const staticCommands = useMemo(
    (): Command[] => [
      // ── Páginas ──
      {
        id: "nav-shop",
        label: "Ir para a loja",
        description: "Ver todos os produtos",
        icon: "🏠",
        group: "páginas",
        keywords: ["home", "inicio", "loja", "produtos"],
        onSelect: () => {
          void router.push("/shop");
          onClose();
        },
      },
      {
        id: "nav-electronics",
        label: "Eletrônicos",
        description: "Smartphones, laptops e mais",
        icon: "📱",
        group: "páginas",
        keywords: ["eletronicos", "tech", "smartphones", "laptops"],
        onSelect: () => {
          void router.push("/electronics");
          onClose();
        },
      },
      {
        id: "nav-gadgets",
        label: "Gadgets",
        description: "Acessórios e dispositivos inovadores",
        icon: "🎧",
        group: "páginas",
        keywords: ["gadgets", "acessorios", "inovacao"],
        onSelect: () => {
          void router.push("/gadgets");
          onClose();
        },
      },
      {
        id: "nav-offers",
        label: "Ofertas",
        description: "Produtos com desconto",
        icon: "🏷️",
        group: "páginas",
        keywords: ["ofertas", "desconto", "promocao", "sale"],
        onSelect: () => {
          void router.push("/offers");
          onClose();
        },
      },
      {
        id: "nav-cart",
        label: "Meu carrinho",
        description: "Ver itens no carrinho",
        icon: "🛒",
        group: "páginas",
        keywords: ["carrinho", "cart", "compras"],
        onSelect: () => {
          void router.push("/cart");
          onClose();
        },
      },
      {
        id: "nav-orders",
        label: "Meus pedidos",
        description: "Histórico de compras",
        icon: "📦",
        group: "páginas",
        keywords: ["pedidos", "orders", "historico", "compras"],
        onSelect: () => {
          void router.push("/orders");
          onClose();
        },
      },
      {
        id: "nav-profile",
        label: "Meu perfil",
        description: "Configurações da conta",
        icon: "👤",
        group: "páginas",
        keywords: ["perfil", "profile", "conta", "configuracoes"],
        onSelect: () => {
          void router.push("/profile");
          onClose();
        },
      },
      // ── Ações ──
      {
        id: "action-logout",
        label: "Sair da conta",
        description: "Fazer logout",
        icon: "🚪",
        group: "ações",
        keywords: ["sair", "logout", "deslogar", "desconectar"],
        onSelect: () => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          void router.push("/auth");
          onClose();
        },
      },
      {
        id: "action-theme",
        label: "Alternar tema",
        description: "Claro / Escuro",
        icon: "🌙",
        group: "ações",
        keywords: ["tema", "theme", "dark", "light", "escuro", "claro"],
        onSelect: () => {
          // Será implementado no UX-05
          onClose();
        },
      },
    ],
    [router, onClose],
  );

  // Comandos de produtos — gerados dinamicamente dos produtos carregados
  // Por que separar de staticCommands?
  // Produtos são async (vêm da API), comandos estáticos são síncronos
  // Separar facilita entender a origem de cada grupo
  const productCommands = useMemo((): Command[] => {
    return products.slice(0, 50).map((product) => ({
      id: `product-${product.id}`,
      label: product.title,
      description: `${product.category} · R$ ${product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
      icon: "🛍️",
      group: "produtos" as const,
      keywords: [product.category, product.title.toLowerCase()],
      onSelect: () => {
        void router.push(`/shop?product=${product.id}`);
        onClose();
      },
    }));
  }, [products, router, onClose]);

  const allCommands = useMemo(
    () => [...staticCommands, ...productCommands],
    [staticCommands, productCommands],
  );

  // Filtra e ordena por relevância
  const results = useMemo(() => {
    if (!query.trim()) {
      // Sem query: mostra apenas páginas e ações (não produtos)
      // Por que? Com 100 produtos, a lista seria enorme
      // Produtos só aparecem quando o usuário digita algo
      return allCommands.filter((c) => c.group !== "produtos").slice(0, 8);
    }

    return allCommands
      .filter((cmd) => {
        const searchText = [
          cmd.label,
          cmd.description ?? "",
          ...(cmd.keywords ?? []),
        ].join(" ");

        return fuzzyMatch(searchText, query);
      })
      .sort((a, b) => {
        // Ordena por score decrescente — mais relevante primeiro
        const scoreA = getScore(a.label, query);
        const scoreB = getScore(b.label, query);
        return scoreB - scoreA;
      })
      .slice(0, 10); // Máximo de 10 resultados
  }, [allCommands, query]);

  // Reseta o índice selecionado quando os resultados mudam
  // Sem isso, o índice poderia apontar para um item inexistente
  useMemo(() => {
    setSelectedIndex(0);
  }, [results]);

  function executeSelected() {
    const selected = results[selectedIndex];
    if (selected) selected.onSelect();
  }

  return {
    query,
    setQuery,
    results,
    selectedIndex,
    setSelectedIndex,
    executeSelected,
  };
}
