import { toast } from "sonner";

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

  return { success, error, info, warning };
};
