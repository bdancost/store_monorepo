import { useState, useEffect } from "react";
import api from "../services/api";

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await api.get<Product[]>("/products");
        setProducts(data);
      } catch {
        setError("Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }

    void fetchProducts();
  }, []);

  return { products, loading, error };
}
