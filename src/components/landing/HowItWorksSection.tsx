import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Calendar, CheckCircle, ArrowRight } from "lucide-react";

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
}

const HowItWorksSection: React.FC = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  const steps: Step[] = [
    {
      icon: Calendar,
      title: "Plan Your Day",
      description:
        "Add activities, tasks, and events to your personal timeline with our intuitive interface.",
    },
    {
      icon: Clock,
      title: "Optimize Your Time",
      description:
        "Our AI analyzes your schedule and suggests the most productive time slots for different activities.",
    },
    {
      icon: CheckCircle,
      title: "Stay Focused & Track Progress",
      description:
        "Use the Pomodoro technique to maintain focus and track your daily progress toward goals.",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold mb-4"
          >
            How TimeWisely Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Simple steps to transform how you manage your time and boost
            productivity
          </motion.p>
        </div>

        {/* Steps Container */}
        <div
          ref={containerRef}
          className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-10 -left-10 text-8xl font-bold text-slate-100 dark:text-slate-800 select-none z-0">
                  {index + 1}
                </div>

                {/* Step Content */}
                <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg relative z-10 h-full border border-slate-200 dark:border-slate-700">
                  <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Connection Arrow - Only for first 2 steps */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                    <ArrowRight className="text-primary" size={24} />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="text-center mt-16"
        >
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-full text-lg font-medium transition-all">
            Get Started Now
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
