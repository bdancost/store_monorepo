import { createContext, useContext, ReactNode } from "react";
import { useCart } from "../hooks/useCart";

export type Cart = {
  id: string;
  items: {
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      price: number;
      image: string;
    };
  }[];
};

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  total: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  itemCount: 0,
  total: 0,
  loading: false,
  refetch: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { cart, itemCount, total, loading, refetch } = useCart();

  return (
    <CartContext.Provider value={{ cart, itemCount, total, loading, refetch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
