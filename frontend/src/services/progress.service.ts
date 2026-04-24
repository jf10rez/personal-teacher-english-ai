import api from './api';
import { ProgressSummary } from '../types';

export const progressService = {
  create: async (data: { module: string; score: number; timeSpent: number; notes?: string }) => {
    const response = await api.post('/progress', data);
    return response.data;
  },
  getSummary: async (): Promise<ProgressSummary> => {
    const response = await api.get('/progress/summary');
    return response.data;
  },
  getMistakes: async () => {
    const response = await api.get('/progress/mistakes');
    return response.data;
  },
};
