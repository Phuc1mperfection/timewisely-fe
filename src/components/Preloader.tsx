import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesCore } from "./ui/sparkles";
import { ReactTyped } from "react-typed";
interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); 
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
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }} 
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }} 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black" 
        >
          {sparkles}
          <div className="text-center space-y-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-4"
            >
              <ReactTyped
                strings={["TimeWisely"]} 
                typeSpeed={60}            
                backSpeed={50}
                startDelay={500}          
                showCursor={false}         
                className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white tracking-wider font-logo"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};