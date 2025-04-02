import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { cn } from '../lib/utils';

function getToastBorderColor(type: string): string {
  switch (type) {
    case 'success':
      return 'border-green-500';
    case 'error':
      return 'border-red-500';
    case 'warning':
      return 'border-yellow-500';
    default:
      return 'border-primary';
  }
}

export function ToastProvider() {
  const { toasts, dismiss } = useToast();
  
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "bg-card shadow-lg rounded-lg border-l-4 overflow-hidden pointer-events-auto flex items-center p-4 transition-all",
            "animate-in slide-in-from-right-full duration-200",
            getToastBorderColor(toast.type)
          )}
        >
          <div className="flex-1 ml-2 mr-4">
            <p className="text-sm">{toast.message}</p>
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}