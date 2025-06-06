import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <motion.header 
      className="container mx-auto px-6 py-6 relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className=" bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-xl hover:scale-105 transition-transform duration-200">
        <div className="flex items-center justify-between">
          {/* Logo + Brand */}
          <button
            className="flex items-center space-x-3 group bg-transparent border-none p-0 focus:outline-none"
            onClick={() => navigate("/")}
            aria-label="Go to Home"
          >
            <img src={"/src/assets/icon.svg"} alt="Logo" className="w-10 h-10 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-2xl text-[var(--wisely-dark)] tracking-tight font-[Open_Sans] group-hover:text-[var(--wisely-purple)] transition-colors duration-200">
              Time.Wisely
            </span>
          </button>
          {/* Sign In Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/auth')}
              className="backdrop-blur-md bg-white/10 border-white/30 hover:bg-[var(--wisely-purple)] hover:text-white transition-all duration-300 px-6 py-2 font-semibold rounded-lg shadow-sm"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
