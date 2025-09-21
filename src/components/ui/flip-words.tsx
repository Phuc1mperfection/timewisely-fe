import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const FlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const word = words[words.indexOf(currentWord) + 1] || words[0];
    setCurrentWord(word);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(() => {
        startAnimation();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <span
      className={cn(
        "inline-block relative text-left px-2",
        className,
      )}
    >
      <span
        className={cn(
          "absolute opacity-0 transition-opacity duration-500",
          !isAnimating ? "opacity-100" : "opacity-0"
        )}
        onAnimationEnd={() => setIsAnimating(false)}
      >
        {currentWord}
      </span>
      <span
        className={cn(
          "opacity-0 transition-opacity duration-500",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
      >
        {currentWord}
      </span>
    </span>
  );
};
