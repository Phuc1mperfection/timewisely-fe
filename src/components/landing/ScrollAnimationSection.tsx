import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
} from "motion/react"; 
import backgroundImg from "@/assets/productive-background.jpg";
interface ScrollAnimationSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

const ScrollAnimationSection: React.FC<ScrollAnimationSectionProps> = ({
  title,
  backgroundImage = backgroundImg, // dùng path từ public/
}) => {
  const containerRef = useRef(null);

  const { scrollYProgress, scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Kích hoạt hiệu ứng sớm
  });

  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 500,
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textPosition = useTransform(scrollYProgress, [0, 1], ["50%", "-100%"]);
  const skewFactor = useTransform(smoothVelocity, [-1000, 1000], [15, -15]);

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full">
      {/* Sticky inner content */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <motion.div
          className="absolute w-full h-full"
          style={{ scale: imageScale }}
        >
          <img
            src={backgroundImage}
            alt="Background"
            className="object-cover"
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Text content */}
        <motion.h1
          className="relative z-10 uppercase text-white text-[10vw] font-bold text-nowrap"
          style={{
            x: textPosition,
            skew: skewFactor,
          }}
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
};

export default ScrollAnimationSection;
