import { createContext } from "react";

// Theme types
export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean; // Added isDark property for easy checks
  toggleTheme: () => void; // Added shorthand toggle function
};

export const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDark: false,
  toggleTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
