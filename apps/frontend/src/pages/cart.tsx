/* eslint-disable @next/next/no-img-element */
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useCartContext } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import QuantityControl from "../components/cart/QuantityControl";

import api from "../services/api";

// ─────────────────────────────────────────────
// Componente de skeleton
// Por que skeleton e não spinner?
// Skeleton preserva o layout da página — o usuário
// entende o que está carregando antes mesmo de ver.
// Spinner é genérico e aumenta a sensação de espera.
// ─────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-2xl bg-white/[.04] border border-white/[.06]"
        >
          <div className="w-20 h-20 rounded-xl bg-white/[.06] shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/[.06] rounded-full w-3/4" />
            <div className="h-3 bg-white/[.06] rounded-full w-1/3" />
          </div>
          <div className="w-24 h-8 bg-white/[.06] rounded-xl" />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty state
// Por que ter um empty state dedicado?
// UX: o usuário precisa saber o que fazer quando
// chega em uma página sem conteúdo. Sem isso ele
// fica perdido e abandona o site.
// ─────────────────────────────────────────────
function EmptyCart() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-5"
    >
      <motion.span
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-6xl"
      >
        🛒
      </motion.span>
      <div className="text-center">
        <h2 className="text-xl font-medium text-white">Carrinho vazio</h2>
        <p className="text-sm text-white/40 mt-2">
          Adicione produtos para continuar
        </p>
      </div>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => void router.push("/shop")}
        className="px-6 py-3 rounded-xl text-sm font-medium text-black"
        style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
      >
        Explorar produtos →
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Item do carrinho
// Por que componente separado e não inline?
// Cada item tem sua própria lógica de estado
// (removendo, quantidade). Extrair evita que o
// estado de um item afete os outros — isolamento
// de responsabilidade.
// ─────────────────────────────────────────────
interface CartItemRowProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      price: number;
      image: string;
      category?: string;
    };
  };
  onRemove: (id: string) => Promise<void>;
}

function CartItemRow({ item, onRemove }: CartItemRowProps) {
  const subtotal = item.product.price * item.quantity;

  return (
    <motion.div
      // layout faz o resto dos itens se reorganizarem
      // suavemente quando um item é removido
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-4 p-4 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 transition-colors group"
    >
      {/* Imagem do produto */}
      <div className="w-20 h-20 rounded-xl bg-white/[.04] border border-white/[.06] flex items-center justify-center shrink-0 overflow-hidden">
        <img
          src={item.product.image}
          alt={item.product.title}
          className="w-full h-full object-contain p-2"
          // onError: fallback se a imagem quebrar
          // importante em e-commerce onde imagens
          // podem vir de APIs externas instáveis
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Informações */}
      <div className="flex-1 min-w-0">
        {/* Badge de categoria */}
        <span className="text-[10px] text-amber-400/60 tracking-wide">
          {item.product.category}
        </span>
        <h3 className="text-sm font-medium text-white/80 line-clamp-2 leading-snug mt-0.5">
          {item.product.title}
        </h3>
        <p className="text-xs text-white/40 mt-1">
          {item.product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}{" "}
          × {item.quantity}
        </p>
      </div>

      {/* Subtotal + remover */}
      <div className="flex flex-col items-end gap-3 shrink-0">
        <p className="text-base font-medium text-amber-400">
          {subtotal.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>

        {/* Controle de quantidade com Optimistic UI */}
        <QuantityControl itemId={item.id} initialQuantity={item.quantity} />

        {/* Botão remover */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => void onRemove(item.id)}
          className="text-xs text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-1"
          aria-label="Remover item"
        >
          🗑️ <span>Remover</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function CartPage() {
  // useProtectedRoute: redireciona se não tiver token
  // Reutilizamos o mesmo hook da ShopPage — DRY principle
  // (Don't Repeat Yourself)
  const { checking } = useProtectedRoute();

  // Pegamos os dados do contexto global
  // Por que não fazer um novo useEffect + fetch aqui?
  // Porque o CartContext já tem os dados atualizados.
  // Fazer novo fetch causaria flash de loading
  // desnecessário e inconsistência de estado.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cart, total, loading, refetch } = useCartContext();
  const { showToast } = useToast();
  const router = useRouter();

  // Enquanto verifica autenticação, mostra skeleton
  if (checking || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
          <div className="h-8 w-48 bg-white/[.04] rounded-full mb-8 animate-pulse" />
          <CartSkeleton />
        </div>
      </div>
    );
  }

  async function handleRemove(cartItemId: string) {
    try {
      await api.delete(`/cart/item/${cartItemId}`);
      // Após remover, sincroniza o contexto global
      // Isso garante que o badge do header também atualize
      await refetch();
      showToast("Item removido do carrinho", "info");
    } catch {
      showToast("Erro ao remover item", "error");
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        {/* Cabeçalho da página */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-medium text-white">Meu carrinho</h1>
            <p className="text-sm text-white/30 mt-1">
              {cart?.items.length ?? 0}{" "}
              {(cart?.items.length ?? 0) === 1 ? "item" : "itens"}
            </p>
          </div>

          {/* Botão voltar */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => void router.push("/shop")}
            className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            ← Continuar comprando
          </motion.button>
        </motion.div>

        {/* Conteúdo — três estados tratados explicitamente */}
        {!cart || cart.items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Lista de itens */}
            <div className="flex-1 flex flex-col gap-3">
              {/* AnimatePresence: anima entrada E saída dos itens */}
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onRemove={handleRemove}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Resumo — será preenchido no CART-03 */}
            <div className="lg:w-80 shrink-0">
              <div className="rounded-2xl border border-dashed border-amber-400/20 flex items-center justify-center h-48">
                <p className="text-amber-400/30 text-xs tracking-widest">
                  RESUMO — CART-03
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
