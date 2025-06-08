import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthBackground from "@/components/auth/AuthBackground";
import AuthLogo from "@/components/auth/AuthLogo";
import AuthForm from "@/components/auth/AuthForm";
import GlassContainer from "../components/auth/GlassContainer";
import { useAuth } from "../contexts/useAuth";
import { Skeleton } from "@/components/ui/skeleton";

const Auth = () => {
  const {  loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--wisely-purple)]/20 via-[var(--wisely-white)]/90 to-[var(--wisely-pink)]/80">
        <div className="flex flex-col items-center gap-6 w-full max-w-md">
          <div className="flex flex-col items-center gap-4 w-full">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-8 w-40 rounded-lg" />
          </div>
          <div className="w-full flex flex-col gap-4 mt-6">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--wisely-purple)]/20 via-[var(--wisely-white)]/90 to-[var(--wisely-pink)]/80 flex items-center justify-center p-6 relative overflow-hidden">
      <AuthBackground />
      <div className={`w-full max-w-md relative z-10`}>
        <AuthLogo />
        <GlassContainer className={`overflow-hidden`}>
          <AuthForm />
        </GlassContainer>
        <motion.div
          className={`mt-6 text-center`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-2xl text-[var(--wisely-gray)] hover:text-[var(--wisely-dark)] backdrop-blur-md hover:bg-white/10 transition-all duration-300"
            >
              ← Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
