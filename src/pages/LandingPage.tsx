import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, Clock, Sparkles, Target, Users, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import AnimatedBackground from "@/components/landing/AnimatedBackground";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CTASection from "@/components/landing/CTASection";
import FooterSection from "@/components/layout/Footer";
import PersonalizationSection from "@/components/landing/PersonalizeSection";
const GlassCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
      className={` bg-white/10 border border-white/20 rounded-2xl shadow-xl ${className}`}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const features = [
    {
      icon: Calendar,
      title: "Smart Calendar",
      description:
        "Intuitive calendar interface with drag & drop functionality",
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description:
        "Get personalized activity recommendations based on your interests",
    },
    {
      icon: Clock,
      title: "Time Optimization",
      description:
        "Maximize your productivity with intelligent time slot analysis",
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and achieve your personal and professional objectives",
    },
    {
      icon: Users,
      title: "Social Integration",
      description: "Coordinate with friends and colleagues seamlessly",
    },
    {
      icon: Zap,
      title: "Quick Actions",
      description: "Create events and tasks with lightning-fast shortcuts",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--wisely-purple)]/30 via-[var(--wisely-white)] to-[var(--wisely-mint)]/40 relative overflow-hidden">
      {/* Animated background elements */}
      <Navbar />
      <AnimatedBackground mousePosition={mousePosition} />
      {/* Hero Section */}
      
      <HeroSection  />
      {/* Features Grid */}
      <FeaturesSection features={features} GlassCard={GlassCard} />
      {/* Personalize Section */}
      <PersonalizationSection />
      {/* CTA Section */}
      <CTASection  />
      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
