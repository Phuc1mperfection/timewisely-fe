import React from "react";
import { motion } from "motion/react";

const ScrollAnimationSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-20 px-4"
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-wisely-dark dark:text-white">
          Scroll Triggered Animation
        </h2>
        <p className="text-lg text-wisely-gray dark:text-gray-300 mb-8">
          This section appears with smooth animations when you scroll to it.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4">Feature {item}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Description of feature {item} with animated entrance.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ScrollAnimationSection;
