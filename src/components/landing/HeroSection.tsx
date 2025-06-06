import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ReactTyped } from "react-typed";
import AnalogClock from "./AnalogClock";

type HeroSectionProps = {
  mousePosition: { x: number; y: number };
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const HeroSection = ({ mousePosition }: HeroSectionProps) => {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-6 py-16 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
      >
        <AnalogClock />
      </motion.div>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          className="text-6xl md:text-7xl font-bold text-[var(--wisely-dark)] mb-6"
        >
          Make Every{" "}
          <span className="bg-gradient-to-r from-[var(--wisely-purple)] via-[var(--wisely-mint)] to-[var(--wisely-pink)] bg-clip-text text-transparent inline-block">
            Moment
          </span>{" "}
          Count
        </motion.div>
        <motion.p
          className="text-xl mb-8 max-w-2xl mx-auto bg-gradient-to-r from-[var(--wisely-purple)] via-[var(--chart-2)] to-[var(--wisely-pink)] bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <ReactTyped
            strings={[
              "Use your time wisely with personalized suggestions powered by AI.",
              "Discover activities that match your goals and make the most of your free time.",
            ]}
            typeSpeed={40}
            backSpeed={20}
            backDelay={2000}
            loop
          />
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-[var(--wisely-purple)] hover:bg-[var(--wisely-pink)] text-[var(--wisely-white)] px-8 py-4 text-lg shadow-xl "
            >
              Get Started Free
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="bg-[var(--wisely-white)]/10 border-[var(--wisely-mint)] text-[var(--wisely-purple)] hover:bg-[var(--wisely-mint)] hover:text-[var(--wisely-white)] px-8 py-4 text-lg"
            >
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
