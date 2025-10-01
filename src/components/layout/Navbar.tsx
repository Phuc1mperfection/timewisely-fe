import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Updated to framer-motion
import { useAuth } from "../../contexts/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ThemeToggleButton } from "../ui/ThemeToggleButton";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Helper function to get display name
  const getDisplayName = (currentUser: typeof user) => {
    if (!currentUser) return "";
    const name = currentUser.fullName || currentUser.email;
    // If name is too long, show first name only or truncate email
    if (name.length > 20) {
      if (currentUser.fullName) {
        return currentUser.fullName.split(" ")[0]; // Show first name only
      } else {
        return name.substring(0, 15) + "..."; // Truncate email
      }
    }
    return name;
  };

  return (
    <motion.header
      className="
        fixed top-14 left-1/2 transform -translate-x-1/2 
        z-50 backdrop-blur-md rounded-full shadow-lg border
        bg-white/60 text-gray-900 border-gray-300
        dark:bg-black/60 dark:text-white dark:border-zinc-800
        w-full max-w-2xl px-4 sm:px-6 lg:px-8
      "
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <nav className="flex items-center justify-between h-16 py-2">
        {/* Logo */}
        <div className="flex-shrink-0">
          <button
            className="flex items-center space-x-2 group bg-transparent border-none p-0 focus:outline-none"
            onClick={() => navigate("/")}
            aria-label="Go to Home"
          >
            <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-100">
              <img
                src="/src/assets/icon.svg"
                alt="Logo"
                className="w-9 h-9 transition-transform duration-200"
              />
            </div>
            {/* <span className="text-2xl text-white tracking-tight font-[Open_Sans]">
              Time.Wisely
            </span> */}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1 space-x-6">
          <a
            href="#features"
            className="hover:text-purple-600 transition-colors font-medium"
          >
            Features
          </a>
          <a
            href="#about"
            className="hover:text-purple-600 transition-colors font-medium"
          >
            About
          </a>
          <a
            href="#pricing"
            className="hover:text-purple-600 transition-colors font-medium"
          >
            Pricing
          </a>
        </div>

        {/* User Dropdown or Sign In */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <ThemeToggleButton />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold shadow-sm transition-transform duration-300 hover:scale-105 hover:ring-2 hover:ring-[var(--wisely-purple)] max-w-[200px] sm:max-w-[250px]"
                  aria-label="User menu"
                >
                  <span className="truncate text-sm sm:text-base">
                    <span className="hidden sm:inline">Welcome back, </span>
                    {getDisplayName(user)}
                  </span>
                  <img
                    src="/src/assets/user-dropdown.svg"
                    alt="Dropdown"
                    width={16}
                    height={16}
                    className="flex-shrink-0"
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 text-white bg-white/90 border border-white/20 rounded-lg shadow-lg"
              >
                <DropdownMenuItem
                  onClick={() => {
                    navigate("app/dashboard");
                  }}
                  className="hover:bg-[var(--wisely-purple)]/10 hover:cursor-pointer text-md"
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                  className="hover:bg-[var(--wisely-purple)]/10 hover:cursor-pointer text-md"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="btn-primary px-3 py-1.5 rounded-2xl text-white font-medium shadow-md"
                onClick={() => {
                  navigate("/auth");
                }}
              >
                Get Started
              </button>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[4.5rem] left-4 right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg">
          <div className="px-6 py-6 space-y-5">
            <a
              href="#features"
              className="block text-white hover:text-purple-400 transition-colors font-medium text-lg"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-white hover:text-purple-400 transition-colors font-medium text-lg"
            >
              Pricing
            </a>
            <a
              href="#about"
              className="block text-white hover:text-purple-400 transition-colors font-medium text-lg"
            >
              About
            </a>
            <div className="flex justify-center pt-2">
              <button
                className="w-full max-w-xs mx-auto btn-primary px-6 py-3 rounded-xl text-white font-medium shadow-md"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/auth");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Navbar;
