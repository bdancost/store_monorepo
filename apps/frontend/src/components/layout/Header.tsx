import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import Clock from "./Clock";
import CartButton from "./CartButton";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

const navLinks = [
  { label: "Início", href: "/shop" },
  { label: "Eletrônicos", href: "/shop?category=electronics" },
  { label: "Gadgets", href: "/shop?category=gadgets" },
  { label: "Ofertas", href: "/shop?category=offers" },
];

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-amber-400/10"
        style={{
          background: "rgba(10, 10, 15, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          {/* Logo */}
          <Link href="/shop" className="flex items-center gap-3 shrink-0">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-9 h-9 flex items-center justify-center text-lg shrink-0"
              style={{
                background: "linear-gradient(135deg, #d4af37, #f5d56e)",
                clipPath:
                  "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
              }}
            >
              ⚡
            </motion.div>
            <span className="text-base font-medium text-amber-400 tracking-[3px] hidden sm:block">
              LUXTECH
            </span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => {
              const isActive =
                router.asPath === link.href ||
                (link.href !== "/shop" && router.asPath.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm transition-colors group"
                  style={{
                    color: isActive ? "#d4af37" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span className="relative z-10 group-hover:text-white transition-colors">
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, #d4af37, transparent)",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Lado direito desktop */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <CartButton />
            <div className="w-px h-5 bg-white/10" />
            <UserMenu />
            <div className="w-px h-5 bg-white/10" />
            <Clock />
          </div>

          {/* Lado direito mobile */}
          <div className="flex md:hidden items-center gap-3 ml-auto">
            <CartButton />

            {/* Botão hamburguer */}
            <motion.button
              onClick={() => setMobileOpen((prev) => !prev)}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-amber-400/20 bg-white/[.04] hover:border-amber-400/50 transition-colors"
              aria-label="Abrir menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="text-amber-400 text-lg leading-none"
                  >
                    ✕
                  </motion.span>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-1.5 items-center"
                  >
                    <span className="w-5 h-px bg-amber-400/70 block" />
                    <span className="w-3.5 h-px bg-amber-400/50 block" />
                    <span className="w-5 h-px bg-amber-400/70 block" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Drawer mobile */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
