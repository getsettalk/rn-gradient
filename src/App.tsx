import React, { useEffect } from "react";
import { Route, Switch } from "wouter";
import { getSystemTheme, setTheme, isLocalStorageAvailable } from "./lib/utils";
import GradientGenerator from "./pages/GradientGenerator";
import { ToastProvider } from "./components/ToastProvider";
import ThemeToggle from "./components/ThemeToggle";

// Simple Not Found component
function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="inline-flex items-center justify-center rounded-md font-medium h-10 py-2 px-4 bg-primary text-primary-foreground hover:bg-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={GradientGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize theme
  useEffect(() => {
    if (isLocalStorageAvailable()) {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme as any);
      } else {
        // Default to system preference
        setTheme("system");
      }
    } else {
      // Fallback to system theme if localStorage is not available
      setTheme(getSystemTheme());
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="border-b py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gradient Generator
            </span>
          </div>
          <ThemeToggle />
        </div>
      </nav>
      
      <main>
        <Router />
      </main>
      
      <footer className="mt-16 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} Gradient Generator. Create beautiful gradients for your projects.</p>
        </div>
      </footer>
      
      <ToastProvider />
    </div>
  );
}

export default App;