import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesCore } from "./ui/sparkles";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 500);
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Memoize SparklesCore to prevent re-rendering on progress updates
  const sparkles = useMemo(
    () => (
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={50}
        className="absolute inset-0 z-0"
        particleColor="#ffffff"
      />
    ),
    [] // Empty dependency array to render only once
  );

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-hero dark:bg-hero"
        >
          {sparkles}
          <div className="text-center space-y-8 relative z-10">
            {/* Animated circular icon */}
            <motion.div
              animate={{
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mx-auto w-32 h-32 relative"
            >
              {/* Glow border - Circle */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent via-[var(--primary-glow)] to-primary rounded-full animate-glow"></div>

              {/* Inner background - Circle */}
              <div className="absolute inset-2 bg-orange-500/30 rounded-full rotate-45 flex items-center justify-center">
                <img
                  src="/src/assets/icon.svg"
                  alt="Logo"
                  className="w-12 h-12 transition-transform duration-200"
                />
              </div>
            </motion.div>

            {/* Loading text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
                Time.Wisely
              </h1>

              {/* Progress bar */}
              <div className="w-64 h-2 bg-orange-800/20 rounded-full overflow-hidden mx-auto">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-[var(--primary-glow)] rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>

              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-orange-800/80"
              >
                {Math.round(progress)}%
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
