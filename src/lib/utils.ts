import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names with Tailwind's merge utility
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if localStorage is available in the current environment
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Theme type for the application
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Get the current system theme preference
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Set the application theme
 */
export function setTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  const root = window.document.documentElement;
  
  // Remove current theme classes
  root.classList.remove('light', 'dark');
  
  // Store the theme preference
  if (theme !== 'system') {
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  } else {
    // Apply system preference
    const systemTheme = getSystemTheme();
    root.classList.add(systemTheme);
    localStorage.setItem('theme', 'system');
  }
}