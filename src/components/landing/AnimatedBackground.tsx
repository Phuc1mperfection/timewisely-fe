import { motion } from "motion/react";

const AnimatedBackground = ({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) => (
  <div className="absolute inset-0 overflow-hidden">
    <motion.div
      className="absolute w-96 h-96 bg-[var(--wisely-gold)]/10 rounded-full blur-3xl"
      animate={{
        x: mousePosition.x * 0.02,
        y: mousePosition.y * 0.02,
      }}
      style={{
        left: "10%",
        top: "20%",
      }}
    />
    <motion.div
      className="absolute w-80 h-80 bg-[var(--wisely-champagne)]/10 rounded-full blur-3xl"
      animate={{
        x: mousePosition.x * -0.01,
        y: mousePosition.y * -0.01,
      }}
      style={{
        right: "10%",
        bottom: "20%",
      }}
    />
  </div>
);

export default AnimatedBackground;
