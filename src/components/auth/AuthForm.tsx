import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/useAuth";
import { useToast } from "@/hooks/useToast";
import AnimatedInput from "./AnimatedInput";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password);
        success("Welcome back! You've successfully signed in to TimeWisely.");
        navigate("/app", { replace: true });
      } else {
        await register(email, name, password);
        success("Account created! Welcome to TimeWisely, let's get started.");
        navigate("/app", { replace: true });
      }
    } catch (err) {
      console.error(err);
      error(
        isLogin
          ? "Failed to sign in. Please check your credentials."
          : "Failed to create account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardHeader className="text-center pb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CardTitle className="text-[var(--wisely-dark)] text-2xl">
            {isLogin ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-[var(--wisely-gray)] mt-2">
            {isLogin
              ? "Sign in to your TimeWisely account"
              : "Join TimeWisely and start managing your time better"}
          </CardDescription>
        </motion.div>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "register"}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label htmlFor="name" className="text-[var(--wisely-dark)]">
                  Full Name
                </Label>
                <AnimatedInput
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  required
                />
              </motion.div>
            )}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Label htmlFor="email" className="text-[var(--wisely-dark)]">
                Email
              </Label>
              <AnimatedInput
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                required
              />
            </motion.div>
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Label htmlFor="password" className="text-[var(--wisely-dark)]">
                Password
              </Label>
              <AnimatedInput
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                required
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-[var(--wisely-purple)] hover:bg-purple-600 text-white backdrop-blur-md shadow-lg transition-all duration-300"
                disabled={isSubmitting}
              >
                <motion.span
                  animate={
                    isSubmitting ? { opacity: [1, 0.5, 1] } : { opacity: 1 }
                  }
                  transition={{
                    duration: 1,
                    repeat: isSubmitting ? Infinity : 0,
                  }}
                >
                  {isSubmitting
                    ? isLogin
                      ? "Signing In..."
                      : "Creating Account..."
                    : isLogin
                    ? "Sign In"
                    : "Create Account"}
                </motion.span>
              </Button>
            </motion.div>
          </motion.form>
        </AnimatePresence>
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-[var(--wisely-gray)] pb-2">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <motion.button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-[var(--wisely-purple)] hover:underline font-medium transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </motion.button>
          </p>
        </motion.div>
      </CardContent>
    </>
  );
};

export default AuthForm;
