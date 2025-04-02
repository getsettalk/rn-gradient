import React from "react";
import { useToast } from "../hooks/use-toast";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";

const ToastIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

export function ToastProvider() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 max-h-screen overflow-hidden flex flex-col-reverse items-end gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden p-4 w-full max-w-md flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300"
          style={{ borderLeft: `4px solid var(--${getToastBorderColor(toast.type)})` }}
        >
          <ToastIcon type={toast.type} />
          <div className="flex-1 mr-2">{toast.message}</div>
          <button
            onClick={() => dismiss(toast.id)}
            className="p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function getToastBorderColor(type: string): string {
  switch (type) {
    case "success":
      return "primary";
    case "warning":
      return "destructive";
    case "error":
      return "destructive";
    default:
      return "primary";
  }
}