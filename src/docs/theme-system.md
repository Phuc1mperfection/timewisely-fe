# Theme System Documentation

This document explains the theme system implementation in the TimeWisely application.

## Overview

The theme system provides a light/dark mode toggle functionality with additional features:

- Easy-to-use hooks for accessing theme state (`useTheme` and `useThemeColors`)
- Automatic system theme detection
- Theme persistence using localStorage
- Enhanced dark mode styling for UI components

## Core Components

### ThemeProvider

The `ThemeProvider` component is responsible for managing the theme state and providing it through context to the entire application. It's located in `src/components/theme-provider.tsx`.

### ThemeContext

The `ThemeContext` provides the theme data and functions to components. It's defined in `src/contexts/ThemeContext.ts`.

### useTheme Hook

The `useTheme` hook provides easy access to theme data and functions. It's defined in `src/hooks/useTheme.ts`.

```tsx
const { theme, setTheme, isDark, toggleTheme } = useTheme();
```

- `theme`: The current theme ("light", "dark", or "system")
- `isDark`: Boolean indicating if the current appearance is dark
- `setTheme`: Function to set the theme
- `toggleTheme`: Convenience function to toggle between light and dark

### useThemeColors Hook

The `useThemeColors` hook provides easy access to theme-dependent color values. It's defined in `src/hooks/useThemeColors.ts`.

```tsx
const { textColors, bgColors, iconColors } = useThemeColors();
```

## How to Use

### Setting up in App Component

The theme system is already set up in the App component. The `ThemeProvider` wraps your application.

### Using Theme Toggle

Two options are provided:

1. **ModeToggle** - A dropdown with theme options (light/dark/system)

```tsx
import { ModeToggle } from "@/components/mode-toggle";

// In your component JSX
<ModeToggle />;
```

2. **ThemeToggle** - A simple button to toggle between light and dark

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

// In your component JSX
<ThemeToggle />;
```

### Using Theme-Dependent Styling

You can use the `isDark` property from `useTheme` or the convenience color objects from `useThemeColors`:

```tsx
import { useTheme } from "@/hooks/useTheme";
import { useThemeColors } from "@/hooks/useThemeColors";

function MyComponent() {
  const { isDark } = useTheme();
  const { iconColors } = useThemeColors();

  return (
    <div>
      <h1 className={isDark ? "text-white" : "text-black"}>Dynamic Heading</h1>

      <Icon style={{ color: iconColors.primary }} />
    </div>
  );
}
```

### CSS Variables

Our theme system defines CSS variables in `index.css` that automatically change based on the theme. You can use these variables directly in your CSS:

```css
.my-element {
  background-color: var(--background);
  color: var(--foreground);
}
```

## Best Practices

1. Use the Tailwind classes with dark variants whenever possible:

   ```tsx
   <div className="bg-background text-foreground dark:bg-card dark:text-card-foreground">
   ```

2. For dynamic styling based on theme, use the hooks:

   ```tsx
   const { isDark } = useTheme();
   const className = isDark ? "dark-class" : "light-class";
   ```

3. For icons, consider using the provided icon colors for consistency:

   ```tsx
   const { iconColors } = useThemeColors();
   <Icon style={{ color: iconColors.primary }} />;
   ```

4. Avoid heavy visual effects in dark mode (excessive shadows, blurs, etc.) to keep the UI clean and performant.
