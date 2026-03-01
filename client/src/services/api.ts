import axios from 'axios';
import type { Task, TaskInput } from '@/types';

const API_URL = 'https://yijianzhichuang-api.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 300000,
});

export const taskApi = {
  createTask: async (input: TaskInput): Promise<Task> => {
    const response = await api.post('/tasks', input);
    return response.data;
  },
  
  getTask: async (taskId: string): Promise<Task> => {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },
  
  cancelTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};

export const contentApi = {
  parseContent: async (content: string, mode: string) => {
    const response = await api.post('/parse', { content, mode });
    return response.data;
  },
  
  rewriteContent: async (content: string, style: object) => {
    const response = await api.post('/rewrite', { content, style });
    return response.data;
  },
  
  checkCompliance: async (content: string) => {
    const response = await api.post('/compliance/check', { content });
    return response.data;
  },
};

export const accountApi = {
  getAccounts: async () => {
    const response = await api.get('/accounts');
    return response.data;
  },
  
  bindAccount: async (platform: string, authData: object) => {
    const response = await api.post('/accounts/bind', { platform, ...authData });
    return response.data;
  },
  
  unbindAccount: async (accountId: string) => {
    await api.delete(`/accounts/${accountId}`);
  },
};

export const publishApi = {
  publish: async (taskId: string, platforms: string[]) => {
    const response = await api.post('/publish', { task_id: taskId, platforms });
    return response.data;
  },
  
  schedulePublish: async (taskId: string, publishTime: string) => {
    const response = await api.post('/publish/schedule', { 
      task_id: taskId, 
      publish_time: publishTime 
    });
    return response.data;
  },
};

export default api;
