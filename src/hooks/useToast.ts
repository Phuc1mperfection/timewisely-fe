import { toast } from "sonner";

export const useToast = () => {
  const success = (message: string) => {
    toast.success(message
      , {
        duration: 5000,
        style: {
          backgroundColor: '#4CAF50', // Green background for success
          color: '#FFFFFF', // White text
        },
      }
    );
  };

  const error = (message: string) => {
    toast.error(message,
      {
        duration: 5000,
        style: {
          backgroundColor: '#F44336', // Red background for error
          color: '#FFFFFF', // White text
        },
      }
    );
  };

  const info = (message: string) => {
    toast.message(message);
  };

  const warning = (message: string) => {
    toast.warning(message);
  };

  return { success, error, info, warning };
};
