import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import ClockFaceFunny from "@/assets/clock-face-funny.svg";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wisely-blue via-indigo-900 to-gray-900 dark:bg-gray-950">
      <div className="text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <img
            src={ClockFaceFunny}
            alt="Funny Clock Face"
            width={100}
            height={100}
          />
        </div>
        <h1 className="text-5xl font-extrabold mb-2 text-[var(--wisely-blue)] drop-shadow-lg">
          404
        </h1>
        <p className="text-2xl text-gray-200 mb-4 font-semibold">
          Lost in cyberspace?
        </p>
        <p className="text-lg text-gray-400 mb-6">
          The page you are looking for does not exist.
          <br />
          Maybe it went to "sleep early"—just like you probably should!
        </p>
        <Button
          onClick={() => navigate("/")}
          className="px-6 py-2 rounded-full "
        >
          Back to Dashboard
        </Button>
        <div className="mt-8 text-sm text-gray-500 italic">
          If you think this is a mistake, double-check the URL or contact the
          TimeWisely team!
        </div>
      </div>
    </div>
  );
};

export default NotFound;
