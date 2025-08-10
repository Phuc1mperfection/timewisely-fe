import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../contexts/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-white/20 bg-opacity-10 backdrop-blur-md border border-white/10 border-opacity-20 border-b"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              className="flex items-center space-x-2 group bg-transparent border-none p-0 focus:outline-none"
              onClick={() => navigate("/")}
              aria-label="Go to Home"
            >
              <div className="p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-100">
                <img
                  src={"/src/assets/icon.svg"}
                  alt="Logo"
                  className="w-9 h-9 transition-transform duration-200"
                />
              </div>
              <span className="text-2xl text-[var(--wisely-dark)] tracking-tight font-[Open_Sans] ">
                Time.Wisely
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-10 space-x-10">
            <a
              href="#features"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Features
            </a>
            
            <a
              href="#about"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              About
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Pricing
            </a>
          </div>

          {/* User Dropdown hoặc Sign In */}
          <div className="flex-shrink-0 flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-[var(--wisely-dark)] font-semibold shadow-sm transition-transform duration-300 hover:scale-105 hover:ring-2 hover:ring-[var(--wisely-purple)]"
                    aria-label="User menu"
                  >
                    Welcome back, {user.fullName || user.email}
                    <img
                      src={"/src/assets/user-dropdown.svg"}
                      alt="Dropdown"
                      width={16}
                      height={16}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 text-[var(--wisely-dark)] bg-white/90 border border-white/20 rounded-lg shadow-lg"
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  className="btn-primary px-6 py-2.5 rounded-full text-white font-medium"
                  onClick={() => {
                    navigate("/auth");
                  }}
                >
                  Get Started
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 glass-dark border-t border-white/10 shadow-lg">
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
                  className="w-full max-w-xs mx-auto btn-primary px-6 py-3 rounded-full text-white font-medium mt-2"
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
      </nav>
    </motion.header>
  );
};

export default Navbar;
