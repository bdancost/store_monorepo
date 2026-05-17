import { useMemo } from "react";

interface CartItem {
  quantity: number;
  product: {
    price: number;
  };
}

interface OrderSummary {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingProgress: number; // 0 a 100 — para a barra de progresso
  hasFreeShipping: boolean;
  amountToFreeShipping: number; // quanto falta para frete grátis
}

// Constantes de regra de negócio ficam fora do hook
// Por que constantes e não valores hardcoded?
// Se precisar mudar o valor de frete grátis, muda em
// um lugar só — não precisa caçar no código inteiro
const FREE_SHIPPING_THRESHOLD = 299;
const SHIPPING_COST = 19.9;

export function useOrderSummary(items: CartItem[]): OrderSummary {
  return useMemo(() => {
    // useMemo: só recalcula quando `items` mudar
    // Sem useMemo, recalcularia a cada render do componente pai
    // Com 100 itens no carrinho, isso seria custoso

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // Regra de negócio: frete grátis acima do threshold
    const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = hasFreeShipping ? 0 : SHIPPING_COST;

    // Quanto falta para frete grátis
    const amountToFreeShipping = Math.max(
      0,
      FREE_SHIPPING_THRESHOLD - subtotal,
    );

    // Progresso para a barra visual (0 a 100)
    const freeShippingProgress = Math.min(
      100,
      (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    );

    // Por enquanto sem cupom — será implementado futuramente
    const discount = 0;

    const total = subtotal + shipping - discount;

    return {
      subtotal,
      shipping,
      discount,
      total,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      freeShippingProgress,
      hasFreeShipping,
      amountToFreeShipping,
    };
  }, [items]); // só recalcula quando items mudar
}
