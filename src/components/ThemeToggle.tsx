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
    <div className="flex items-center gap-2">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleThemeChange('light')}
        aria-label="Light mode"
        className={theme === 'light' ? 'bg-primary text-primary-foreground' : ''}
      >
        <Sun className="h-5 w-5" />
      </Button>
      
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleThemeChange('dark')}
        aria-label="Dark mode"
        className={theme === 'dark' ? 'bg-primary text-primary-foreground' : ''}
      >
        <Moon className="h-5 w-5" />
      </Button>
      
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => handleThemeChange('system')}
        aria-label="System theme"
        className={theme === 'system' ? 'bg-primary text-primary-foreground' : ''}
      >
        <Monitor className="h-5 w-5" />
      </Button>
    </div>
  );
}