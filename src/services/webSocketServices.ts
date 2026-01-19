import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { NotificationMessage } from "@/interfaces";

export class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; 
  private messageCallback: ((message: NotificationMessage) => void) | null =
    null;
  private connectionStatusCallback: ((isConnected: boolean) => void) | null =
    null;

  connect(
    onMessage: (message: NotificationMessage) => void,
    onConnectionChange?: (isConnected: boolean) => void
  ): void {
    this.messageCallback = onMessage;
    this.connectionStatusCallback = onConnectionChange || null;

    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        this.connect(onMessage, onConnectionChange);
      }, 1000);
      return;
    }

    const wsUrl = `${import.meta.env.VITE_API_URL.replace(
      "/api",
      ""
    )}/ws?token=${token}`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(wsUrl) as WebSocket,

      connectHeaders: {},

      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      reconnectDelay: this.reconnectDelay,

      onConnect: () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(true);
        }

        this.client?.subscribe(
          "/user/queue/notifications",
          (message: IMessage) => {
            this.handleMessage(message);
          }
        );
      },

      onStompError: (frame) => {
        console.error("❌ STOMP error:", frame.headers["message"]);
        console.error("Error details:", frame.body);
        this.isConnected = false;
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
        this.handleReconnect();
      },

      onWebSocketClose: () => {
        this.isConnected = false;
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
        this.handleReconnect();
      },

      onWebSocketError: (event) => {
        console.error("❌ WebSocket error:", event);
        this.isConnected = false;
        if (this.connectionStatusCallback) {
          this.connectionStatusCallback(false);
        }
      },
    });

    this.client.activate();
  }
  private handleMessage(message: IMessage): void {
    try {
      const notification: NotificationMessage = JSON.parse(message.body);
      if (this.messageCallback) {
        this.messageCallback(notification);
      }
    } catch (error) {
      console.error("Failed to parse notification message:", error);
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("❌ Max reconnection attempts reached. Giving up.");
      return;
    }

    this.reconnectAttempts++;

    setTimeout(() => {
      if (this.client) {
        this.client.activate();
      }
    }, this.reconnectDelay);
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
    }
    this.isConnected = false;
    this.messageCallback = null;
    this.connectionStatusCallback = null;
    this.reconnectAttempts = 0;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
