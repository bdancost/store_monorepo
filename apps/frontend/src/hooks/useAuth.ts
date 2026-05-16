import { useState } from "react";
import { useRouter } from "next/router";
import api from "../services/api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: { id: string; name: string; email: string };
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(payload: LoginPayload) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<AuthResponse>("/auth/login", payload);
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      await router.push("/shop");
    } catch {
      setError("E-mail ou senha incorretos");
    } finally {
      setLoading(false);
    }
  }

  async function register(payload: RegisterPayload) {
    setLoading(true);
    setError(null);
    try {
      await api.post("/users", payload);
      // Após registrar, faz login automaticamente
      await login({ email: payload.email, password: payload.password });
    } catch {
      setError("Erro ao criar conta. Tente outro e-mail");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    void router.push("/auth");
  }

  return { login, register, logout, loading, error };
}
