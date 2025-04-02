import React from 'react';
import { Route, Switch } from 'wouter';
import GradientGenerator from './pages/GradientGenerator';
import NotFound from './pages/not-found';
import { ToastProvider } from './components/ToastProvider';
import { SimpleThemeToggle } from './components/SimpleThemeToggle';

function Router() {
  return (
    <Switch>
      <Route path="/" component={GradientGenerator} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <>
      {/* Global header with theme toggle that appears on every page */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3v12"></path>
                <path d="M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                <path d="M15 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path>
                <path d="M18 6l-6.15 6"></path>
                <path d="M12 18l-6-6"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Gradient Generator
            </h1>
          </div>
          
          {/* Simple theme toggle button */}
          <SimpleThemeToggle />
        </div>
      </header>
      
      <main>
        <Router />
      </main>
      
      <ToastProvider />
    </>
  );
}

export default App;