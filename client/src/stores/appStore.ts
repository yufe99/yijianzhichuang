import { create } from 'zustand';
import type { InputMode, VideoMode, Task, PipelineStage } from '@/types';

interface AppState {
  // 输入状态
  inputMode: InputMode;
  inputContent: string;
  videoMode: VideoMode;
  
  // 任务状态
  currentTask: Task | null;
  isProcessing: boolean;
  
  // UI状态
  currentPage: 'home' | 'progress' | 'result';
  
  // Actions
  setInputMode: (mode: InputMode) => void;
  setInputContent: (content: string) => void;
  setVideoMode: (mode: VideoMode) => void;
  startTask: (task: Task) => void;
  updateTaskProgress: (stage: PipelineStage, progress: number) => void;
  completeTask: (outputUrl: string, thumbnail?: string, duration?: number) => void;
  failTask: (error?: string) => void;
  resetTask: () => void;
  goToPage: (page: 'home' | 'progress' | 'result') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // 初始状态
  inputMode: 'link',
  inputContent: '',
  videoMode: 'anchor',
  currentTask: null,
  isProcessing: false,
  currentPage: 'home',
  
  // Actions
  setInputMode: (mode) => set({ inputMode: mode }),
  setInputContent: (content) => set({ inputContent: content }),
  setVideoMode: (mode) => set({ videoMode: mode }),
  
  startTask: (task) => set({ 
    currentTask: task, 
    isProcessing: true, 
    currentPage: 'progress' 
  }),
  
  updateTaskProgress: (stage, progress) => set((state) => ({
    currentTask: state.currentTask ? {
      ...state.currentTask,
      current_stage: stage,
      progress,
    } : null,
  })),
  
  completeTask: (outputUrl, thumbnail, duration) => set((state) => ({
    currentTask: state.currentTask ? {
      ...state.currentTask,
      status: 'completed',
      current_stage: 'complete',
      progress: 100,
      output_url: outputUrl,
      thumbnail,
      duration,
    } : null,
    isProcessing: false,
    currentPage: 'result',
  })),
  
  failTask: () => set((state) => ({
    currentTask: state.currentTask ? {
      ...state.currentTask,
      status: 'failed',
    } : null,
    isProcessing: false,
  })),
  
  resetTask: () => set({
    currentTask: null,
    isProcessing: false,
    currentPage: 'home',
    inputContent: '',
  }),
  
  goToPage: (page) => set({ currentPage: page }),
}));
