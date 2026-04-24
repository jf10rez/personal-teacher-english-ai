import api from './api';

export const modulesService = {
  thinking: async (level: string) => {
    const response = await api.post('/modules/thinking/generate', { level });
    return response.data;
  },
  naturalness: async (text: string, tone: string = 'casual') => {
    const response = await api.post('/modules/naturalness/generate', { text, tone });
    return response.data;
  },
  vocabulary: async (data: { count: number; context: string; level: string }) => {
    const response = await api.post('/modules/vocabulary/generate', data);
    return response.data;
  },
  grammar: async (topic: string, level: string) => {
    const response = await api.post('/modules/grammar/generate', { topic, level });
    return response.data;
  },
  grammarFollowUp: async (topic: string, level: string, weakPoints: string[]) => {
    const response = await api.post('/modules/grammar/follow-up', { topic, level, weakPoints });
    return response.data;
  },
  pronunciation: async (level: string, text?: string) => {
    const response = await api.post('/modules/pronunciation/generate', { level, text });
    return response.data;
  },
  immersion: async (data: { interest: string; level: string; minutesPerDay: number }) => {
    const response = await api.post('/modules/immersion/generate', data);
    return response.data;
  },
  simulationStart: async (situation: string, difficulty: number) => {
    const response = await api.post('/modules/simulation/start', { situation, difficulty });
    return response.data;
  },
  simulationMessage: async (sessionId: string, content: string) => {
    const response = await api.post(`/modules/simulation/${sessionId}/message`, { content });
    return response.data;
  },
  simulationEnd: async (sessionId: string) => {
    const response = await api.post(`/modules/simulation/${sessionId}/end`);
    return response.data;
  },
  simulationHistory: async () => {
    const response = await api.get('/modules/simulation/history');
    return response.data;
  },
  mistakes: async (text: string, level: string) => {
    const response = await api.post('/modules/mistakes/generate', { text, level });
    return response.data;
  },
  myMistakes: async () => {
    const response = await api.get('/modules/mistakes/my-mistakes');
    return response.data;
  },
  mistakesProgress: async () => {
    const response = await api.get('/modules/mistakes/progress');
    return response.data;
  },
};
