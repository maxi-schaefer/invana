import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { toast } from "sonner";
import { Client, type Message } from "@stomp/stompjs";

interface SocketContextType {
  client: Client | null;
  connected: boolean;
  subscribe: (destination: string, callback: (msg: Message) => void) => void;
  send: (destination: string, body?: string | object) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ token: string | null; children: React.ReactNode }> = ({ token, children }) => {
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = new SockJS("http://localhost:8080/ws/frontend");
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000, // retry every 5s if disconnected
      onConnect: () => {
        console.log("✅ WebSocket connected");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("🔌 WebSocket disconnected");
        setConnected(false);
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
        toast.error("WebSocket error");
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
      stompClientRef.current = null;
    };
  }, [token]);

    const subscribe = (destination: string, callback: (msg: Message) => void) => {
        stompClientRef.current?.subscribe(destination, callback);
    };

    const send = (destination: string, body?: string | object) => {
        const payload = typeof body === 'object' ? JSON.stringify(body) : body || '';
        stompClientRef.current?.publish({ destination, body: payload });
    };

  return (
    <SocketContext.Provider value={{ client: stompClientRef.current, connected, subscribe, send }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
