import React from "react";
import { ArrowRight, Star, Users, Clock } from "lucide-react";
import { motion } from "motion/react";

interface SplitTextProps {
  text: string;
  className?: string;
}

const SplitText = ({ text, className = "" }: SplitTextProps) => (
  <span className={className}>
    {text.split("").map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: index * 0.03,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block"
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </span>
);

const CTASection: React.FC = () => {
  return (
    <section
      id="pricing"
      className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("/src/assets/patternpad-2025-07-17-15-33-01.svg")',
          }}
        />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Social proof */}
        <motion.div
          className="flex justify-center items-center space-x-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-500 mr-2" />
            <span className="text-gray-600">4.9/5 rating</span>
          </div>
          <div className="flex items-center">
            <Users className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-gray-600">50K+ users</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-indigo-600 mr-2" />
            <span className="text-gray-600">2M+ hours managed</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="reveal"
        >
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            <SplitText
              text="Ready to Transform"
              className="text-4xl lg:text-6xl font-bold"
            />
            <span className="gradient-text block">Your Productivity?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who have already discovered the
            power of intelligent time management with TimeWisely.
          </p>
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.button
              className="btn-primary px-10 py-5 rounded-full text-white font-semibold text-xl flex items-center group"
              whileTap={{ scale: 0.97 }}
            >
              Start Free Today
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <div className="flex items-center text-gray-500">
              <span className="mr-2">No credit card required</span>
              <div className="w-2 h-2 bg-green-500 rounded-full" />
            </div>
          </motion.div>
          {/* Feature highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Free Forever Plan
              </h3>
              <p className="text-gray-600 text-sm">Core features always free</p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Team Collaboration
              </h3>
              <p className="text-gray-600 text-sm">
                Share schedules & sync goals
              </p>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Premium Support
              </h3>
              <p className="text-gray-600 text-sm">
                24/7 help when you need it
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
