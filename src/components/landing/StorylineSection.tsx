import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';

const storySteps = [
  {
    phase: "Awareness",
    title: "Recognize Your Patterns",
    description: "The first grain of sand falls. You begin to notice how time slips away unnoticed, how distractions fragment your focus, and how productivity feels elusive.",
    visual: "🔍",
    color: "from-red-400 to-orange-400"
  },
  {
    phase: "Understanding", 
    title: "Embrace the Flow",
    description: "Sand continues to flow as understanding deepens. You learn that time isn't just about speed—it's about rhythm, intention, and the quality of each moment.",
    visual: "🌊", 
    color: "from-orange-400 to-yellow-400"
  },
  {
    phase: "Practice",
    title: "Build Your Ritual",
    description: "The hourglass rotates. Through deliberate practice, you craft personalized focus sessions that align with your natural energy cycles and creative peaks.",
    visual: "🔄",
    color: "from-yellow-400 to-green-400"
  },
  {
    phase: "Flow",
    title: "Enter Deep Work",
    description: "Time becomes fluid. You slip effortlessly into flow states where hours feel like minutes, yet you accomplish more than ever before.",
    visual: "⚡",
    color: "from-green-400 to-cyan-400"
  },
  {
    phase: "Mastery",
    title: "Own Your Time",
    description: "The final transformation. You've become the master of your time, not its victim. Every moment is intentional, every hour productive, every day fulfilling.",
    visual: "👑",
    color: "from-cyan-400 to-blue-400"
  }
];

const StoryStep = ({ step, index }: { step: typeof storySteps[0], index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <motion.section
      ref={ref}
      style={{ y, opacity }}
      className="relative"
    >
      <div className="flex items-center gap-8 lg:gap-16">
        {/* Timeline dot */}
        <div className="flex-shrink-0 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-2xl shadow-glow`}
          >
            {step.visual}
          </motion.div>
          
          {/* Connecting line */}
          {index < storySteps.length - 1 && (
            <motion.div
              initial={{ height: 0 }}
              animate={isInView ? { height: "100%" } : { height: 0 }}
              transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
              className="absolute top-16 left-1/2 w-0.5 h-32 bg-gradient-to-b from-current to-transparent opacity-30"
            />
          )}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: index * 0.2 + 0.1 }}
          className="flex-1 space-y-4"
        >
          <div className="space-y-2">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${step.color} text-white`}>
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
};

export const StorylineSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <section className="py-24 lg:py-32 bg-white dark:bg-[#000] relative overflow-hidden">
      {/* Background pattern */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Your Journey Through
            <span className="bg-gradient-to-r from-[var(--primary-glow)] to-[var(--secondary-glow)] bg-clip-text text-transparent">Time</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Like sand flowing through an hourglass, your transformation happens one grain at a time. 
            Here's how you'll evolve from scattered to focused, from reactive to intentional.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-24">
          {storySteps.map((step, index) => (
            <StoryStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
