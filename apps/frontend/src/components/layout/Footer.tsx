import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// ─────────────────────────────────────────────
// Configuração dos links — dados separados do JSX
// Fácil de adicionar/remover colunas sem tocar no layout
// ─────────────────────────────────────────────
const FOOTER_LINKS = [
  {
    title: "Loja",
    links: [
      { label: "Todos os produtos", href: "/shop" },
      { label: "Eletrônicos", href: "/electronics" },
      { label: "Gadgets", href: "/gadgets" },
      { label: "Ofertas", href: "/offers" },
    ],
  },
  {
    title: "Conta",
    links: [
      { label: "Meu perfil", href: "/profile" },
      { label: "Meus pedidos", href: "/orders" },
      { label: "Carrinho", href: "/cart" },
      { label: "Entrar", href: "/auth" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "/about" },
      { label: "Carreiras", href: "/careers" },
      { label: "Blog", href: "#" },
      { label: "Imprensa", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Fale conosco", href: "#" },
      { label: "Trocas e devoluções", href: "#" },
      { label: "Rastrear pedido", href: "#" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", icon: "📸", href: "#" },
  { label: "Twitter/X", icon: "𝕏", href: "#" },
  { label: "LinkedIn", icon: "in", href: "#" },
  { label: "YouTube", icon: "▶", href: "#" },
];

const TRUST_BADGES = [
  { icon: "🔒", label: "SSL Seguro" },
  { icon: "✅", label: "Compra garantida" },
  { icon: "🚚", label: "Entrega expressa" },
  { icon: "↩️", label: "30 dias p/ troca" },
];

const LEGAL_LINKS = [
  { label: "Política de privacidade", href: "#" },
  { label: "Termos de uso", href: "#" },
  { label: "Cookies", href: "#" },
  { label: "Acessibilidade", href: "#" },
];

// ─────────────────────────────────────────────
// Newsletter CTA
// Por que ter isso no footer?
// Captura emails de usuários que chegaram ao final
// da página sem converter — segunda chance de engajamento
// ─────────────────────────────────────────────
function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  }

  return (
    <div className="border-b border-amber-400/10 pb-12 mb-12">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3"
          >
            <div
              className="w-1.5 h-1.5 rounded-full bg-amber-400"
              style={{ boxShadow: "0 0 6px rgba(212,175,55,0.8)" }}
            />
            <span className="text-xs text-amber-400/70 tracking-widest">
              NEWSLETTER
            </span>
          </motion.div>

          <motion.h3
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-medium text-white mb-2"
          >
            Fique por dentro das{" "}
            <span className="text-amber-400">melhores ofertas</span>
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm text-white/40"
          >
            Receba lançamentos exclusivos, ofertas antecipadas e conteúdo
            premium diretamente no seu e-mail.
          </motion.p>
        </div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-auto lg:min-w-[400px]"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-green-500/20 bg-green-500/10"
            >
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-medium text-green-400">
                  Inscrição confirmada!
                </p>
                <p className="text-xs text-green-400/60 mt-0.5">
                  Você receberá nossas novidades em breve.
                </p>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="flex-1 bg-white/[.04] border border-white/[.08] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-amber-400/40 transition-colors"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.96 }}
                className="px-5 py-3 rounded-xl text-sm font-medium text-black shrink-0 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #b8960c)",
                }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 -skew-x-12"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                  }}
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative z-10">Inscrever →</span>
              </motion.button>
            </form>
          )}

          <p className="text-[10px] text-white/20 mt-2 px-1">
            Sem spam. Cancele quando quiser. Seus dados são protegidos.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Coluna de links
// ─────────────────────────────────────────────
function FooterColumn({
  title,
  links,
  delay = 0,
}: {
  title: string;
  links: { label: string; href: string }[];
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex flex-col gap-4"
    >
      <h4 className="text-xs font-medium text-white/60 tracking-widest uppercase">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-white/35 hover:text-amber-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Footer principal
// ─────────────────────────────────────────────
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-amber-400/10 mt-24"
      style={{
        background: "linear-gradient(180deg, #0a0a0f 0%, #0d0d1a 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Newsletter */}
        <NewsletterSection />

        {/* Grid de links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {FOOTER_LINKS.map((col, i) => (
            <FooterColumn
              key={col.title}
              title={col.title}
              links={col.links}
              delay={i * 0.08}
            />
          ))}
        </div>

        {/* Selos de confiança */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 py-8 border-y border-white/[.04] mb-8"
        >
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/[.06] bg-white/[.02]"
            >
              <span className="text-base">{badge.icon}</span>
              <span className="text-xs text-white/40">{badge.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 flex items-center justify-center text-sm"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  clipPath:
                    "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                }}
              >
                ⚡
              </div>
              <span className="text-sm font-medium text-amber-400 tracking-[3px]">
                LUXTECH
              </span>
            </div>
            <span className="text-white/15 text-xs hidden sm:block">·</span>
            <p className="text-xs text-white/25 hidden sm:block">
              © {currentYear} LUXTECH. Todos os direitos reservados.
            </p>
          </motion.div>

          {/* Redes sociais */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            {SOCIAL_LINKS.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1, borderColor: "rgba(212,175,55,0.4)" }}
                whileTap={{ scale: 0.9 }}
                aria-label={social.label}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/[.08] bg-white/[.04] text-white/40 hover:text-amber-400 transition-colors text-xs font-medium"
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Links legais */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-x-4 gap-y-1"
          >
            {LEGAL_LINKS.map((link, i) => (
              <span key={link.label} className="flex items-center gap-4">
                <Link
                  href={link.href}
                  className="text-[11px] text-white/25 hover:text-white/50 transition-colors"
                >
                  {link.label}
                </Link>
                {i < LEGAL_LINKS.length - 1 && (
                  <span className="text-white/15 text-xs">·</span>
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
