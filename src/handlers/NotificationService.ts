import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "warning";

export interface NotifyOptions {
  title?: string;
  description?: string;
  duration?: number; // ms
}

export const useNotifier = () => {
  const notifySuccess = (message: string, options?: NotifyOptions) => {
    toast.success(message, {
      duration: options?.duration || 4000
    });
    if (import.meta.env.DEV) console.log("[SUCCESS]", message);
  };

  const notifyError = (error: unknown, options?: NotifyOptions) => {
    let message = "Something went wrong";

    // Axios / Fetch / custom error
    if (typeof error === "object" && error !== null && "response" in error && typeof error.response === "object" && error.response !== null && "data" in error.response && typeof error.response.data === "object" && error.response.data !== null && "message" in error.response.data && typeof error.response.data.message === "string") {
      message = error.response.data.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else if (typeof error === "string") {
      message = error;
    } else {
      // Fallback for truly unknown types
      message = "An unexpected error occurred";
    }

    toast.error(message, {
      duration: options?.duration || 5000,
    });

    if (import.meta.env.DEV) console.error("[ERROR]", error);
  };

  const notifyInfo = (message: string, options?: NotifyOptions) => {
    toast(message, {
      duration: options?.duration || 4000
    });
    if (import.meta.env.DEV) console.log("[INFO]", message);
  };

  return {
    notifySuccess,
    notifyError,
    notifyInfo,
  };
};
