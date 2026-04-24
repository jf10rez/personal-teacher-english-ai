import api from './api';

export const conversationService = {
  createSession: async (topic: string, level: string) => {
    const response = await api.post('/conversations', { topic, level });
    return response.data;
  },
  sendMessage: async (sessionId: string, content: string) => {
    const response = await api.post(`/conversations/${sessionId}/message`, { content });
    return response.data;
  },
  endSession: async (sessionId: string) => {
    const response = await api.post(`/conversations/${sessionId}/end`);
    return response.data;
  },
  getSession: async (sessionId: string) => {
    const response = await api.get(`/conversations/${sessionId}`);
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/conversations/history');
    return response.data;
  },
};
