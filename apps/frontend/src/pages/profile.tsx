import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useProtectedRoute } from "../hooks/useProtectedRoute";
import { useUser } from "../hooks/useUser";
import { useOrders } from "../hooks/useOrders";
import { useProfileStats } from "../hooks/useProfileStats";
import { useAuth } from "../hooks/useAuth";
import StatCard from "../components/profile/StatCard";
import StatusBadge from "../components/orders/StatusBadge";
import {
  ProfileHeroSkeleton,
  ProfileStatsSkeleton,
} from "../components/ui/skeletons/ProfileSkeleton";
import { SkeletonBox } from "../components/ui/Skeleton";

// ─────────────────────────────────────────────
// Seção reutilizável com título
// Evita repetir o mesmo padrão de título + conteúdo
// em cada seção da página
// ─────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xs font-medium text-white/40 tracking-widest">
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        <ProfileHeroSkeleton />
        <ProfileStatsSkeleton />
        {/* Seção de conta skeleton */}
        <div className="rounded-2xl border border-white/[.06] overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-4 border-b border-white/[.04] last:border-0"
            >
              <div className="flex items-center gap-3">
                <SkeletonBox width={32} height={32} rounded="lg" />
                <div className="flex flex-col gap-1.5">
                  <SkeletonBox width={60} height={10} />
                  <SkeletonBox width={140} height={14} />
                </div>
              </div>
              <SkeletonBox width={50} height={12} rounded="full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { checking } = useProtectedRoute();
  const user = useUser();
  const { orders, loading } = useOrders();
  const stats = useProfileStats(orders);
  const { logout } = useAuth();
  const router = useRouter();

  if (checking || loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-8">
          <PageSkeleton />
        </div>
      </div>
    );
  }

  // Iniciais para o avatar
  const initials =
    user?.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  // Formata data de membro — simulada pois não temos
  // createdAt no usuário ainda
  // Em produção viria do backend
  const memberSince = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  function formatBRL(value: number): string {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        {/* ── Hero do perfil ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-amber-400/15 p-8"
          style={{
            background:
              "linear-gradient(135deg, #0d0d1a 0%, #1a1400 50%, #0d0d1a 100%)",
          }}
        >
          {/* Círculos decorativos */}
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border border-amber-400/10" />
          <div className="absolute -right-4 -bottom-8 w-32 h-32 rounded-full border border-amber-400/5" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar grande */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-medium text-black shrink-0"
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8960c)",
              }}
            >
              {initials}
            </motion.div>

            {/* Dados do usuário */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-medium text-white">{user?.name}</h1>
                {/* Badge premium */}
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-400 border border-amber-400/25 tracking-wide">
                  ⭐ Premium
                </span>
              </div>
              <p className="text-sm text-white/40 mt-1">{user?.email}</p>
              <p className="text-xs text-white/20 mt-2">
                Membro desde {memberSince}
              </p>
            </div>

            {/* Botão editar — visual apenas por enquanto */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="shrink-0 px-4 py-2 rounded-xl text-xs text-white/50 border border-white/[.08] hover:border-amber-400/30 hover:text-white/70 transition-colors"
            >
              Editar perfil
            </motion.button>
          </div>
        </motion.div>

        {/* ── Estatísticas ── */}
        <Section title="ESTATÍSTICAS">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon="🛍️"
              label="Total de pedidos"
              value={String(stats.totalOrders)}
              sub={
                stats.totalOrders === 0
                  ? "Nenhum pedido ainda"
                  : `${stats.pendingOrders} em andamento`
              }
              delay={0.1}
            />
            <StatCard
              icon="💰"
              label="Total gasto"
              value={formatBRL(stats.totalSpent)}
              sub={`Média: ${formatBRL(stats.averageOrderValue)}`}
              delay={0.15}
            />
            <StatCard
              icon="✅"
              label="Entregues"
              value={String(stats.deliveredOrders)}
              sub={
                stats.totalOrders > 0
                  ? `${Math.round((stats.deliveredOrders / stats.totalOrders) * 100)}% do total`
                  : undefined
              }
              delay={0.2}
            />
            <StatCard
              icon="❌"
              label="Cancelados"
              value={String(stats.cancelledOrders)}
              delay={0.25}
            />
          </div>
        </Section>

        {/* ── Pedido mais caro ── */}
        {stats.mostExpensiveOrder && (
          <Section title="MAIOR COMPRA">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() =>
                void router.push(`/orders/${stats.mostExpensiveOrder!.id}`)
              }
              className="flex items-center justify-between p-5 rounded-2xl border border-white/[.06] bg-white/[.02] hover:border-amber-400/20 cursor-pointer transition-colors group"
            >
              <div className="flex flex-col gap-2">
                <StatusBadge
                  status={stats.mostExpensiveOrder.status}
                  showIcon={false}
                />
                <p className="text-xs font-mono text-amber-400/60">
                  #{stats.mostExpensiveOrder.id.slice(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-white/30">
                  {stats.mostExpensiveOrder.items.length}{" "}
                  {stats.mostExpensiveOrder.items.length === 1
                    ? "item"
                    : "itens"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <p className="text-2xl font-medium text-amber-400">
                  {formatBRL(stats.mostExpensiveOrder.total)}
                </p>
                <motion.span
                  className="text-white/20 group-hover:text-amber-400/60 transition-colors"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </motion.div>
          </Section>
        )}

        {/* ── Informações da conta ── */}
        <Section title="INFORMAÇÕES DA CONTA">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/[.06] bg-white/[.02] overflow-hidden"
          >
            {/* Linha de email */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[.04]">
              <div className="flex items-center gap-3">
                <span className="text-base">📧</span>
                <div>
                  <p className="text-xs text-white/40">E-mail</p>
                  <p className="text-sm text-white/70">{user?.email}</p>
                </div>
              </div>
              {/* Indicador de verificado */}
              <span className="text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-1 rounded-full">
                ✓ Verificado
              </span>
            </div>

            {/* Linha de nome */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[.04]">
              <div className="flex items-center gap-3">
                <span className="text-base">👤</span>
                <div>
                  <p className="text-xs text-white/40">Nome</p>
                  <p className="text-sm text-white/70">{user?.name}</p>
                </div>
              </div>
            </div>

            {/* Linha de senha */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="text-base">🔒</span>
                <div>
                  <p className="text-xs text-white/40">Senha</p>
                  <p className="text-sm text-white/30">••••••••</p>
                </div>
              </div>
              {/* Alterar senha — visual apenas */}
              <button className="text-xs text-amber-400/60 hover:text-amber-400 transition-colors">
                Alterar
              </button>
            </div>
          </motion.div>
        </Section>

        {/* ── Segurança ── */}
        <Section title="SEGURANÇA">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-2xl border border-white/[.06] bg-white/[.02] overflow-hidden"
          >
            {/* Atalho para pedidos */}
            <button
              onClick={() => void router.push("/orders")}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-white/[.04] hover:bg-white/[.03] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">📦</span>
                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  Meus pedidos
                </p>
              </div>
              <span className="text-white/20 group-hover:text-white/40 transition-colors">
                →
              </span>
            </button>

            {/* Atalho para loja */}
            <button
              onClick={() => void router.push("/shop")}
              className="w-full flex items-center justify-between px-5 py-4 border-b border-white/[.04] hover:bg-white/[.03] transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🛍️</span>
                <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                  Continuar comprando
                </p>
              </div>
              <span className="text-white/20 group-hover:text-white/40 transition-colors">
                →
              </span>
            </button>

            {/* Logout — ação destrutiva sempre por último e em vermelho */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-5 py-4 text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-colors group"
            >
              <span className="text-base">🚪</span>
              <p className="text-sm">Sair da conta</p>
            </button>
          </motion.div>
        </Section>

        {/* Footer da página */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[10px] text-white/15 tracking-widest pb-4"
        >
          LUXTECH PREMIUM STORE · TODOS OS DIREITOS RESERVADOS
        </motion.p>
      </div>
    </div>
  );
}
