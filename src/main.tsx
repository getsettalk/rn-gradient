import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize app with theme from localStorage
const theme = localStorage.getItem('theme') || 'system';
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const root = document.documentElement;

// Apply appropriate theme
if (theme === 'dark' || (theme === 'system' && systemTheme === 'dark')) {
  root.classList.add('dark');
} else {
  root.classList.add('light');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);