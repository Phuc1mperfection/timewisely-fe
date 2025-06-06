import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const AnimatedInput = ({ ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      whileFocus={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Input
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`backdrop-blur-md bg-white/10 border-white/30 focus:border-[var(--wisely-purple)] focus:ring-[var(--wisely-purple)]/20 focus:bg-white/20 transition-all duration-300 ${
          props.className || ""
        }`}
      />
      <motion.div
        className="absolute inset-0 rounded-md border-2 border-[var(--wisely-purple)] pointer-events-none"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: isFocused ? 0.3 : 0, scale: isFocused ? 1.02 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default AnimatedInput;
