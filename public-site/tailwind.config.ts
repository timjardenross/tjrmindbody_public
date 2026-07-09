import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1a2f52',
          deep: '#0f1e38',
        },
        blue: {
          DEFAULT: '#2d6fa8',
          light: '#3a85c8',
          pale: '#eaf3fb',
        },
        offwhite: '#f7f9fc',
        border: '#dce6f0',
        ink: {
          DEFAULT: '#1a2035',
          mid: '#445066',
          light: '#6b7b99',
        },
        gold: '#c9a84c',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'ui-serif', 'Georgia', 'serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1a2035',
            '--tw-prose-headings': '#1a2f52',
            '--tw-prose-links': '#2d6fa8',
            '--tw-prose-bold': '#1a2f52',
            '--tw-prose-quotes': '#445066',
            '--tw-prose-quote-borders': '#c9a84c',
            maxWidth: '70ch',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
