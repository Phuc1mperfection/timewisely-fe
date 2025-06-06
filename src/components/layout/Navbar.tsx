import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <header className="container mx-auto px-6 py-6">
      <nav className="flex items-center justify-between">
        <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
         
            <img src={"/src/assets/icon.svg"} alt="Logo" className="w-12 h-12 " />
          <Button
            className="text-3xl text-[var(--wisely-dark)] tracking-tight ]  bg-transparent border-none cursor-pointer hover:bg-transparent hover:border-none "
            onClick={() => navigate("/")}
            aria-label="Go to Home"
            style={{ padding: 0 }}
          >
            Time.Wisely
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className="hover:bg-[var(--wisely-purple)] hover:text-white transition-colors border-[var(--wisely-purple)] text-[var(--wisely-purple)] px-6 py-2 font-semibold rounded-lg shadow-sm"
          >
            Sign In
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
