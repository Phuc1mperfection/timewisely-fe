import { motion } from "framer-motion";

const AuthLogo = () => (
  <motion.div
    className="text-center mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className="w-12 h-12 bg-gradient-to-r from-[var(--wisely-purple)] to-[var(--wisely-mint)] rounded-lg mx-auto mb-4"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    />
    <h1 className="text-3xl font-bold text-[var(--wisely-dark)] dark:text-amber-50">TimeWisely</h1>
    <p className="text-[var(--wisely-gray)]">
      Smart time management for everyone
    </p>
  </motion.div>
);

export default AuthLogo;
