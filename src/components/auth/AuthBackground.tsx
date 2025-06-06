import { motion } from "framer-motion";

const AuthBackground = () => (
  <div className="absolute inset-0">
    <motion.div
      className="absolute w-96 h-96 bg-[var(--wisely-purple)]/30 rounded-full blur-2xl"
      animate={{ scale: [1, 1.9, 1], rotate: [0, 180, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ left: "10%", top: "10%" }}
    />
    <motion.div
      className="absolute w-100 h-100 bg-[var(--wisely-mint)]/90 rounded-full blur-2xl"
      animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      style={{ right: "50%", bottom: "10%" }}
    />
    <motion.div
      className="absolute w-72 h-72 bg-[var(--wisely-pink)]/80 rounded-full blur-xl"
      animate={{ scale: [1, 1.3, 1], x: [0, 50, 0], y: [0, -30, 0] }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      style={{ left: "65%", top: "20%" }}
    />
  </div>
);

export default AuthBackground;
