import React from "react";
import { motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps {
  type: string;
  name: string;
  value: string;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  onChange: (value: string) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

const AuthInput: React.FC<AuthInputProps> = ({
  type,
  name,
  value,
  placeholder,
  icon,
  error,
  onChange,
  showPassword,
  onTogglePassword,
}) => (
  <div className="relative">
    {icon}
    <input
      type={type === "password" && showPassword ? "text" : type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`glass-input w-full pl-10 pr-${
        type === "password" ? "12" : "4"
      } py-3 rounded-xl text-white placeholder-white/50 focus:outline-none ${
        error ? "input-error" : ""
      }`}
      aria-label={name}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {type === "password" && onTogglePassword && (
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    )}
    {error && (
      <motion.p
        id={`${name}-error`}
        className="text-red-400 text-sm mt-1"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {error}
      </motion.p>
    )}
  </div>
);

export default AuthInput;
