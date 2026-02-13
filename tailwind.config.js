import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,ts,md,mdx}'],
  theme: {
    extend: {
      typography: {
        orange: {
          css: {
            '--tw-prose-body': '#1f2937',
            '--tw-prose-headings': '#f97316',
            '--tw-prose-links': '#fb923c',
            '--tw-prose-bold': '#ea580c',

            h1: {
              fontWeight: '800',
              letterSpacing: '-0.02em',
              color: '#ea580c',
            },
            h2: {
              color: '#f97316',
              borderBottom: '2px solid #fed7aa',
              paddingBottom: '0.3rem',
              marginTop: '2em',
            },
            h3: {
              color: '#fb923c',
            },
            code: {
              backgroundColor: '#fff7ed',
              color: '#c2410c',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#1f2937',
              color: '#f9fafb',
            },
            blockquote: {
              borderLeftColor: '#fb923c',
              fontStyle: 'italic',
              color: '#4b5563',
            },
            'li::marker': {
              color: '#fb923c',
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};
