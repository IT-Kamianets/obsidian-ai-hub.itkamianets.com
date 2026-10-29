/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#0c0e14',
          subtle: '#121622',
          surface: '#171c2b',
          elevated: '#1e2438',
          border: '#2a324b',
          'border-hover': '#3b4668',
          text: '#f3f4f6',
          muted: '#9ca3af',
          dim: '#6b7280',
          purple: {
            DEFAULT: '#8b5cf6',
            hover: '#7c3aed',
            glow: 'rgba(139, 92, 246, 0.25)',
            light: '#c4b5fd',
            dark: '#6d28d9'
          },
          cyan: '#38bdf8',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'obsidian-glow': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'obsidian-card': '0 4px 20px 0 rgba(0, 0, 0, 0.35)',
        'obsidian-modal': '0 20px 50px rgba(0, 0, 0, 0.7)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' }
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }
    },
  },
  plugins: [],
}
