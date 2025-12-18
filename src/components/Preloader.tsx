import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesCore } from "./ui/sparkles";

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  const sparkles = useMemo(
    () => (
      <SparklesCore
        background="transparent"
        minSize={0.4}
        maxSize={1}
        particleDensity={10}
        className="absolute inset-0 z-0"
        particleColor="#ffffff"
      />
    ),
    []
  );

  return (
    <AnimatePresence>
      {isVisible && (
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
                rotateY: [0, 180, 180],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: 1,
                ease: "easeInOut",
              }}
              className="mx-auto w-32 h-32 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent via-[var(--primary-glow)] to-primary rounded-full animate-glow"></div>
              <div className="absolute inset-2 bg-orange-500/20 rounded-full rotate-45 flex items-center justify-center">
                <img
                  src="/src/assets/logos/icon.svg"
                  alt="Logo"
                  className="w-12 h-12 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5,
               }}
              className="space-y-4"
            >

              {/* <motion.p
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-orange-200/60 font-medium tracking-widest uppercase text-sm"
              >
                Loading Experience...
              </motion.p> */}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};