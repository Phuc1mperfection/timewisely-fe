import React from "react";
import { motion } from "framer-motion";

interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

const AuthToggle: React.FC<AuthToggleProps> = ({ isLogin, onToggle }) => (
  <motion.div
    className="text-center mt-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.7, duration: 0.5 }}
  >
    <p className="text-white/70">
      {isLogin ? "New to the journey? " : "Already mastering time? "}
      <button
        onClick={onToggle}
        className="text-mint-400 hover:text-mint-300 font-medium underline focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-opacity-50 rounded"
      >
        {isLogin ? "Begin your transformation" : "Welcome back"}
      </button>
    </p>
  </motion.div>
);

export default AuthToggle;
