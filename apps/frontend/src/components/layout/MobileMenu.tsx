/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCartContext } from "../../contexts/CartContext";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import Clock from "./Clock";

const navLinks = [
  { label: "Início", href: "/shop", icon: "🏠" },
  { label: "Eletrônicos", href: "/electronics", icon: "📱" },
  { label: "Gadgets", href: "/gadgets", icon: "🎧" },
  { label: "Ofertas", href: "/offers", icon: "🏷️" },
  { label: "Meu carrinho", href: "/cart", icon: "🛒" },
  { label: "Meus pedidos", href: "/orders", icon: "📦" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const router = useRouter();
  const { itemCount } = useCartContext();
  const user = useUser();
  const { logout } = useAuth();
  const isMounted = useRef(false); // <- flag para ignorar primeira execução

  // Fecha com tecla Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Trava o scroll do body enquanto aberto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fecha ao trocar de rota — ignora montagem inicial
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    onClose();
  }, [router.pathname]); // <- removido onClose das deps intencionalmente

  const initials =
    user?.name
      .split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "?";

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col border-l border-amber-400/10"
            style={{ background: "rgba(10, 10, 20, 0.98)" }}
          >
            {/* Topo do drawer */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-white/[.06]">
              <div
                className="w-8 h-8 flex items-center justify-center text-base"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  clipPath:
                    "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                }}
              >
                ⚡
              </div>

              <Clock />

              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                aria-label="Fechar menu"
              >
                ✕
              </motion.button>
            </div>

            {/* Perfil do usuário */}
            {user && (
              <div className="px-5 py-4 border-b border-white/[.06]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-black shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #d4af37, #b8960c)",
                    }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Links de navegação */}
            <nav className="flex-1 overflow-y-auto py-3">
              {navLinks.map((link, i) => {
                const isActive = router.asPath === link.href;
                const isCart = link.href === "/cart";

                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-3 px-5 py-3.5 text-sm transition-colors relative ${
                        isActive
                          ? "text-amber-400 bg-amber-400/10"
                          : "text-white/60 hover:text-white hover:bg-white/[.04]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="mobile-nav-indicator"
                          className="absolute left-0 top-0 bottom-0 w-0.5"
                          style={{
                            background:
                              "linear-gradient(180deg, #d4af37, #b8960c)",
                          }}
                        />
                      )}

                      <span className="text-base">{link.icon}</span>
                      <span className="flex-1">{link.label}</span>

                      {isCart && itemCount > 0 && (
                        <span
                          className="text-[10px] font-medium text-black px-1.5 py-0.5 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, #d4af37, #b8960c)",
                          }}
                        >
                          {itemCount > 99 ? "99+" : itemCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Botão de logout */}
            <div className="px-5 py-4 border-t border-white/[.06]">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onClose();
                  logout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <span>🚪</span>
                <span>Sair da conta</span>
              </motion.button>

              <p className="text-[10px] text-white/15 text-center mt-3 tracking-widest">
                LUXTECH PREMIUM STORE
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
