import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  isDark: true,
  toggleTheme: () => {
    set((state) => {
      const newDark = !state.isDark;
      document.documentElement.classList.toggle('dark', newDark);
      return { isDark: newDark };
    });
  },
}));
