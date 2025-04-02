import { useState, useEffect } from "react";
import { nanoid } from "nanoid";

type ToastType = "default" | "success" | "warning" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  createdAt: number;
}

interface ToastStore {
  toasts: Toast[];
  toast: (message: string, options?: { type?: ToastType; duration?: number }) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}

// Toast state management
const toastState: {
  toasts: Toast[];
  listeners: Array<(toasts: Toast[]) => void>;
} = {
  toasts: [],
  listeners: [],
};

// Update toast state and notify all subscribers
const updateToasts = (nextToasts: Toast[]) => {
  toastState.toasts = nextToasts;
  toastState.listeners.forEach((listener) => listener(nextToasts));
};

export function useToast(): ToastStore {
  const [toasts, setToasts] = useState<Toast[]>(toastState.toasts);

  useEffect(() => {
    // Subscribe to toast state changes
    function handleChanges(nextToasts: Toast[]) {
      setToasts(nextToasts);
    }

    toastState.listeners.push(handleChanges);
    return () => {
      toastState.listeners = toastState.listeners.filter(
        (listener) => listener !== handleChanges
      );
    };
  }, []);

  // Auto-dismiss toasts based on duration
  useEffect(() => {
    if (toasts.length === 0) return;

    const now = Date.now();
    const timeouts: NodeJS.Timeout[] = [];

    toasts.forEach((toast) => {
      const duration = toast.duration || 5000; // 5 seconds default
      const remainingTime = Math.max(0, duration - (now - toast.createdAt));

      if (remainingTime > 0) {
        const timeout = setTimeout(() => {
          dismiss(toast.id);
        }, remainingTime);
        timeouts.push(timeout);
      } else {
        dismiss(toast.id);
      }
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [toasts]);

  const toast = (message: string, options?: { type?: ToastType; duration?: number }) => {
    const id = nanoid();
    const toast: Toast = {
      id,
      message,
      type: options?.type || "default",
      duration: options?.duration || 5000,
      createdAt: Date.now(),
    };
    updateToasts([...toastState.toasts, toast]);
    return id;
  };

  const dismiss = (id: string) => {
    updateToasts(toastState.toasts.filter((toast) => toast.id !== id));
  };

  const dismissAll = () => {
    updateToasts([]);
  };

  return { toasts, toast, dismiss, dismissAll };
}