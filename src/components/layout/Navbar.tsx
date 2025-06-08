import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <motion.header
      className="container mx-auto px-6 py-6 relative z-10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className=" bg-white/10 border border-white/20 rounded-2xl px-6 py-4 shadow-xl transition-transform duration-200">
        <div className="flex items-center justify-between">
          {/* Logo + Brand */}
          <button
            className="flex items-center space-x-3 group bg-transparent border-none p-0 focus:outline-none group-hover:scale-110"
            onClick={() => navigate("/")}
            aria-label="Go to Home"
          >
            <img
              src={"/src/assets/icon.svg"}
              alt="Logo"
              className="w-10 h-10 transition-transform duration-200 "
            />
            <span className="text-2xl text-[var(--wisely-dark)] tracking-tight font-[Open_Sans] group-hover:text-[var(--wisely-purple)]  transition-transform duration-200 group-hover:scale-110 ">
              Time.Wisely
            </span>
          </button>
          {/* User Dropdown hoặc Sign In */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-[var(--wisely-dark)] font-semibold shadow-sm transition-transform duration-300 hover:scale-105 hover:ring-2 hover:ring-[var(--wisely-purple)] "
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
              <DropdownMenuContent align="end" className="w-48 text-[var(--wisely-dark)] bg-white/90  border border-white/20 rounded-lg shadow-lg">
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
