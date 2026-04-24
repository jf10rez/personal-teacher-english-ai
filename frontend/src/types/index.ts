export interface User {
  id: string;
  name: string;
  email: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  dailyMinutes: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Task {
  type: string;
  description: string;
  completed: boolean;
}

export interface DayPlan {
  dayNumber: number;
  tasks: Task[];
}

export interface LearningPlan {
  _id: string;
  userId: string;
  days: DayPlan[];
  weeklyCheckpoints: { week: number; summary: string; miniTestScore: number }[];
  startDate: string;
  active: boolean;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  example: string;
  pronunciation: string;
  collocation: string;
  memoryTrick: string;
  mastered: boolean;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  corrections?: { original: string; corrected: string; explanation: string }[];
  timestamp: string;
}

export interface ProgressSummary {
  byModule: Record<string, { totalScore: number; count: number; avgScore: number; totalTime: number }>;
  recentActivity: any[];
}

export interface MistakePattern {
  pattern: string;
  why: string;
  examples: { wrong: string; correct: string }[];
  drill: string;
}
