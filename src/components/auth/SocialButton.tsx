import React from "react";
import { motion } from "framer-motion";

interface SocialButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  provider: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon: Icon,
  provider,
  onClick,
  disabled = false,
  className = "",
}) => {
  return (
    <motion.button
      className={`social-btn glass-input w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center space-x-2 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Icon className="h-5 w-5" />
      <span>Continue with {provider}</span>
    </motion.button>
  );
};

export default SocialButton;
