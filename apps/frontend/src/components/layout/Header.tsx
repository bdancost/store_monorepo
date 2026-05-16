import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import Clock from "./Clock";
import CartButton from "./CartButton";

const navLinks = [
  { label: "Início", href: "/shop" },
  { label: "Eletrônicos", href: "/shop?category=electronics" },
  { label: "Gadgets", href: "/shop?category=gadgets" },
  { label: "Ofertas", href: "/shop?category=offers" },
];

export default function Header() {
  const router = useRouter();

  return (
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
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/shop" className="flex items-center gap-3 shrink-0">
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
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

        {/* Navegação */}
        <nav className="hidden md:flex items-center gap-1">
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

                {/* Underline animado na rota ativa */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, #d4af37, transparent)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Lado direito — será preenchido nas próximas tasks */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="text-xs text-white/20 hidden lg:block">
            <div className="flex items-center gap-4 ml-auto">
              <CartButton />
              <Clock />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
