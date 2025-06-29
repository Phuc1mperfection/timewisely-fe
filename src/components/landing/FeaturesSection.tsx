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

    {/* Feature showcase with framer-motion */}
    <motion.div
      className="mt-20 reveal"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className=" p-8 lg:p-12 rounded-3xl border border-white/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h3 className="text-3xl font-bold mb-6">
              Experience the Power of
              <span className="gradient-text"> Intelligent Planning</span>
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Our AI analyzes your work patterns, energy levels, and preferences
              to create personalized schedules that maximize your productivity
              while maintaining work-life balance.
            </p>
            <ul className="space-y-4">
              <motion.li className="flex items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-4" />
                <span className="text-gray-700">Automatic task prioritization</span>
              </motion.li>
              <motion.li className="flex items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-4" />
                <span className="text-gray-700">Energy-based scheduling</span>
              </motion.li>
              <motion.li className="flex items-center" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-4" />
                <span className="text-gray-700">Smart break recommendations</span>
              </motion.li>
            </ul>
          </motion.div>
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <div className=" p-6 rounded-2xl border border-white/20">
              <div className="space-y-4">
                <motion.div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
                  <span className="font-medium">Deep Work Session</span>
                  <span className="text-sm text-purple-600 font-medium">25 min</span>
                </motion.div>
                <motion.div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
                  <span className="font-medium">Creative Break</span>
                  <span className="text-sm text-teal-600 font-medium">5 min</span>
                </motion.div>
                <motion.div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-lg" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
                  <span className="font-medium">Team Meeting</span>
                  <span className="text-sm text-pink-600 font-medium">30 min</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  </section>
);

export default FeaturesSection;
