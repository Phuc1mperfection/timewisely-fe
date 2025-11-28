import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/useToast";
import SocialLogin from "./SocialLogin";
import AuthInput from "./AuthInput";
import AuthFormHeader from "./AuthFormHeader";
import AuthToggle from "./AuthToggle";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "./LoadingSkeleton";

interface AuthFormProps {
  onSuccess: () => void;
  onLaunchOnboarding: () => void;
}

const AuthForm: React.FC<AuthFormProps> = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, register, loginWithGoogle } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!isLogin && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        success("Welcome back! You've successfully signed in to TimeWisely.");
        navigate("/dashboard", { replace: true });
      } else {
        await register(formData.email, formData.name, formData.password);
        success("Account created! Welcome to TimeWisely, let's get started.");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      error(
        isLogin
          ? "Failed to sign in. Please check your credentials."
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    try {
      if (provider === "google") {
        loginWithGoogle();
        // The redirect will happen automatically from the loginWithGoogle function
      }
    } catch (err) {
      console.error(err);
      error("Failed to initialize social login. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoading) {
    return <LoadingSkeleton type="form" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white/10 glass rounded-2xl p-8 "
    >
      <AuthFormHeader isLogin={isLogin} />
      <SocialLogin isLoading={isLoading} onSocial={handleSocialLogin} />
      {/* Divider */}
      <motion.div
        className="relative mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/60">
            or continue with email
          </span>
        </div>
      </motion.div>
      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AuthInput
                type="text"
                name="name"
                value={formData.name}
                placeholder="Your name"
                icon={
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                }
                error={errors.name}
                onChange={(v) => handleInputChange("name", v)}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AuthInput
          type="email"
          name="email"
          value={formData.email}
          placeholder="your@email.com"
          icon={
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          }
          error={errors.email}
          onChange={(v) => handleInputChange("email", v)}
        />
        <AuthInput
          type="password"
          name="password"
          value={formData.password}
          placeholder="Your secure password"
          icon={
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          }
          error={errors.password}
          onChange={(v) => handleInputChange("password", v)}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((s) => !s)}
        />
        <motion.button
          type="submit"
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-mint-400 text-white font-semibold hover:from-yellow-600 hover:to-mint-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:ring-opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
        >
          {isLogin ? "Enter Your Time Sanctuary" : "Start Your Transformation"}
        </motion.button>
      </motion.form>
      <AuthToggle isLogin={isLogin} onToggle={() => setIsLogin((l) => !l)} />
    </motion.div>
  );
};

export default AuthForm;
