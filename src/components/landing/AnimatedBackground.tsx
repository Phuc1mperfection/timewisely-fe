import { motion, useMotionValue, useSpring } from "motion/react";

const AnimatedBackground = ({
  mousePosition,
}: {
  mousePosition: { x: number; y: number };
}) => {
  const x1 = useMotionValue(mousePosition.x * 0.02);
  const y1 = useMotionValue(mousePosition.y * 0.02);
  const x2 = useMotionValue(mousePosition.x * -0.01);
  const y2 = useMotionValue(mousePosition.y * -0.01);

  const springX1 = useSpring(x1, { stiffness: 100, damping: 30 });
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springX2 = useSpring(x2, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute w-96 h-96 bg-[var(--wisely-gold)]/10 rounded-full"
        style={{
          x: springX1,
          y: springY1,
          left: "10%",
          top: "20%",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-[var(--wisely-champagne)]/10 rounded-full"
        style={{
          x: springX2,
          y: springY2,
          right: "10%",
          bottom: "20%",
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
