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

        // New colors for scrapbook theme
        pastelPink: "#FFC1CC",       // Soft pink
        pastelYellow: "#FFEDCC",     // Soft yellow
        pastelPurple: "#C1C8FF",     // Soft purple
        
        // Hover effect
        darkGray: "#1E1E1E",         // Dark gray
        lightGray: "#F5F5F5",        // Light background gray
      },
      gradientColorStops: {
        yearlyGradientStart: "#2C2C2C",
        yearlyGradientEnd: "#000000",
      },
      animation: {
        slideUp: "slideUp 1s ease-in-out",   // Slide-up animation
        bounce: "bounce 1s infinite",        // Bounce animation
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(50px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};
