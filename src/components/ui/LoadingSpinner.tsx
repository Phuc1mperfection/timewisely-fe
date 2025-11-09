import React from "react";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: "small" | "medium" | "large";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = false,
  size = "medium",
}) => {
  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const spinner = (
    <div className="flex items-center justify-center">
      <Loader className={`${sizeClass[size]} animate-spin yellow-500`} />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
