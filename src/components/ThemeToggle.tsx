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
    <div className="flex items-center gap-2 border rounded-full p-1 bg-background shadow-sm">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
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
        className={`transition-all ${theme === 'light' 
          ? 'bg-primary text-primary-foreground scale-100 shadow-md' 
          : 'hover:text-primary hover:bg-background/80'}`}
      >
        <Sun className="h-5 w-5" />
      </Button>
      
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
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
        className={`transition-all ${theme === 'dark' 
          ? 'bg-primary text-primary-foreground scale-100 shadow-md' 
          : 'hover:text-primary hover:bg-background/80'}`}
      >
        <Moon className="h-5 w-5" />
      </Button>
      
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
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
        className={`transition-all ${theme === 'system' 
          ? 'bg-primary text-primary-foreground scale-100 shadow-md' 
          : 'hover:text-primary hover:bg-background/80'}`}
      >
        <Monitor className="h-5 w-5" />
      </Button>
    </div>
  );
}