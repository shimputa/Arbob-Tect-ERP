import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BRAND_BLUE: 'brand-blue',
  BRAND_GREEN: 'brand-green',
};

// Create the context with default values
const ThemeContext = createContext({
  theme: THEMES.LIGHT,
  setTheme: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
  selectedBrandColor: null,
  setBrandColor: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get the saved theme from localStorage or use light theme as default
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || THEMES.LIGHT;
  });

  // Function to determine if the current theme is dark mode
  const isDarkMode = theme === THEMES.DARK;

  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setTheme(current => current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK);
  };

  // Get the saved brand color from localStorage or use null as default
  const [selectedBrandColor, setSelectedBrandColor] = useState(() => {
    return localStorage.getItem('brandColor') || null;
  });

  // Function to set brand color
  const setBrandColor = (color) => {
    setSelectedBrandColor(color);
  };

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme class to the document element
    const root = document.documentElement;
    root.classList.remove(...Object.values(THEMES));
    root.classList.add(theme);

  }, [theme]);

  // Update localStorage when brand color changes
  useEffect(() => {
    if (selectedBrandColor) {
      localStorage.setItem('brandColor', selectedBrandColor);
    } else {
      localStorage.removeItem('brandColor');
    }
    
    // Apply brand color as CSS variable
    if (selectedBrandColor) {
      document.documentElement.style.setProperty('--brand-color', selectedBrandColor);
    } else {
      document.documentElement.style.removeProperty('--brand-color');
    }
  }, [selectedBrandColor]);

  // Theme context value
  const value = {
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
    selectedBrandColor,
    setBrandColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 