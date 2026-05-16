import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

// Partícula animada
function Particle({
  x,
  delay,
  size,
}: {
  x: number;
  delay: number;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-amber-400"
      style={{ left: `${x}%`, bottom: "10%", width: size, height: size }}
      animate={{ y: [-0, -120], opacity: [0, 1, 1, 0] }}
      transition={{
        // eslint-disable-next-line react-hooks/purity
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

// Dispositivo flutuante
function DeviceCard({
  icon,
  label,
  style,
  delay,
}: {
  icon: string;
  label: string;
  style: React.CSSProperties;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-amber-400/30 rounded-xl flex flex-col items-center justify-center gap-1 p-3 cursor-pointer"
      style={style}
      animate={{ y: [0, -16, 0], rotate: [0, 2, 0] }}
      transition={{
        duration: 5 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      whileHover={{ borderColor: "rgba(212,175,55,0.8)", scale: 1.05 }}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-[9px] text-amber-400/60 tracking-widest">
        {label}
      </span>
    </motion.div>
  );
}

const particles = Array.from({ length: 16 }, (_, i) => ({
  x: Math.random() * 100,
  delay: i * 0.4,
  size: 2 + Math.random() * 3,
}));

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden border border-amber-400/10 shadow-2xl">
        {/* Painel esquerdo — ilustrações */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-[#0d0d1a] via-[#12101e] to-[#0a0a0f] flex-col items-center justify-center p-10 relative overflow-hidden border-r border-amber-400/10">
          {/* Partículas */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p, i) => (
              <Particle key={i} {...p} />
            ))}
          </div>

          {/* Anéis orbitais */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <motion.div
              className="absolute w-52 h-52 rounded-full border border-dashed border-amber-400/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
            </motion.div>

            <motion.div
              className="absolute w-68 h-68 rounded-full border border-dashed border-amber-400/10"
              style={{ width: 272, height: 272 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400/60" />
            </motion.div>

            {/* Dispositivos */}
            <DeviceCard
              icon="📱"
              label="MOBILE"
              style={{ width: 58, height: 88, top: 4, right: 4 }}
              delay={0}
            />
            <DeviceCard
              icon="💻"
              label="LAPTOP"
              style={{ width: 80, height: 56, bottom: 24, left: 0 }}
              delay={1.2}
            />
            <DeviceCard
              icon="⌚"
              label="WATCH"
              style={{ width: 48, height: 56, top: 44, left: 18 }}
              delay={0.6}
            />

            {/* Logo central */}
            <motion.div
              className="z-10 flex flex-col items-center gap-2"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center text-3xl"
                style={{
                  background: "linear-gradient(135deg, #d4af37, #f5d56e)",
                  clipPath:
                    "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                }}
              >
                ⚡
              </div>
              <span className="text-xl font-medium text-amber-400 tracking-[4px]">
                LUXTECH
              </span>
              <span className="text-[10px] text-amber-400/50 tracking-[3px]">
                PREMIUM STORE
              </span>
            </motion.div>
          </div>

          {/* Tagline */}
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-medium text-white leading-relaxed">
              Tecnologia que
              <br />
              <span className="text-amber-400">transforma sua vida</span>
            </h2>
            <p className="text-xs text-white/30 mt-2 tracking-widest">
              ELETRÔNICOS · GADGETS · LIFESTYLE
            </p>
          </motion.div>

          {/* Badges de segurança */}
          <div className="flex gap-4 mt-8">
            {["🔒 SSL seguro", "🛡️ Dados protegidos", "⭐ Premium"].map((b) => (
              <span key={b} className="text-[10px] text-white/25">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Painel direito — formulário */}
        <div className="w-full md:w-[360px] bg-[#0f0f1a] flex flex-col p-10">
          {/* Tabs */}
          <div className="flex bg-white/[.04] rounded-xl p-1 mb-8">
            {(["login", "register"] as const).map((t) => (
              <motion.button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                  tab === t ? "text-black" : "text-white/40 hover:text-white/60"
                }`}
              >
                {tab === t && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{
                      background: "linear-gradient(135deg, #d4af37, #b8960c)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {t === "login" ? "Entrar" : "Criar conta"}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Formulário com AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div key={tab}>
              {tab === "login" ? <LoginForm /> : <RegisterForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
