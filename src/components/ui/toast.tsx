import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ToastProps {
  id: string;
  message: string;
  type?: "default" | "success" | "warning" | "error";
  onClose: (id: string) => void;
}

export const Toast = ({ id, message, type = "default", onClose }: ToastProps) => {
  // Auto-dismiss after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [id, onClose]);
  
  // Get appropriate styles based on toast type
  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-500 dark:text-green-100";
      case "warning":
        return "bg-amber-50 border-amber-500 text-amber-800 dark:bg-amber-900/50 dark:border-amber-500 dark:text-amber-100";
      case "error":
        return "bg-red-50 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-500 dark:text-red-100";
      default:
        return "bg-gray-50 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100";
    }
  };
  
  return (
    <div
      className={cn(
        "flex items-center justify-between p-4 mb-3 rounded-md shadow-md border-l-4 transition-all",
        getTypeStyles()
      )}
      role="alert"
    >
      <div className="flex-1">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-xs space-y-2">
      {children}
    </div>
  );
};