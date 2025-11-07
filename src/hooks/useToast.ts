import { toast } from "sonner";
import { AxiosError } from "axios";

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message, {
      duration: 5000,
    });
  };

  const error = (message: string) => {
    toast.error(message, {
      duration: 5000,
    });
  };

  const info = (message: string) => {
    toast.message(message);
  };

  const warning = (message: string) => {
    toast.warning(message);
  };

  /**
   * Handle error with automatic message extraction
   * Extracts message from AxiosError, Error, or uses fallback
   * Also logs full error to console for debugging
   *
   * @param err - Error object (can be AxiosError, Error, or unknown)
   * @param fallbackMessage - Default message if extraction fails
   * @param context - Optional context for logging (e.g., "Start Session")
   * @returns The extracted error message
   */
  const handleError = (
    err: unknown,
    fallbackMessage: string,
    context?: string
  ): string => {
    // Extract error message
    let errorMessage: string;

    if (err instanceof AxiosError && err.response?.data?.message) {
      // Priority 1: Backend error message
      errorMessage = err.response.data.message;
    } else if (err instanceof Error && err.message) {
      // Priority 2: Standard Error message
      errorMessage = err.message;
    } else {
      // Priority 3: Fallback message
      errorMessage = fallbackMessage;
    }

    // Show toast notification
    error(errorMessage);

    // Log full error to console for debugging
    if (context) {
      console.error(`[${context}]`, err);
    } else {
      console.error(err);
    }

    // Log additional AxiosError details
    if (err instanceof AxiosError) {
      console.error("Response:", err.response?.data);
      console.error("Status:", err.response?.status);
      console.error("URL:", err.config?.url);
    }

    return errorMessage;
  };

  return { success, error, info, warning, handleError };
};
