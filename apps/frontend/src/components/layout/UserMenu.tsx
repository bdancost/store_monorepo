/* eslint-disable react-hooks/set-state-in-effect */
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../ui/ThemeToggle";

interface MenuItem {
  icon: string;
  label: string;
  href?: string;
  action?: () => void;
  danger?: boolean;
}

export default function UserMenu() {
  const user = useUser();
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fecha ao trocar de rota
  useEffect(() => {
    setOpen(false);
  }, [router.pathname]);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const menuItems: MenuItem[] = [
    {
      icon: "📦",
      label: "Meus pedidos",
      href: "/orders",
    },
    {
      icon: "👤",
      label: "Meu perfil",
      href: "/profile",
    },
    {
      icon: "🚪",
      label: "Sair da conta",
      action: logout,
      danger: true,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        whileTap={{ scale: 0.93 }}
        className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 border border-amber-400/20 bg-white/[.04] hover:border-amber-400/50 transition-colors"
        aria-label="Menu do usuário"
        aria-expanded={open}
      >
        {/* Círculo com iniciais */}
        <motion.div
          animate={{ scale: open ? 0.92 : 1 }}
          transition={{ duration: 0.2 }}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-black shrink-0"
          style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
        >
          {initials}
        </motion.div>

        {/* Nome curto */}
        <span className="text-sm text-white/70 hidden sm:block max-w-[96px] truncate">
          {user.name.split(" ")[0]}
        </span>

        {/* Seta */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-amber-400/50 text-xs hidden sm:block"
        >
          ▾
        </motion.span>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-amber-400/15 overflow-hidden z-50"
            style={{
              background: "rgba(15, 15, 26, 0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Header do dropdown */}
            <div className="px-4 py-4 border-b border-white/[.06]">
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
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
              </div>

              {/* Badge premium */}
              <div className="mt-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/20 w-fit">
                <span className="text-xs">⭐</span>
                <span className="text-xs text-amber-400 font-medium tracking-wide">
                  Membro Premium
                </span>
              </div>
            </div>
            <div className="px-3 pb-2 border-b border-white/[.06]">
              <ThemeToggle variant="full" />
            </div>

            {/* Itens do menu */}
            <div className="py-2">
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setOpen(false);
                    if (item.href) void router.push(item.href);
                    if (item.action) item.action();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left ${
                    item.danger
                      ? "text-red-400/70 hover:text-red-400 hover:bg-red-400/10"
                      : "text-white/60 hover:text-white hover:bg-white/[.05]"
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/[.06]">
              <p className="text-[10px] text-white/20 text-center tracking-wide">
                LUXTECH PREMIUM STORE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
