import {
  useState,
  useEffect,
  lazy,
  Suspense,
  useMemo,
  memo,
  useRef,
} from "react";
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
// const StorylineSection = lazy(() =>
//   import("@/components/landing/StorylineSection").then((module) => ({
//     default: module.StorylineSection,
//   }))
// );
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
  const [showNavbar, setShowNavbar] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  const [scrollTween, setScrollTween] = useState<gsap.core.Tween | null>(null);
  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const sectionsContainer = sectionsRef.current;
    if (!container || !sectionsContainer) return;

    const getScrollAmount = () => {
      const sectionsWidth = sectionsContainer.scrollWidth;
      return -(sectionsWidth - window.innerWidth);
    };

    const tween = gsap.to(sectionsContainer, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () => `+=${sectionsContainer.scrollWidth - window.innerWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    setScrollTween(tween);

    // Track Hero section visibility for navbar
    const heroSection = heroSectionRef.current;
    if (heroSection) {
      ScrollTrigger.create({
        trigger: heroSection,
        start: "left center",
        end: "right center",
        containerAnimation: tween,
        onEnter: () => setShowNavbar(true),
        onLeave: () => setShowNavbar(false),
        onEnterBack: () => setShowNavbar(true),
        onLeaveBack: () => setShowNavbar(false),
      });
    }

    // rất quan trọng khi dùng lazy/Suspense
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      setScrollTween(null);
    };
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
    <div className="overflow-hidden">
      <div
        style={{
          opacity: showNavbar ? 1 : 0,
          pointerEvents: showNavbar ? "auto" : "none",
          transition: "opacity transition-all duration-300 ease-in-out 0.5 ",
        }}
      >
        <Navbar />
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="relative h-screen overflow-hidden">
        <div
          ref={sectionsRef}
          className="flex h-screen"
          style={{ width: "fit-content" }}
        >
          {/* Hero Section */}
          <div
            ref={heroSectionRef}
            className="horizontal-section flex-shrink-0 w-screen h-screen"
          >
            <HeroSection />
          </div>

          {/* Scroll Animation Section */}
          <div className="horizontal-section flex-shrink-0 w-screen h-screen flex items-center justify-center">
            <Suspense fallback={<SectionLoader />}>
              <ScrollAnimationSection
                title="Time is your most valuable asset"
                containerAnimation={scrollTween}
              />
            </Suspense>
          </div>

          {/* Features Section */}
          <div className="horizontal-section flex-shrink-0 w-screen h-screen flex items-center justify-center overflow-y-auto">
            <Suspense fallback={<SectionLoader />}>
              <FeaturesSection features={features} />
            </Suspense>
          </div>

          {/* <div className="horizontal-section flex-shrink-0 w-screen h-screen">
  <Suspense fallback={<SectionLoader />}>
    <StorylineSection />
  </Suspense>
</div> */}

          {/* Personalize Section */}
          <div className="horizontal-section flex-shrink-0 w-screen h-screen flex items-center justify-center">
            <Suspense fallback={<SectionLoader />}>
              <PersonalizationSection />
            </Suspense>
          </div>

          {/* Footer */}
          <div className="horizontal-section flex-shrink-0 w-screen h-screen flex items-center justify-center">
            <Suspense fallback={<SectionLoader />}>
              <FooterSection />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
