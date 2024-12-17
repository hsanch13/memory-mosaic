// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        birthdayAccent: "#FBBF24",   // Yellow
        yearlyGradient: "#2C2C2C",   // Gray/Black 
        travelAccent: "#2D6A4F",     // Green 
        eventAccent: "#E5E5E5",      // Light Gray 
        
        // Hover effect
        darkGray: "#1E1E1E",         // Dark gray
        lightGray: "#F5F5F5",        // Light background gray
      },
      gradientColorStops: {
        yearlyGradientStart: "#2C2C2C",
        yearlyGradientEnd: "#000000",
      },
    },
  },
  plugins: [],
};

