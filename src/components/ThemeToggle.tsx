import React, { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from './ui/button';
import { Theme, getSystemTheme, setTheme } from '../lib/utils';

export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme>('system');
  
  useEffect(() => {
    // Load theme from localStorage
    const storedTheme = localStorage.getItem('theme') as Theme;
    
    if (storedTheme) {
      setThemeState(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Default to system theme
      setThemeState('system');
      applyTheme('system');
    }
    
    // Add listener for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [theme]);
  
  const applyTheme = (theme: Theme) => {
    setTheme(theme);
  };
  
  const handleThemeChange = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };
  
  return (
    <div className="flex items-center gap-2 border-2 border-primary/20 rounded-full p-1 bg-background shadow-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          handleThemeChange('light');
          document.documentElement.classList.remove('dark');
          document.documentElement.classList.add('light');
          // Visual feedback on click
          const button = document.activeElement as HTMLButtonElement;
          if (button) {
            button.classList.add('scale-90');
            setTimeout(() => button.classList.remove('scale-90'), 100);
          }
        }}
        aria-label="Light mode"
        className={`relative overflow-hidden transition-all rounded-full ${theme === 'light' 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-300 text-white scale-100 shadow-md font-medium' 
          : 'text-foreground hover:text-yellow-500 hover:bg-yellow-100/20'}`}
      >
        <Sun className="h-5 w-5 mr-1" />
        <span className="text-xs">Light</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          handleThemeChange('dark');
          document.documentElement.classList.remove('light');
          document.documentElement.classList.add('dark');
          // Visual feedback on click
          const button = document.activeElement as HTMLButtonElement;
          if (button) {
            button.classList.add('scale-90');
            setTimeout(() => button.classList.remove('scale-90'), 100);
          }
        }}
        aria-label="Dark mode"
        className={`relative overflow-hidden transition-all rounded-full ${theme === 'dark' 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white scale-100 shadow-md font-medium' 
          : 'text-foreground hover:text-indigo-500 hover:bg-indigo-100/20'}`}
      >
        <Moon className="h-5 w-5 mr-1" />
        <span className="text-xs">Dark</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          handleThemeChange('system');
          // Apply system theme immediately
          const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');
          // Visual feedback on click
          const button = document.activeElement as HTMLButtonElement;
          if (button) {
            button.classList.add('scale-90');
            setTimeout(() => button.classList.remove('scale-90'), 100);
          }
        }}
        aria-label="System theme"
        className={`relative overflow-hidden transition-all rounded-full ${theme === 'system' 
          ? 'bg-gradient-to-r from-blue-500 to-teal-400 text-white scale-100 shadow-md font-medium' 
          : 'text-foreground hover:text-blue-500 hover:bg-blue-100/20'}`}
      >
        <Monitor className="h-5 w-5 mr-1" />
        <span className="text-xs">Auto</span>
      </Button>
    </div>
  );
}