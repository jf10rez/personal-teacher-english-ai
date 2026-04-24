import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

class ConversationSocketManager {
  private socket: Socket | null = null;

  connect() {
    const token = useAuthStore.getState().accessToken;
    if (!token) return;

    this.socket = io(`${import.meta.env.VITE_WS_URL || 'http://localhost:4000'}/conversation`, {
      auth: { token },
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinSession(data: { userId: string; topic: string; level: string }) {
    this.socket?.emit('joinSession', data);
  }

  sendMessage(content: string) {
    this.socket?.emit('sendMessage', { content });
  }

  endSession() {
    this.socket?.emit('endSession');
  }

  onSessionStarted(callback: (data: any) => void) {
    this.socket?.on('sessionStarted', callback);
  }

  onMessageChunk(callback: (data: { chunk: string }) => void) {
    this.socket?.on('messageChunk', callback);
  }

  onMessageComplete(callback: (data: { content: string }) => void) {
    this.socket?.on('messageComplete', callback);
  }

  onSessionEnded(callback: () => void) {
    this.socket?.on('sessionEnded', callback);
  }

  offAll() {
    if (this.socket) {
      this.socket.off('sessionStarted');
      this.socket.off('messageChunk');
      this.socket.off('messageComplete');
      this.socket.off('sessionEnded');
    }
  }

  getSocket() {
    return this.socket;
  }
}

export const conversationSocket = new ConversationSocketManager();
