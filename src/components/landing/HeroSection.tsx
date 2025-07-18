import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import AnalogClock from "./AnalogClock";
import { FlipWords } from "@/components/ui/flip-words";
const HeroSection = () => {
  const navigate = useNavigate();
   const words = ["smarter", "faster", "better", "easier"];
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden  ">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-indigo-50" />
      {/* Floating background shapes */}
      <div className="floating-shape absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-purple-400/30 to-indigo-400/30 rounded-full blur-sm" />
      <div className="floating-shape absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-mint-400/30 to-teal-400/30 rounded-lg blur-sm" />
      <div className="floating-shape absolute bottom-40 left-20 w-12 h-12 bg-gradient-to-br from-pink-400/30 to-rose-400/30 rounded-full blur-sm" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center px-4 py-2 rounded-full border border-purple-200/50 mb-6"
            >
              <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-700">
                AI-Powered Time Management
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-gray-900"
            >
              Master Your
              <span className=" block mx-auto bg-gradient-to-r from-[var(--wisely-purple)] via-[var(--chart-2)] to-[var(--wisely-pink)] bg-clip-text text-transparent">
                Time, Wisely
              </span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-xl mb-6 min-w-xl  bg-gradient-to-r from-[var(--wisely-purple)] via-[var(--chart-2)] to-[var(--wisely-pink)] bg-clip-text text-transparent"
            >
            Achieve your goals with
          <span className="inline-block ">
            <FlipWords words={words} />
          </span>
          tools.
            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                size="lg"
                className=" px-8 py-4 rounded-full text-white font-semibold text-lg flex items-center justify-center group"
                onClick={() => navigate("/auth")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-full border-2 border-purple-300 text-purple-700 font-semibold text-lg hover:bg-purple-50 transition-colors"
              >
                Watch Demo
              </Button>
            </motion.div>
            <motion.div
              className="flex items-center justify-center lg:justify-start space-x-6 mt-8 text-sm text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Free to start
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                No credit card
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                AI-powered
              </div>
            </motion.div>
          </div>
          {/* Right column - Analog Clock */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          >
            <AnalogClock />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
