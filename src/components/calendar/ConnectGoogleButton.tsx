import React, { useState } from "react";
import { Calendar, Check, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { connectGoogleCalendar } from "@/services/calendarServices";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/contexts/useAuth";

// Custom Google icon component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface ConnectGoogleButtonProps {
  onConnect: () => void;
}

const ConnectGoogleButton: React.FC<ConnectGoogleButtonProps> = ({
  onConnect,
}) => {
  const [connecting, setConnecting] = useState(false);
  const { error } = useToast();
  const { user } = useAuth();

  // Check for completed auth in useEffect
  // Sử dụng các điều kiện tương tự như trong CalendarView
  const isGoogleUser =
    user?.googleConnected ||
    user?.googleCalendarSynced ||
    (user?.email && user?.email.includes("@gmail.com"));

  React.useEffect(() => {
    if (isGoogleUser) {
      onConnect();
    }
  }, [user, onConnect, isGoogleUser]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      // Gọi hàm để kết nối với Google Calendar
      // Hàm này đã được cập nhật để dùng URL redirect mới /dashboard/calendar
      await connectGoogleCalendar();
      // Trang sẽ chuyển hướng đến màn hình đồng ý của Google
      // Sau khi xác thực thành công, người dùng sẽ được chuyển hướng trở lại ứng dụng
    } catch (err) {
      console.error("Failed to connect Google Calendar:", err);
      error("Failed to connect Google Calendar");
      setConnecting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg p-8 bg-white/5 backdrop-blur-md rounded-2xl shadow-xl"
      >
        <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-full flex items-center justify-center">
          <Calendar className="w-10 h-10 text-purple-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">
          Connect Google Calendar
        </h2>

        <p className="text-white/70 mb-6">
          Sync your Google Calendar with TimeWisely to manage all your events in
          one place. We'll never modify your events without permission.
        </p>

        <button
          onClick={handleConnect}
          disabled={connecting}
          className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-white text-gray-800 hover:bg-gray-100 font-medium transition-colors"
        >
          {connecting ? (
            <Clock className="w-5 h-5 animate-spin" />
          ) : (
            <GoogleIcon className="w-5 h-5" />
          )}
          {connecting ? "Connecting..." : "Connect with Google Calendar"}
        </button>

        <div className="mt-6 border-t border-white/10 pt-6 grid grid-cols-1 gap-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-white/10 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-mint-400" />
            </div>
            <p className="text-sm text-white/60">
              View and sync your Google Calendar events
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-white/10 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-mint-400" />
            </div>
            <p className="text-sm text-white/60">
              Create and manage events from TimeWisely
            </p>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 mt-0.5 bg-white/10 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-mint-400" />
            </div>
            <p className="text-sm text-white/60">
              Disconnect anytime from your settings
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ConnectGoogleButton;
