/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode support using class strategy
  theme: {
    extend: {
      colors: {
        // Use CSS variables for brand colors
        brand: {
          primary: 'var(--brand-color, #3871ec)', // Default to blue
          light: 'var(--brand-light, #8B5CF6)', 
          dark: 'var(--brand-dark, #5B21B6)',
        },
      },
      backgroundColor: {
        // Theme specific colors
        dark: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          accent: 'var(--bg-accent)',
        },
      },
      textColor: {
        dark: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
    },
  },
  plugins: [],
}

