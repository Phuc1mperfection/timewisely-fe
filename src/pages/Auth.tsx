import React, { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import AuthLogo from "@/components/auth/AuthLogo";
import HomeNavigation from "@/components/auth/HomeNavigation";
import { useToast } from "@/hooks/useToast";
import { SparklesCore } from "@/components/ui/sparkles";

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const oauthError = params.get("error");

    if (oauthError) {
      console.error("OAuth error from URL:", oauthError);
      const errorMessage = decodeURIComponent(oauthError).split(";")[0];
      error(`Login failed: ${errorMessage || "Authentication error"}`);

      navigate("/auth", { replace: true });
    }

    const locationState = location.state as { oauthError?: string } | null;
    if (locationState?.oauthError) {
      error(locationState.oauthError);

      navigate("/auth", { replace: true, state: {} });
    }
  }, [location, navigate, error]);
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
    
    <div className="min-h-screen auth-gradient-bg relative overflow-hidden flex flex-col">
          {sparkles}

      <div className="absolute top-6 left-6 z-20">
        <HomeNavigation variant="home" />
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            className="flex items-center justify-center space-x-2 "
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AuthLogo />
          </motion.div>
          <motion.div
            key="auth"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AuthForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
