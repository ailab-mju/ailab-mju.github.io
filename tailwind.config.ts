import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        paper: 'var(--paper)',
        card: 'var(--card)',
        line: 'var(--line)',
        mute: 'var(--mute)',
        deep: 'var(--deep)',
        teal: 'var(--teal)',
      },
      fontFamily: {
        disp: ['var(--disp)'],
        body: ['var(--body)'],
        mono: ['var(--mono)'],
      },
      maxWidth: {
        w: 'var(--w)',
      },
    },
  },
  plugins: [],
};

export default config;
