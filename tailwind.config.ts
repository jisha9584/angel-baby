import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      // ─── Palette ────────────────────────────────────────────────────────
      colors: {
        cream:        '#FEF7ED',
        'warm-yellow':'#F9E4B7',
        'soft-blue':  '#C5DAED',
        'mint-green': '#C8E6C9',
        blush:        '#F4C2C2',
        'warm-brown': '#7C5C3F',
        'light-brown':'#A0856A',
        'card-bg':    '#FFFDF7',
        // shadcn CSS-variable tokens
        border:     'hsl(var(--border))',
        input:      'hsl(var(--input))',
        ring:       'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT:    'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT:    'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT:    'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT:    'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },

      // ─── Typography ─────────────────────────────────────────────────────
      fontFamily: {
        handwriting: ['Caveat', 'cursive'],
        body:        ['Nunito', 'sans-serif'],
        // Martian Mono: labels, nav, CTAs, dates — inspired by digibouquet
        display:     ['"Martian Mono"', 'monospace'],
      },

      // ─── Radius ─────────────────────────────────────────────────────────
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ─── Keyframes ──────────────────────────────────────────────────────
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.25' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.7', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
      },

      // ─── Animation shortcuts ────────────────────────────────────────────
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        float:            'float 6s ease-in-out infinite',
        twinkle:          'twinkle 3s ease-in-out infinite',
        'fade-in-up':     'fade-in-up 0.6s ease-out forwards',
        'soft-pulse':     'soft-pulse 2.5s ease-in-out infinite',
        shimmer:          'shimmer 2s linear infinite',
      },

      // ─── Box shadows ────────────────────────────────────────────────────
      boxShadow: {
        polaroid: '3px 3px 8px rgba(0,0,0,0.09), 6px 6px 16px rgba(0,0,0,0.05)',
        soft:     '0 4px 24px rgba(124,92,63,0.09)',
        hover:    '0 12px 36px rgba(124,92,63,0.15)',
        card:     '0 2px 12px rgba(124,92,63,0.07)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
