import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import AnalogClock from "./AnalogClock";
import { FlipWords } from "@/components/ui/flip-words";
import DarkVeil from "../ui/DarkVeil";
import { useTheme } from "@/hooks/useTheme";

// ✅ GSAP
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
type HeroSectionProps = {
  containerAnimation?: gsap.core.Tween | null;
}
gsap.registerPlugin(ScrollTrigger);

const HeroSection = memo(({ containerAnimation }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const words = ["smarter", "faster", "better", "easier"];

  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const clockWrapRef = useRef<HTMLDivElement>(null);

  const gradientRef = useRef<HTMLDivElement>(null);
  const [isGradientLoaded, setIsGradientLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsGradientLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!gradientRef.current) return;
      const { clientWidth, clientHeight } = gradientRef.current;
      const mouseX = (event.clientX / clientWidth) * 100;
      const mouseY = (event.clientY / clientHeight) * 100;
      gradientRef.current.style.setProperty("--mouseX", `${mouseX}%`);
      gradientRef.current.style.setProperty("--mouseY", `${mouseY}%`);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Pin + slide left/right khi scroll
useLayoutEffect(() => {
  if (!sectionRef.current) return;

  const ctx = gsap.context(() => {
    const isHorizontal = !!containerAnimation;

    const tl = gsap.timeline({
      scrollTrigger: isHorizontal
        ? {
            trigger: sectionRef.current,
            containerAnimation: containerAnimation!,
            start: "left left",
            end: "right left",
            scrub: 0.6,
          }
        : {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=220%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
    });

    tl.to(leftColRef.current, { x: -140, ease: "none" }, 0)
      .to(rightColRef.current, { x: 140, ease: "none" }, 0)
      .to(clockWrapRef.current, { rotate: 220, ease: "none" }, 0) 
      .to(gradientRef.current, { scale: 1.08, ease: "none" }, 0);
  }, sectionRef);

  return () => ctx.revert();
}, [containerAnimation]);


  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className={`absolute inset-0 -z-10 transition-opacity duration-700 ${
          isGradientLoaded ? "opacity-100" : "opacity-0"
        }`}
        ref={gradientRef}
      >
        <div className="bg-hero-light dark:hidden w-full h-full absolute inset-0" />
        {theme === "dark" && (
          <DarkVeil
            hueShift={204}
            noiseIntensity={0}
            scanlineIntensity={0.1}
            scanlineFrequency={40.0}
            warpAmount={2.02}
            speed={0.5}
          />
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div ref={leftColRef} className="text-center lg:text-left">
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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-4 max-w-xl mx-auto lg:mx-0"
            >
              Plan smarter. Stay focused. Achieve more — with AI-powered time
              management.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-xl mb-6 bg-gradient-to-r from-[var(--wisely-gold)] via-[var(--chart-2)] to-[var(--wisely-sand)] bg-clip-text text-transparent"
            >
              Achieve your goals with <FlipWords words={words} /> tools.
            </motion.div>

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

            </motion.div>
          </div>

          {/* Right column */}
          <motion.div
            ref={rightColRef}
            className="flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          >
            <div ref={clockWrapRef} className="relative will-change-transform">
              <AnalogClock />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;
