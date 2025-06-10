import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";

interface ActivityToastListenerProps {
  error: string | null;
  success: string | null;
  onResetError: () => void;
  onResetSuccess: () => void;
}

export const ActivityToastListener = ({
  error,
  success,
  onResetError,
  onResetSuccess,
}: ActivityToastListenerProps) => {
  const { error: toastError, success: toastSuccess } = useToast();

  useEffect(() => {
    if (error) {
      toastError(error);
      onResetError();
    }
    if (success) {
      toastSuccess(success);
      onResetSuccess();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, success]);

  return null;
};
