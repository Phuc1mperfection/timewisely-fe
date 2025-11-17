/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, useInView } from "motion/react";
import { useRef, useMemo, memo } from "react";

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

const FeaturesSection = memo(({ features }: { features: any[] }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const intelligentPlanningRef = useRef(null);
  const intelligentPlanningInView = useInView(intelligentPlanningRef, {
    once: true,
    amount: 0.1,
  });

  // Memoize header animation variants
  const headerAnimationVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 20 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
      transition: { duration: 0.5, delay: 0.2 },
    }),
    [isInView]
  );

  // Memoize intelligent planning animation variants
  const intelligentPlanningVariants = useMemo(
    () => ({
      initial: { opacity: 0, y: 40 },
      animate: intelligentPlanningInView
        ? { opacity: 1, y: 0 }
        : { opacity: 0, y: 40 },
      transition: { duration: 0.7, delay: 0.2 },
    }),
    [intelligentPlanningInView]
  );

  // Memoize feature list items animations
  const featureListItems = useMemo(
    () => [
      {
        text: "Automatic task prioritization",
        color: "bg-yellow-500",
        delay: 0.5,
      },
      { text: "Energy-based scheduling", color: "bg-orange-600", delay: 0.6 },
      { text: "Smart break recommendations", color: "bg-teal-500", delay: 0.7 },
    ],
    []
  );

  // Memoize schedule items animations
  const scheduleItems = useMemo(
    () => [
      {
        title: "Deep Work Session",
        time: "25 min",
        bgClass: "bg-gradient-to-r from-yellow-500/10 to-orange-600/10",
        textClass: "text-yellow-600",
        delay: 0.7,
      },
      {
        title: "Creative Break",
        time: "5 min",
        bgClass: "bg-gradient-to-r from-teal-500/10 to-cyan-500/10",
        textClass: "text-teal-600",
        delay: 0.8,
      },
      {
        title: "Team Meeting",
        time: "30 min",
        bgClass: "bg-gradient-to-r from-amber-400/10 to-rose-500/10",
        textClass: "yellow-600",
        delay: 0.9,
      },
    ],
    []
  );

  // Memoize rendered feature cards
  const renderedFeatureCards = useMemo(
    () =>
      features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} index={index} />
      )),
    [features]
  );

  // Memoize rendered list items
  const renderedListItems = useMemo(
    () =>
      featureListItems.map((item, index) => (
        <motion.li
          key={index}
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={
            intelligentPlanningInView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: -20 }
          }
          transition={{ delay: item.delay }}
        >
          <div className={`w-2 h-2 ${item.color} rounded-full mr-4`} />
          <span className="text-gray-700">{item.text}</span>
        </motion.li>
      )),
    [featureListItems, intelligentPlanningInView]
  );

  // Memoize rendered schedule items
  const renderedScheduleItems = useMemo(
    () =>
      scheduleItems.map((item, index) => (
        <motion.div
          key={index}
          className={`flex items-center justify-between p-3 ${item.bgClass} rounded-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={
            intelligentPlanningInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ delay: item.delay }}
        >
          <span className={`font-medium ${item.textClass}`}>{item.title}</span>
          <span className={`text-sm ${item.textClass} font-medium`}>
            {item.time}
          </span>
        </motion.div>
      )),
    [scheduleItems, intelligentPlanningInView]
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      className="mx-auto px-6 py-16 relative z-10 bg-white dark:bg-[#000]"
    >
      <motion.div
        className="text-center mb-12"
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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderedFeatureCards}
      </div>

      <motion.div
        ref={intelligentPlanningRef}
        className="mt-20 reveal"
        initial={intelligentPlanningVariants.initial}
        animate={intelligentPlanningVariants.animate}
        transition={intelligentPlanningVariants.transition}
      >
        <div className=" p-8 lg:p-12 rounded-3xl border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={
                intelligentPlanningInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -40 }
              }
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h3 className="text-3xl font-bold mb-6 text-[var(--wisely-dark)]">
                Experience the Power of
                <span className="text-[var(--wisely-gold)]">
                  {" "}
                  Intelligent Planning
                </span>
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                Our AI analyzes your work patterns, energy levels, and
                preferences to create personalized schedules that maximize your
                productivity while maintaining work-life balance.
              </p>
              <ul className="space-y-4">{renderedListItems}</ul>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              animate={
                intelligentPlanningInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: 40 }
              }
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className=" p-6 rounded-2xl border border-white/20">
                <div className="space-y-4">{renderedScheduleItems}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
});

FeaturesSection.displayName = "FeaturesSection";

export default FeaturesSection;
