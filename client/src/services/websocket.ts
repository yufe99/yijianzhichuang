import { io, Socket } from 'socket.io-client';
import type { PipelineStage } from '@/types';

const WS_URL = import.meta.env.VITE_WS_URL || '';

type ProgressCallback = (data: { stage: PipelineStage; progress: number }) => void;
type CompleteCallback = (data: { outputUrl: string; thumbnail?: string; duration?: number }) => void;
type ErrorCallback = (error: string) => void;

class WebSocketService {
  private socket: Socket | null = null;
  
  connect(taskId: string) {
    this.socket = io(WS_URL || '/ws', {
      query: { taskId },
      transports: ['websocket'],
    });
    
    return this.socket;
  }
  
  onProgress(callback: ProgressCallback) {
    this.socket?.on('progress', callback);
  }
  
  onComplete(callback: CompleteCallback) {
    this.socket?.on('complete', callback);
  }
  
  onError(callback: ErrorCallback) {
    this.socket?.on('error', callback);
  }
  
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const wsService = new WebSocketService();
