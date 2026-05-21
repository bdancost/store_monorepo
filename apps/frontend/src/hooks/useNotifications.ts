import { useState, useEffect, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

// Tipos das notificações que o backend envia
export interface OrderStatusNotification {
  orderId: string;
  oldStatus: string;
  newStatus: string;
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: "order_status" | "info" | "success" | "error";
  message: string;
  orderId?: string;
  timestamp: string;
  read: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  connected: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState(false);
  // useRef para o socket — não queremos re-render quando reconecta
  const socketRef = useRef<Socket | null>(null);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "read">) => {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).slice(2),
        read: false,
      };

      setNotifications((prev) => {
        // Máximo de 20 notificações — evita crescimento infinito
        const updated = [newNotification, ...prev];
        return updated.slice(0, 20);
      });
    },
    [],
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // Cria a conexão WebSocket
    // auth.token: enviado no handshake para autenticação no backend
    const socket = io(
      `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ?? "http://localhost:3000"}/notifications`,
      {
        auth: { token },
        // Reconexão automática — Socket.IO tenta reconectar
        // com backoff exponencial se a conexão cair
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      },
    );

    socketRef.current = socket;

    // Evento de conexão estabelecida
    socket.on("connected", () => {
      setConnected(true);
    });

    // Evento de desconexão
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // Evento de mudança de status do pedido
    socket.on("order:status_changed", (data: OrderStatusNotification) => {
      addNotification({
        type: "order_status",
        message: data.message,
        orderId: data.orderId,
        timestamp: data.timestamp,
      });
    });

    // Mantém a conexão viva com ping periódico
    // Por que? Alguns proxies e firewalls fecham conexões idle
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      // Desconecta ao desmontar o componente
      // Sem isso, múltiplas conexões acumulam
      socket.disconnect();
    };
  }, [addNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    connected,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
