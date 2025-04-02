import React, { useEffect, useState } from 'react';

export function SimpleThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    }
    return 'system';
  });
  
  useEffect(() => {
    // On mount, apply the saved theme
    applyTheme(theme);
    
    // Add a visible class to make sure toggle is displayed
    const root = document.documentElement;
    if (root) {
      root.style.setProperty('--theme-toggle-display', 'block');
    }
  }, [theme]);
  
  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = document.documentElement;
    const isDarkMode = 
      newTheme === 'dark' || 
      (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };
  
  return (
    <div className="SimpleThemeToggle flex items-center gap-2 border rounded-lg overflow-hidden bg-background shadow-sm">
      <button
        onClick={() => handleThemeChange('light')}
        className={`flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
          theme === 'light' 
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
            : 'hover:bg-muted'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="M5 5l1.5 1.5"></path>
          <path d="M17.5 17.5l1.5 1.5"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="M5 19l1.5-1.5"></path>
          <path d="M17.5 6.5l1.5-1.5"></path>
        </svg>
        Light
      </button>
      
      <button
        onClick={() => handleThemeChange('dark')}
        className={`flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
            : 'hover:bg-muted'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
        Dark
      </button>
      
      <button
        onClick={() => handleThemeChange('system')}
        className={`flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
          theme === 'system' 
            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' 
            : 'hover:bg-muted'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
        Auto
      </button>
    </div>
  );
}