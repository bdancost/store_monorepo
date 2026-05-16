import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

export default function RegisterForm() {
  const { register, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await register({ name, email, password });
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4"
    >
      <div>
        <h2 className="text-2xl font-medium text-white">Criar conta</h2>
        <p className="text-sm text-white/40 mt-1">
          Junte-se à experiência premium
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
        >
          {error}
        </motion.div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs text-amber-400/70 tracking-widest">
          NOME COMPLETO
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          required
          className="bg-white/[.04] border border-amber-400/20 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-amber-400/70 tracking-widest">
          E-MAIL
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="bg-white/[.04] border border-amber-400/20 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-amber-400/70 tracking-widest">
          SENHA
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mín. 6 caracteres"
          required
          minLength={6}
          className="bg-white/[.04] border border-amber-400/20 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 outline-none focus:border-amber-400/60 transition-colors"
        />
      </div>

      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-600 text-black font-medium rounded-lg text-sm disabled:opacity-60 transition-opacity"
      >
        {loading ? "Criando conta..." : "Criar minha conta →"}
      </motion.button>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/25">ou continue com</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          className="flex-1 py-2.5 bg-white/[.04] border border-white/8 rounded-lg text-white/50 text-xs hover:border-amber-400/30 hover:text-amber-400 transition-all"
        >
          Google
        </button>
        <button
          type="button"
          className="flex-1 py-2.5 bg-white/[.04] border border-white/8 rounded-lg text-white/50 text-xs hover:border-amber-400/30 hover:text-amber-400 transition-all"
        >
          Apple
        </button>
      </div>
    </motion.form>
  );
}
