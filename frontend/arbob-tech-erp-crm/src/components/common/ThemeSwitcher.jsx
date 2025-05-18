import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon, Palette } from 'lucide-react';

const ColorPreset = ({ color, active, onClick }) => (
  <button
    className={`w-6 h-6 rounded-full mx-1 ${active ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
    style={{ backgroundColor: color }}
    onClick={onClick}
  />
);

const ThemeSwitcher = () => {
  const { isDarkMode, toggleDarkMode, selectedBrandColor, setBrandColor } = useTheme();
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!isColorMenuOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsColorMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorMenuOpen]);

  // Color presets - updated with modern professional colors
  const colorPresets = [
    { name: 'Purple', value: '#6D28D9' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Teal', value: '#0D9488' },
    { name: 'Sky', value: '#0EA5E9' },
  ];

  return (
    <div className="flex items-center" ref={dropdownRef}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Color picker toggle */}
      <div className="relative ml-2">
        <button
          onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Change brand color"
        >
          <Palette className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Color picker dropdown */}
        {isColorMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-10">
            <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Brand Colors</p>
            </div>
            <div className="px-4 py-3 flex flex-wrap items-center justify-center">
              {colorPresets.map((color) => (
                <ColorPreset
                  key={color.value}
                  color={color.value}
                  active={selectedBrandColor === color.value}
                  onClick={() => setBrandColor(color.value)}
                />
              ))}
              {selectedBrandColor && (
                <button
                  className="text-xs text-gray-500 dark:text-gray-400 mt-2 hover:underline"
                  onClick={() => setBrandColor(null)}
                >
                  Reset to default
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 