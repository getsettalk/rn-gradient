import React, { useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToastProps {
  id: string;
  message: string;
  type?: "default" | "success" | "warning" | "error";
  onClose: (id: string) => void;
}

export const Toast = ({ id, message, type = "default", onClose }: ToastProps) => {
  // Auto-dismiss after a set time
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    default: <Info className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
  };

  const toastClasses = {
    default: "bg-primary text-primary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    error: "bg-destructive text-destructive-foreground",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 rounded-lg shadow-lg mb-3",
        toastClasses[type]
      )}
    >
      <div className="flex items-center space-x-3">
        {icons[type]}
        <p className="font-medium">{message}</p>
      </div>
      <button onClick={() => onClose(id)} className="text-white ml-3">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse max-w-md">
      {children}
    </div>
  );
};