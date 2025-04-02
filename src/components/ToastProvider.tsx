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
  
  // Auto-dismiss toasts after 3 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        const oldestToast = toasts[0];
        if (oldestToast) dismiss(oldestToast.id);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [toasts, dismiss]);
  
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={cn(
            "bg-card shadow-2xl rounded-lg border-l-4 overflow-hidden pointer-events-auto flex items-center p-4 transition-all",
            "animate-in slide-in-from-right-full zoom-in duration-300",
            getToastBorderColor(toast.type)
          )}
          style={{
            transform: "translateZ(0)",  // Force GPU acceleration
            animationFillMode: 'forwards'
          }}
        >
          {/* Icon based on toast type */}
          <div className="flex-shrink-0">
            {toast.type === 'success' && (
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {toast.type === 'error' && (
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
            {toast.type === 'warning' && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            )}
            {toast.type === 'default' && (
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex-1 ml-3 mr-4">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          
          <button
            onClick={() => dismiss(toast.id)}
            className="text-muted-foreground hover:text-foreground transition-colors hover:bg-muted p-1 rounded-full"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}