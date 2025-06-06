import { motion } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FeaturesSection = ({ features, GlassCard }: { features: any[]; GlassCard: any }) => (
  <section className="container mx-auto px-6 py-16 relative z-10">
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2 }}
    >
      <h2 className="text-4xl font-bold text-[var(--wisely-dark)] mb-4">
        Everything you need to manage time wisely
      </h2>
      <p className="text-[var(--wisely-gray)] max-w-2xl mx-auto text-lg">
        From smart scheduling to AI-powered suggestions, TimeWisely has all
        the tools you need to optimize your daily routine.
      </p>
    </motion.div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <GlassCard
          key={index}
          className="p-8 hover:bg-[var(--wisely-pink)]/20 transition-all duration-300 group"
          delay={1.4 + index * 0.1}
        >
          <motion.div
            className="flex items-center mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <div className="p-3 bg-gradient-to-r from-[var(--wisely-purple)] to-[var(--wisely-mint)] rounded-xl mr-4 group-hover:shadow-lg transition-shadow">
              <feature.icon className="w-6 h-6 text-[var(--wisely-white)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--wisely-dark)]">
              {feature.title}
            </h3>
          </motion.div>
          <p className="text-[var(--wisely-gray)] leading-relaxed">
            {feature.description}
          </p>
        </GlassCard>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
