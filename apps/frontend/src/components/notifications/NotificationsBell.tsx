/* eslint-disable react-hooks/purity */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useNotificationsContext } from "../../contexts/NotificationsContext";
import type { Notification } from "../../hooks/useNotifications";

// Ícone de sino com badge de não lidas
function BellIcon({
  unread,
  connected,
}: {
  unread: number;
  connected: boolean;
}) {
  return (
    <div className="relative">
      {/* Indicador de conexão — verde = conectado */}
      <motion.div
        animate={{ scale: connected ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#0a0a0f] ${
          connected ? "bg-green-400" : "bg-white/20"
        }`}
      />
      <span className="text-lg">🔔</span>
      {/* Badge de não lidas */}
      <AnimatePresence>
        {unread > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500 }}
            className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-medium text-black"
            style={{ background: "linear-gradient(135deg, #d4af37, #b8960c)" }}
          >
            {unread > 9 ? "9+" : unread}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Item individual de notificação
function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) {
  const router = useRouter();

  const icons = {
    order_status: "📦",
    info: "ℹ️",
    success: "✅",
    error: "❌",
  };

  // Formata o tempo relativo — "há 2 min", "há 1h"
  function timeAgo(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "agora";
    if (minutes < 60) return `há ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `há ${hours}h`;
    return `há ${Math.floor(hours / 24)}d`;
  }

  function handleClick() {
    onRead();
    if (notification.orderId) {
      void router.push(`/orders/${notification.orderId}`);
    }
  }

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0 }}
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[.04] ${
        !notification.read ? "bg-amber-400/5" : ""
      }`}
    >
      {/* Ícone */}
      <span className="text-base shrink-0 mt-0.5">
        {icons[notification.type]}
      </span>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/70 leading-snug">
          {notification.message}
        </p>
        <p className="text-[10px] text-white/25 mt-1">
          {timeAgo(notification.timestamp)}
        </p>
      </div>

      {/* Dot de não lida */}
      {!notification.read && (
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
      )}
    </motion.button>
  );
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    clearAll,
  } = useNotificationsContext();

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Botão do sino */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setOpen((prev) => !prev);
          // Marca todas como lidas ao abrir
          if (!open && unreadCount > 0) markAllAsRead();
        }}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/[.08] bg-white/[.04] hover:border-amber-400/30 transition-colors"
        aria-label="Notificações"
      >
        <BellIcon unread={unreadCount} connected={connected} />
      </motion.button>

      {/* Dropdown de notificações */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/[.08] overflow-hidden z-50 shadow-2xl"
            style={{
              background: "rgba(12,12,22,0.98)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[.06]">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-white">Notificações</h3>
                {/* Indicador de conexão em tempo real */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[.04] border border-white/[.06]">
                  <motion.div
                    animate={connected ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-1.5 h-1.5 rounded-full ${
                      connected ? "bg-green-400" : "bg-white/20"
                    }`}
                  />
                  <span className="text-[9px] text-white/30">
                    {connected ? "ao vivo" : "offline"}
                  </span>
                </div>
              </div>

              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className="text-[10px] text-white/25 hover:text-white/50 transition-colors"
                >
                  Limpar tudo
                </button>
              )}
            </div>

            {/* Lista */}
            <div className="max-h-80 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-10 gap-3"
                  >
                    <span className="text-3xl">🔔</span>
                    <p className="text-xs text-white/30">
                      Nenhuma notificação ainda
                    </p>
                    <p className="text-[10px] text-white/15 text-center px-6">
                      Você será notificado quando o status do seu pedido mudar
                    </p>
                  </motion.div>
                ) : (
                  notifications.map((n) => (
                    <NotificationItem
                      key={n.id}
                      notification={n}
                      onRead={() => markAsRead(n.id)}
                    />
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/[.04]">
                <p className="text-[10px] text-white/20 text-center">
                  {notifications.length}
                  {notifications.length === 1 ? "ão" : "ões"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
