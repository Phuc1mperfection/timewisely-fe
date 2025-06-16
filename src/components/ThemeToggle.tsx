import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full transition-colors"
    >
      {isDark ? (
        <SunIcon className="h-[1.2rem] w-[1.2rem] text-[var(--wisely-yellow)]" />
      ) : (
        <MoonIcon className="h-[1.2rem] w-[1.2rem] text-[var(--wisely-purple)]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
