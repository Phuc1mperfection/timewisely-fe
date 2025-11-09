import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";
import AnalogClock from "./AnalogClock";
import { FlipWords } from "@/components/ui/flip-words";
import DarkVeil from "../ui/DarkVeil";

const HeroSection = () => {
  const navigate = useNavigate();
  const words = ["smarter", "faster", "better", "easier"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        {/* Light mode gradient */}
        <div className="bg-gradient-to-b from-amber-50 via-orange-100 to-white animate-gradient dark:hidden w-full h-full" />

        {/* Dark mode background */}
        <DarkVeil
          hueShift={204}
          noiseIntensity={0}
          scanlineIntensity={0.1}
          scanlineFrequency={40.0}
          warpAmount={2.02}
          speed={0.5}
        />

        {/* Floating blobs */}

        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-amber-300/20 blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6 bg-gradient-to-l from-[var(--wisely-gold)] via-[var(--wisely-yellow)] to-[var(--wisely-sand)] bg-clip-text text-transparent"
            >
              Master Your
              <span className="block mx-auto bg-gradient-to-r from-[var(--wisely-gold)] via-[var(--chart-2)] to-[var(--wisely-sand)] bg-clip-text text-transparent">
                Time, Wisely
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-xl mx-auto lg:mx-0"
            >
              Plan smarter. Stay focused. Achieve more — with AI-powered time
              management.
            </motion.p>

            {/* Tagline with flip words */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-xl mb-6 bg-gradient-to-r from-[var(--wisely-gold)] via-[var(--chart-2)] to-[var(--wisely-sand)] bg-clip-text text-transparent"
            >
              Achieve your goals with <FlipWords words={words} /> tools.
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Button
                size="lg"
                className="px-8 py-4 rounded-full text-white font-semibold text-lg flex items-center justify-center group shadow-lg shadow-yellow-400/40 hover:shadow-yellow-500/50 transition-all"
                onClick={() => navigate("/auth")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 rounded-full border-2 border-yellow-300 yellow-700 dark:yellow-200 font-semibold text-lg hover:bg-yellow-50 dark:hover:bg-yellow-800/20 transition-colors flex items-center gap-2"
              >
                <PlayCircle className="h-5 w-5" /> Watch Demo
              </Button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-4 mt-8 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                Free to start
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                No credit card
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                AI-powered
              </div>
            </motion.div>
          </div>

          {/* Right column - Analog Clock */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          >
            <div className="relative">
              <AnalogClock />
              <div className="absolute inset-0 rounded-full blur-3xl bg-orange-500/30 -z-10 w-40 mt-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
