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
  freeShippingProgress: number;
  hasFreeShipping: boolean;
  amountToFreeShipping: number;
}

const FREE_SHIPPING_THRESHOLD = 299;
const SHIPPING_COST = 19.9;

export function useOrderSummary(items: CartItem[]): OrderSummary {
  return useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    // 1. Se não há itens, o frete DEVE ser 0. Caso contrário, aplica a regra do limite.
    const isEmpty = items.length === 0;
    const hasFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
    const shipping = isEmpty || hasFreeShipping ? 0 : SHIPPING_COST;

    // 2. Se o carrinho está vazio, não falta nada para o frete grátis (evita confundir o usuário)
    const amountToFreeShipping = isEmpty
      ? FREE_SHIPPING_THRESHOLD
      : Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

    // 3. Se está vazio, o progresso da barra é 0
    const freeShippingProgress = isEmpty
      ? 0
      : Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

    const discount = 0;

    // Agora, se subtotal for 0 e shipping for 0, o total será 0 de forma correta!
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
  }, [items]);
}
