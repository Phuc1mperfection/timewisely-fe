import React from "react";
import { motion } from "motion/react"; // Ensure you have motion/react installed

interface LoadingSkeletonProps {
  type: "form" | "button" | "social";
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type }) => {
  if (type === "form") {
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title skeleton */}
        <div className="skeleton h-8 w-3/4 rounded-lg mx-auto" />
        <div className="skeleton h-4 w-1/2 rounded mx-auto" />

        {/* Input skeletons */}
        <div className="space-y-4">
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>

        {/* Button skeleton */}
        <div className="skeleton h-12 w-full rounded-xl" />

        {/* Social buttons skeleton */}
        <div className="flex space-x-4">
          <div className="skeleton h-12 flex-1 rounded-xl" />
          <div className="skeleton h-12 flex-1 rounded-xl" />
        </div>
      </motion.div>
    );
  }

  if (type === "button") {
    return (
      <motion.div
        className="skeleton h-12 w-full rounded-xl"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    );
  }

  if (type === "social") {
    return (
      <div className="flex space-x-4">
        <motion.div
          className="skeleton h-12 flex-1 rounded-xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
        <motion.div
          className="skeleton h-12 flex-1 rounded-xl"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
        />
      </div>
    );
  }

  return null;
};

export default LoadingSkeleton;
