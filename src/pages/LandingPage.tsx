import { useState, useEffect } from "react";
import { Calendar, Clock, Sparkles, Target, Users, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
// import CTASection from "@/components/landing/CTASection";
import { Preloader } from "@/components/Preloader";
import FooterSection from "@/components/layout/Footer";
import PersonalizationSection from "@/components/landing/PersonalizeSection";
import ScrollAnimationSection from "@/components/landing/ScrollAnimationSection";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { StorylineSection } from "@/components/landing/StorylineSection";


const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      gsap.registerPlugin(ScrollTrigger);

      // Scroll-triggered section reveals
      gsap.utils.toArray(".section-reveal").forEach((section: any) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

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
    <div className="">
      {/* Animated background elements */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Scroll Animation Section */}
      <ScrollAnimationSection
        title="Time is your most valuable asset"
        subtitle="Our powerful tools help you make the most of every minute"
      />
      {/* Features Grid */}
      <FeaturesSection features={features} />

      {/* How It Works Section */}

      {/* Storyline Section */}
      <StorylineSection />
      {/* Personalize Section */}
      <PersonalizationSection />

      {/* CTA Section */}
      {/* <CTASection /> */}

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default LandingPage;
