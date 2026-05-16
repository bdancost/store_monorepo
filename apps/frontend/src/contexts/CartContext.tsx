import { createContext, useContext, ReactNode } from "react";
import { useCart } from "../hooks/useCart";

interface CartContextType {
  itemCount: number;
  total: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  itemCount: 0,
  total: 0,
  loading: false,
  refetch: async () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { itemCount, total, loading, refetch } = useCart();

  return (
    <CartContext.Provider value={{ itemCount, total, loading, refetch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  return useContext(CartContext);
}
