import { useState, useEffect, useCallback } from 'react';

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

// In-memory state for toasts
let toasts: Toast[] = [];
const listeners: Array<(toasts: Toast[]) => void> = [];

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]));
}

export function useToast(): ToastStore {
  const [state, setState] = useState<Toast[]>(toasts);
  
  useEffect(() => {
    function handleChanges(nextToasts: Toast[]) {
      setState(nextToasts);
    }
    
    listeners.push(handleChanges);
    
    return () => {
      const index = listeners.indexOf(handleChanges);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);
  
  const toast = useCallback((message: string, options?: { type?: ToastType; duration?: number }) => {
    const id = Math.random().toString(36).slice(2, 11);
    
    const toast: Toast = {
      id,
      message,
      type: options?.type || "default",
      duration: options?.duration || 3000,
      createdAt: Date.now()
    };
    
    toasts = [...toasts, toast];
    notifyListeners();
    
    // Auto dismiss after duration
    setTimeout(() => {
      dismiss(id);
    }, toast.duration);
    
    return id;
  }, []);
  
  const dismiss = useCallback((id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    notifyListeners();
  }, []);
  
  const dismissAll = useCallback(() => {
    toasts = [];
    notifyListeners();
  }, []);
  
  return {
    toasts: state,
    toast,
    dismiss,
    dismissAll
  };
}