import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Design system — verbatim from _docs/transcript_iq_design_system_v1.html
        mint: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        ink: { DEFAULT: '#09090B', 2: '#27272A' },
        paper: { DEFAULT: '#FAFAF9', 2: '#F4F4F5' },
        slate: { DEFAULT: '#A1A1AA', 2: '#52525B' },
        mist: '#71717A',

        // Semantic CSS-variable aliases (theme-aware, used by shadcn primitives)
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        border: 'var(--border)',
        'border-2': 'var(--border-2)',
        accent: {
          DEFAULT: 'var(--accent)',
          deep: 'var(--accent-deep)',
          bright: 'var(--accent-bright)',
        },

        // Button-specific tokens (mode-aware: light=mint-500→mint-400, dark=mint-600→mint-400)
        'btn-primary': {
          DEFAULT: 'var(--btn-primary)',
          hover: 'var(--btn-primary-hover)',
          fg: 'var(--btn-primary-fg)',
        },

        // shadcn semantic bridges — map shadcn's semantic names onto our tokens
        background: 'var(--bg)',
        foreground: 'var(--ink)',
        card: { DEFAULT: 'var(--surface)', foreground: 'var(--ink)' },
        popover: { DEFAULT: 'var(--surface)', foreground: 'var(--ink)' },
        primary: { DEFAULT: 'var(--btn-primary)', foreground: 'var(--btn-primary-fg)' },
        secondary: { DEFAULT: 'var(--surface-2)', foreground: 'var(--ink)' },
        muted: { DEFAULT: 'var(--surface-2)', foreground: 'var(--mist)' },
        destructive: { DEFAULT: '#EF4444', foreground: '#FFFFFF' },
        input: 'var(--border)',
        ring: 'var(--accent)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Geist Mono', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        // display scale
        'display-xl': ['72px', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '600' }],
        'display-l': ['56px', { lineHeight: '1.05', letterSpacing: '-0.035em', fontWeight: '600' }],
        'display-m': ['44px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '500' }],
        'display-s': ['32px', { lineHeight: '1.15', letterSpacing: '-0.025em', fontWeight: '500' }],
      },
      borderRadius: {
        DEFAULT: '8px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        cta: '0 8px 24px -8px rgba(52, 211, 153, 0.32)',
        'card-hover': '0 12px 40px -12px rgba(0, 0, 0, 0.2)',
        modal: '0 24px 64px -16px rgba(0, 0, 0, 0.4)',
        focus: '0 0 0 3px var(--accent-glow)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        fast: '150ms',
        base: '200ms',
        slow: '320ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.92)' },
        },
        'shine': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shine': 'shine 3s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
