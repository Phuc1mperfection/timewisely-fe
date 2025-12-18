import React, { useRef, memo, useCallback } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";

const storySteps = [
  {
    phase: "Awareness",
    title: "Recognize Your Patterns",
    description:
      "The first grain of sand falls. You begin to notice how time slips away unnoticed, how distractions fragment your focus, and how productivity feels elusive.",
    visual: "🔍",
    color: "from-red-400 to-orange-400",
  },
  {
    phase: "Understanding",
    title: "Embrace the Flow",
    description:
      "Sand continues to flow as understanding deepens. You learn that time isn't just about speed—it's about rhythm, intention, and the quality of each moment.",
    visual: "🌊",
    color: "from-orange-400 to-yellow-400",
  },
  {
    phase: "Practice",
    title: "Build Your Ritual",
    description:
      "The hourglass rotates. Through deliberate practice, you craft personalized focus sessions that align with your natural energy cycles and creative peaks.",
    visual: "🔄",
    color: "from-yellow-400 to-green-400",
  },
  {
    phase: "Flow",
    title: "Enter Deep Work",
    description:
      "Time becomes fluid. You slip effortlessly into flow states where hours feel like minutes, yet you accomplish more than ever before.",
    visual: "⚡",
    color: "from-green-400 to-cyan-400",
  },
  {
    phase: "Mastery",
    title: "Own Your Time",
    description:
      "The final transformation. You've become the master of your time, not its victim. Every moment is intentional, every hour productive, every day fulfilling.",
    visual: "👑",
    color: "from-cyan-400 to-orange-400",
  },
];

const StoryStep = memo(function StoryStep({
  step,
  index,
  scrollContainerRef,
}: {
  step: (typeof storySteps)[number];
  index: number;
  scrollContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLElement | null>(null);

  // ✅ inView theo scroll container (không theo window)
  const isInView = useInView(ref, {
    once: true,
    root: scrollContainerRef,
    margin: "-20%",
  });

  // ✅ scroll progress theo scroll container (không theo window)
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: ref,
    // ✅ cho step bắt đầu hiện sớm hơn để bạn không thấy “trống”
    offset: ["start 90%", "end 30%"],
  });

  // ✅ đảm bảo có “vùng nhìn thấy” (đừng để 0 quá lâu)
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.section ref={ref} style={{ y, opacity }} className="relative">
      <div className="flex items-start gap-8 lg:gap-16">
        {/* Timeline dot */}
        <div className="flex-shrink-0 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-2xl shadow-glow`}
          >
            {step.visual}
          </motion.div>

          {/* Connecting line */}
          {index < storySteps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1, delay: index * 0.12 + 0.2 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-32 bg-gradient-to-b from-current to-transparent opacity-30"
            />
          )}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.6, delay: index * 0.12 + 0.05 }}
          className="flex-1 space-y-4"
        >
          <div className="space-y-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${step.color} text-white`}
            >
              {step.phase}
            </span>
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
              {step.title}
            </h3>
          </div>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {step.description}
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
});

export const StorylineSection = memo(function StorylineSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
 const onWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el) return;

    const max = el.scrollHeight - el.clientHeight;
    const atTop = el.scrollTop <= 0;
    const atBottom = el.scrollTop >= max - 1;
    const delta = e.deltaY;

    const shouldScrollInner =
      (delta > 0 && !atBottom) || (delta < 0 && !atTop);

    if (shouldScrollInner) {
      // ✅ scroll nội bộ + mượt
      e.preventDefault();

      const next = Math.min(max, Math.max(0, el.scrollTop + delta));

      gsap.to(el, {
        scrollTop: next,
        duration: 0.25,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      // ✅ đã tới biên -> trả wheel về window để GSAP (horizontal) chạy tiếp
      window.scrollBy({ top: delta });
    }
  }, []);
  const headerInView = useInView(headerRef, {
    once: true,
    root: scrollRef,
    margin: "-10%",
  });

  return (
    <section className="w-full h-full bg-white dark:bg-[#000] relative">
      {/* ✅ scroll container DUY NHẤT */}
      <div ref={scrollRef} className="h-full w-full overflow-y-auto px-8" onWheel={onWheel}
      style={{
          overscrollBehavior: "contain", // tránh “giật bounce”
          scrollbarWidth: "none",        // Firefox hide
        }}
      >
        <div className="max-w-5xl w-full py-12 mx-auto">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Your Journey Through{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-pink-500 to-red-500">
                Time
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Like sand flowing through an hourglass, your transformation happens
              one grain at a time. Here's how you'll evolve from scattered to
              focused, from reactive to intentional.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-16 pb-24">
            {storySteps.map((step, index) => (
              <StoryStep
                key={index}
                step={step}
                index={index}
                scrollContainerRef={scrollRef}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

StorylineSection.displayName = "StorylineSection";
