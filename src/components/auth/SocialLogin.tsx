import React from "react";
import { Mail, Github } from "lucide-react";
import { motion } from "motion/react";
import SocialButton from "./SocialButton";

interface SocialLoginProps {
  isLoading: boolean;
  onSocial: (provider: string) => void;
}

const SocialLogin: React.FC<SocialLoginProps> = ({ isLoading, onSocial }) => (
  <motion.div
    className="space-y-3 mb-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.5 }}
  >
    <SocialButton
      icon={Mail}
      provider="Google"
      onClick={() => onSocial("Google")}
      disabled={isLoading}
    />
    <SocialButton
      icon={Github}
      provider="GitHub"
      onClick={() => onSocial("GitHub")}
      disabled={isLoading}
    />
  </motion.div>
);

export default SocialLogin;
