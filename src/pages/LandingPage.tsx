import { useState, useEffect, lazy, Suspense, useMemo, memo } from "react";
import { Calendar, Clock, Sparkles, Target, Users, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { Preloader } from "@/components/Preloader";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/landing/HeroSection";

const FeaturesSection = lazy(
  () => import("@/components/landing/FeaturesSection")
);
const ScrollAnimationSection = lazy(
  () => import("@/components/landing/ScrollAnimationSection")
);
const StorylineSection = lazy(() =>
  import("@/components/landing/StorylineSection").then((module) => ({
    default: module.StorylineSection,
  }))
);
const PersonalizationSection = lazy(
  () => import("@/components/landing/PersonalizeSection")
);
const FooterSection = lazy(() => import("@/components/layout/Footer"));

// Loading fallback component - memoized
const SectionLoader = memo(() => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
));

SectionLoader.displayName = "SectionLoader";

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      gsap.registerPlugin(ScrollTrigger);

      // Scroll-triggered section reveals with performance optimization
      const sections = gsap.utils.toArray<HTMLElement>(".section-reveal");
      const animations: gsap.core.Tween[] = [];

      sections.forEach((section) => {
        const animation = gsap.fromTo(
          section,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
              // Performance optimizations
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          }
        );
        animations.push(animation);
      });

      // Cleanup function
      return () => {
        animations.forEach((anim) => anim.kill());
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [isLoading]);

  // Memoize features array to prevent recreation on every render
  const features = useMemo(
    () => [
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
        description:
          "Set and achieve your personal and professional objectives",
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
    ],
    []
  );

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="">
      {/* Animated background elements */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Scroll Animation Section */}
      <Suspense fallback={<SectionLoader />}>
        <ScrollAnimationSection
          title="Time is your most valuable asset"
          subtitle="Our powerful tools help you make the most of every minute"
        />
      </Suspense>

      {/* Features Grid */}
      <Suspense fallback={<SectionLoader />}>
        <FeaturesSection features={features} />
      </Suspense>

      {/* Storyline Section */}
      <Suspense fallback={<SectionLoader />}>
        <StorylineSection />
      </Suspense>

      {/* Personalize Section */}
      <Suspense fallback={<SectionLoader />}>
        <PersonalizationSection />
      </Suspense>

      {/* Footer */}
      <Suspense fallback={<SectionLoader />}>
        <FooterSection />
      </Suspense>
    </div>
  );
};

export default LandingPage;
