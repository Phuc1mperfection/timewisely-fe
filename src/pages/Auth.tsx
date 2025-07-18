import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock } from 'lucide-react';
import AuthForm from "@/components/auth/AuthForm";
import AuthLogo from '@/components/auth/AuthLogo';
import HomeNavigation from '@/components/auth/HomeNavigation';



type AuthState = 'auth' | 'onboarding' | 'complete';

const AuthPage: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('auth');

  const handleAuthSuccess = () => {
    // Could redirect to dashboard or show success message
    console.log('Authentication successful!');
  };

  const handleLaunchOnboarding = () => {
    setAuthState('onboarding');
  };

  return (
    <div className="min-h-screen auth-gradient-bg relative overflow-hidden flex flex-col">
      {/* Background Elements */}
         <div className="absolute top-6 left-6 z-20">
        <HomeNavigation variant="home" />
      </div>
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="floating-particle absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-float-slow" />
        <div className="floating-particle absolute top-40 right-32 w-6 h-6 bg-mint-400/30 rounded-lg animate-float" />
        <div className="floating-particle absolute bottom-32 left-40 w-3 h-3 bg-pink-400/30 rounded-full animate-float" />
        <div className="floating-particle absolute bottom-20 right-20 w-5 h-5 bg-purple-400/30 rounded-full animate-float-slow" />
      </div>
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            className="flex items-center justify-center space-x-2 "
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <AuthLogo />
          </motion.div>
          {/* Auth State Content */}
          <AnimatePresence mode="wait">
            {authState === 'auth' && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <AuthForm
                  onSuccess={handleAuthSuccess}
                  onLaunchOnboarding={handleLaunchOnboarding}
                />
              </motion.div>
            )}
            {authState === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
              >
              
              </motion.div>
            )}
            {authState === 'complete' && (
              <motion.div
                key="complete"
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="glass-card p-8 rounded-2xl border border-white/20 shadow-xl bg-white/10 backdrop-blur-lg"
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-purple-500 to-mint-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                  >
                    <Clock className="h-8 w-8 text-white" />
                  </motion.div>
                  <motion.h2
                    className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    Welcome to Your Time Sanctuary
                  </motion.h2>
                  <motion.p
                    className="text-white/70 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Your personalized productivity workspace is ready. Let's begin mastering time together.
                  </motion.p>
                  <motion.div
                    className="w-full bg-white/10 rounded-full h-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-mint-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ delay: 0.7, duration: 1.5, ease: 'easeOut' }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          <div className="flex justify-center mt-6">
          </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
