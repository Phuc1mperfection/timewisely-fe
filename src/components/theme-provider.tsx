import { useCallback, useEffect, useState } from "react";
import { ThemeProviderContext } from "@/contexts/ThemeContext";
import type { Theme } from "@/contexts/ThemeContext";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  // Apply theme to DOM + sync isDark
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let currentTheme = theme;
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(currentTheme);
    setIsDark(currentTheme === "dark");

    // Handle system theme changes
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newTheme = mediaQuery.matches ? "dark" : "light";
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        setIsDark(newTheme === "dark");
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      let next: Theme;
      if (prevTheme === "light") next = "dark";
      else if (prevTheme === "dark") next = "light";
      else {
        // If system, toggle against current appearance
        next = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "light"
          : "dark";
      }
      localStorage.setItem(storageKey, next); // 🔥 nhớ lưu lại
      return next;
    });
  }, [storageKey]);

  const value = {
    theme,
    isDark,
    toggleTheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
