import { motion } from "motion/react"; // Ensure you have motion/react installed

const AuthLogo = () => (
  <motion.div
    className="text-center mb-8"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <motion.div
      className=" rounded-2xl mx-auto mb-4 flex items-center justify-center"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <img
        src={"/src/assets/icon.svg"}
        alt="Logo"
        className="w-24 h-24 transition-transform duration-200 hover:scale-110 hover:cursor-grab"
      />
    </motion.div>
    <h1 className="text-3xl text-amber-50">TimeWisely</h1>
    <p className="text-white/50">Smart time management for everyone</p>
  </motion.div>
);

export default AuthLogo;
