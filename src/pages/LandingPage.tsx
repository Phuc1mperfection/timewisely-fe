import {
  useState,
  useEffect,
  lazy,
  Suspense,
  memo,
  useRef,
} from "react";
// feature icons moved into FeaturesSection
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

    const SCROLL_STRETCH = 1.8; // tăng => đi ngang lâu hơn

    const tween = gsap.to(sectionsContainer, {
      x: getScrollAmount,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: () =>
          `+=${Math.max(
            0,
            (sectionsContainer.scrollWidth - window.innerWidth) * SCROLL_STRETCH
          )}`,
        scrub: 0.6, // nhỏ hơn 1 => cảm giác “nhanh/nhạy” hơn
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    setScrollTween(tween);

    const WHEEL_TURNS = 28; // tăng số này => bánh xe xoay nhanh hơn

    // "Bánh xe" xoay theo đúng progress của horizontal tween (ổn định nhất)
    const wheelEl = document.querySelector(
      ".js-analog-wheel"
    ) as HTMLElement | null;

    let wheelTick: (() => void) | null = null;

    if (wheelEl && tween.scrollTrigger) {
      gsap.set(wheelEl, { transformOrigin: "50% 50%" });

      const setRot = gsap.quickSetter(wheelEl, "rotation", "deg");

      wheelTick = () => {
        const st = tween.scrollTrigger!;
        setRot(st.progress * 360 * WHEEL_TURNS);
      };

      wheelTick(); // set ngay frame đầu
      gsap.ticker.add(wheelTick);
    }

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
      if (wheelTick) gsap.ticker.remove(wheelTick);
      ScrollTrigger.getAll().forEach((t) => t.kill());
      setScrollTween(null);
    };
  }, [isLoading]);

  if (isLoading) {
    return <Preloader onComplete={handlePreloaderComplete} />;
  }

  return (
    <div className="overflow-hidden">
      <div
        style={{
          opacity: showNavbar ? 1 : 0,
          pointerEvents: showNavbar ? "auto" : "none",
          transition: "opacity 300ms ease-in-out",
        }}
      >
        <Navbar />
      </div>

      {/* Horizontal Scroll Container (only first two sections) */}
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
            <HeroSection containerAnimation={scrollTween} />
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
        </div>
      </div>

      {/* From here on, layout switches back to normal vertical flow */}
      <div className="w-full bg-background">
        <div className="min-h-screen flex items-center justify-center  py-12">
          <Suspense fallback={<SectionLoader />}>
            <FeaturesSection />
          </Suspense>
        </div>

        <div className="min-h-screen flex py-12  ">
          <div className="min-h-screen p-0">
            <Suspense fallback={<SectionLoader />}>
              <PersonalizationSection />
            </Suspense>
          </div>
        </div>

        <div className="min-h-screen flex  py-12">
          <Suspense fallback={<SectionLoader />}>
            <FooterSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
