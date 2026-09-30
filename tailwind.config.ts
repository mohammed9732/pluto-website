import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // The page: warm ivory, like the silk in the product film.
        silk: { DEFAULT: '#F6F3EE', light: '#FCFBF9', deep: '#EAE4DA' },
        // Type on silk, and the two dark bookends (planet hero, footer).
        ink: { DEFAULT: '#0C0B0A', soft: '#1B1917' },
        // Type on the dark bookends.
        bone: { DEFAULT: '#F6F3EE', muted: 'rgba(246,243,238,0.68)', faint: 'rgba(246,243,238,0.16)' },
        // Sampled from the Pluto logo orb.
        pluto: { blue: '#0B4A9E', cyan: '#0DCAF5', coral: '#FC3D26', cream: '#F3F1EC' },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      fontSize: {
        display: ['clamp(3.1rem, 8vw, 9.5rem)', { lineHeight: '0.94', letterSpacing: '-0.02em' }],
        title: ['clamp(2.25rem, 4.8vw, 5.25rem)', { lineHeight: '1.02', letterSpacing: '-0.015em' }],
      },
      letterSpacing: { label: '0.32em', mark: '0.4em' },
      transitionTimingFunction: { expo: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        'marquee-rtl': { to: { transform: 'translateX(50%)' } },
        caret: { '0%, 49%': { opacity: '1' }, '50%, 100%': { opacity: '0' } },
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        'marquee-rtl': 'marquee-rtl 60s linear infinite',
        caret: 'caret 0.9s steps(1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
