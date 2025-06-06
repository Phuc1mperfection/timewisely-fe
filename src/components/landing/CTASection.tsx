import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CTASection = ({ GlassCard }: { GlassCard: any }) => {
  const navigate = useNavigate();
  return (
    <section className="container mx-auto px-6 py-16 relative z-10">
      <GlassCard
        className="bg-gradient-to-r from-[var(--wisely-purple)]/20 via-[var(--wisely-pink)]/20 to-[var(--wisely-mint)]/20 text-center p-12"
        delay={2}
      >
        <motion.h2
          className="text-4xl font-bold mb-4 text-[var(--wisely-dark)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.2 }}
        >
          Ready to transform your time management?
        </motion.h2>
        <motion.p
          className="text-lg mb-8 text-[var(--wisely-gray)] max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.4 }}
        >
          Join thousands of users who have already optimized their schedules
          with TimeWisely.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-[var(--wisely-purple)] hover:bg-[var(--wisely-pink)] text-[var(--wisely-white)] px-8 py-4 text-lg font-semibold shadow-xl"
          >
            Start Your Free Trial
          </Button>
        </motion.div>
      </GlassCard>
    </section>
  );
};

export default CTASection;
