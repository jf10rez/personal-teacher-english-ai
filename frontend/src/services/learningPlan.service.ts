import api from './api';
import { LearningPlan } from '../types';

export const learningPlanService = {
  generate: async (data: { level: string; goal: string; dailyMinutes: number; weeks: number }): Promise<LearningPlan> => {
    const response = await api.post('/learning-plan/generate', data);
    return response.data;
  },
  getActive: async (): Promise<LearningPlan | null> => {
    const response = await api.get('/learning-plan/active');
    return response.data;
  },
  completeDay: async (dayNumber: number): Promise<LearningPlan> => {
    const response = await api.patch(`/learning-plan/day/${dayNumber}/complete`);
    return response.data;
  },
};
