import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

export type Theme = 'light' | 'dark' | 'system';

export function getSystemTheme(): Theme {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function setTheme(theme: Theme): void {
  // Remove any existing theme classes
  document.documentElement.classList.remove('light', 'dark');
  
  // Apply the selected theme
  if (theme === 'system') {
    const systemTheme = getSystemTheme();
    document.documentElement.classList.add(systemTheme);
    localStorage.setItem('theme', theme);
  } else {
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }
}