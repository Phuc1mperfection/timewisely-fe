/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useInView } from "motion/react";
import { useRef, useMemo, memo } from "react";
import { Calendar, Clock, Sparkles, Target, Users, Zap } from "lucide-react";

const FeatureCard = memo(
  ({ feature, index }: { feature: any; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    // Memoize animation variants
    const animationVariants = useMemo(
      () => ({
        initial: { opacity: 0, y: 50 },
        animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
        transition: { duration: 0.6, delay: index * 0.1 },
      }),
      [isInView, index]
    );

    const hoverVariants = useMemo(
      () => ({
        scale: 1.05,
      }),
      []
    );

    return (
      <motion.div
        ref={ref}
        initial={animationVariants.initial}
        animate={animationVariants.animate}
        transition={animationVariants.transition}
        className="bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 hover:bg-[var(--wisely-sand)]/20 transition-all duration-300"
      >
        <motion.div
          className="flex items-center mb-6"
          whileHover={hoverVariants}
        >
          <div className="p-3 bg-gradient-to-r from-[var(--wisely-gold)] to-[var(--wisely-champagne)] rounded-xl mr-4 ">
            <feature.icon className="w-6 h-6 text-[var(--wisely-white)]" />
          </div>
          <h3 className="text-xl font-semibold ">{feature.title}</h3>
        </motion.div>
        <p className="leading-relaxed">{feature.description}</p>
      </motion.div>
    );
  }
);

FeatureCard.displayName = "FeatureCard";

const FeaturesSection = memo(() => {
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
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  // Memoize header animation variants
  const headerAnimationVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      transition: { duration: 0.5, delay: 0.2 },
    }),
    [isInView]
  );

  // Memoize rendered feature cards
  const renderedFeatureCards = useMemo(
    () =>
      features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} index={index} />
      )),
    [features]
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      className="w-full h-full flex items-center justify-center px-8 relative z-10 bg-white dark:bg-[#000]"
    >
      <div className="max-w-6xl w-full">
        <motion.div
          className="text-center mb-8"
          initial={headerAnimationVariants.initial}
          animate={headerAnimationVariants.animate}
          transition={headerAnimationVariants.transition}
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything you need to manage time wisely
          </h2>
          <p className="text-[var(--wisely-gray)] max-w-2xl mx-auto text-lg">
            From smart scheduling to AI-powered suggestions, TimeWisely has all
            the tools you need to optimize your daily routine.
          </p>
        </motion.div>
        <div className="grid grid-cols-3 gap-6">{renderedFeatureCards}</div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
