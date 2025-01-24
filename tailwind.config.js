const {heroui} = require('@heroui/theme');
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/modal.js"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Cores Primárias
        'primary-dark': '#1F1F1F', // Fundo principal
        'secondary-dark': '#3B3B3B', // Fundo de elementos secundários
        'text-white': '#FFFFFF', // Texto principal e títulos

        // Cores de Destaque
        'highlight-red': '#D81F26', // Botões e Destaques
        'highlight-yellow': '#FFB800', // Notas, estrelas e ícones de destaque

        // Cores de Suporte
        'text-gray': '#A6A6A6', // Textos secundários
        'action-blue': '#1E88E5', // Links e elementos de ação
        primary: "#3498db",
      },
      
      backgroundImage: {
        lastMovie: "url('https://wallpapers.com/images/hd/4k-mountain-l3f04sogeaabr5h0.jpg')"
      },

      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out forwards",
        fadeOut: 'fadeOut 0.5s ease-out'
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 }
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      }
    },
  },
  plugins: [heroui()],
};
