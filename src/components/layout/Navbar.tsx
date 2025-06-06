import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dropdown, setDropdown] = useState(false);

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
            <img
              src={"/src/assets/icon.svg"}
              alt="Logo"
              className="w-10 h-10 transition-transform duration-200 group-hover:scale-110"
            />
            <span className="text-2xl text-[var(--wisely-dark)] tracking-tight font-[Open_Sans] group-hover:text-[var(--wisely-purple)] transition-colors duration-200">
              Time.Wisely
            </span>
          </button>
          {/* User Dropdown hoặc Sign In */}
          {user ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-[var(--wisely-dark)] font-semibold shadow-sm"
                onClick={() => setDropdown((d) => !d)}
              >
                Welcome back, {user.fullName || user.email}
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.085l3.71-3.855a.75.75 0 1 1 1.08 1.04l-4.24 4.4a.75.75 0 0 1-1.08 0l-4.24-4.4a.75.75 0 0 1 .02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[var(--wisely-purple)]/10"
                    onClick={() => {
                      setDropdown(false);
                      navigate("/dashboard");
                    }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-[var(--wisely-purple)]/10"
                    onClick={async () => {
                      setDropdown(false);
                      await logout();
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => navigate("/auth")}
                className="backdrop-blur-md bg-white/10 border-white/30 hover:bg-[var(--wisely-purple)] hover:text-white transition-all duration-300 px-6 py-2 font-semibold rounded-lg shadow-sm"
              >
                Sign In
              </Button>
            </motion.div>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
