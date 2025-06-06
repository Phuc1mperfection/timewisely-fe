import { motion } from "framer-motion";

const FooterSection = () => (
  <footer className="container mx-auto px-full py-10 border-t-4 border-[var(--wisely-mint)]/30 relative z-10">
    <motion.div
      className="flex flex-col md:flex-row items-center justify-between gap-4 text-[var(--wisely-gray)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 2.8 }}
    >
      <div className="flex items-center gap-2">
        <img
          src="/src/assets/icon.svg"
          alt="TimeWisely Logo"
          className="w-8 h-8"
        />
        <span className="font-bold text-lg text-[var(--wisely-dark)]">
          TimeWisely
        </span>
      </div>
      <p className="text-sm">&copy; 2025 TimeWisely. All rights reserved.</p>
      <div className="flex gap-4">
        <a
          href="#"
          className="hover:text-[var(--wisely-mint)] transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="hover:text-[var(--wisely-mint)] transition-colors"
        >
          Terms
        </a>
        <a
          href="#"
          className="hover:text-[var(--wisely-mint)] transition-colors"
        >
          Contact
        </a>
      </div>
    </motion.div>
  </footer>
);

export default FooterSection;
