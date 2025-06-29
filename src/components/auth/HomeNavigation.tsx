import React from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeNavigationProps {
  variant?: "home" | "back";
  className?: string;
}

const HomeNavigation: React.FC<HomeNavigationProps> = ({
  variant = "home",
  className = "",
}) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigation();
    }
  };

  const Icon = variant === "home" ? Home : ArrowLeft;
  const text = variant === "home" ? "Home" : "Back";
  const ariaLabel =
    variant === "home"
      ? "Return to TimeWisely homepage"
      : "Go back to previous page";

  return (
    <motion.button
      className={`
        group flex items-center space-x-2 px-4 py-2 rounded-xl
        glass-card border border-white/20 text-white/80 
        hover:text-white hover:bg-white/10 
        focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-opacity-50
        transition-all duration-300 backdrop-blur-sm
        ${className}
      `}
      onClick={handleNavigation}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel}
      role="button"
      tabIndex={0}
    >
      <Icon
        className="h-5 w-5 group-hover:scale-110 transition-transform duration-200"
        aria-hidden="true"
      />
      <span className="font-medium text-sm group-hover:translate-x-0.5 transition-transform duration-200">
        {text}
      </span>
    </motion.button>
  );
};

export default HomeNavigation;
