import { useTheme } from "@/hooks/useTheme";

/**
 * A hook to easily get color values for use in dynamic styling based on theme
 */
export function useThemeColors() {
  const { isDark } = useTheme();

  return {
    isDark,
    // Return dynamic color values based on theme
    textColors: {
      primary: isDark
        ? "var(--color-primary-foreground)"
        : "var(--color-primary)",
      secondary: isDark
        ? "var(--color-secondary-foreground)"
        : "var(--color-secondary)",
      muted: isDark ? "var(--color-muted-foreground)" : "var(--color-muted)",
      accent: isDark ? "var(--color-accent-foreground)" : "var(--color-accent)",
    },
    bgColors: {
      primary: isDark ? "var(--color-primary)" : "var(--color-background)",
      secondary: isDark
        ? "var(--color-secondary)"
        : "var(--color-secondary-foreground)",
      muted: isDark ? "var(--color-muted)" : "var(--color-muted-foreground)",
      accent: isDark ? "var(--color-accent)" : "var(--color-accent-foreground)",
    },
    iconColors: {
      primary: isDark ? "var(--wisely-champagne)" : "var(--wisely-gold)",
      secondary: isDark ? "var(--wisely-sand)" : "var(--wisely-darkyellow)",
      muted: isDark ? "var(--wisely-lightGray)" : "var(--wisely-gray)",
      accent: isDark ? "var(--wisely-yellow)" : "var(--wisely-darkYellow)",
    },
  };
}
