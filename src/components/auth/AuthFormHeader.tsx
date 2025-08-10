import React from "react";
import { motion } from "motion/react"; 

interface AuthFormHeaderProps {
  isLogin: boolean;
}

const AuthFormHeader: React.FC<AuthFormHeaderProps> = ({ isLogin }) => (
  <div className="text-center mb-8">
    <motion.h1
      className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {isLogin ? "Welcome Back, Time Master" : "Begin Your Journey to Mastery"}
    </motion.h1>
    <motion.p
      className="text-white/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {isLogin
        ? "Ready to reclaim your most precious resource?"
        : "Transform how you experience time, starting today"}
    </motion.p>
  </div>
);

export default AuthFormHeader;
