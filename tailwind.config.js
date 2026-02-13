/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}'],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        orange: {
          css: {
            '--tw-prose-body': theme('colors.gray.800'),
            '--tw-prose-headings': theme('colors.orange.600'),
            '--tw-prose-links': theme('colors.orange.500'),
            '--tw-prose-bold': theme('colors.orange.700'),
            '--tw-prose-quotes': theme('colors.orange.600'),
            '--tw-prose-code': theme('colors.orange.800'),
            '--tw-prose-pre-bg': theme('colors.orange.900'),
            '--tw-prose-pre-code': theme('colors.orange.400'),

            h1: { fontWeight: '700', letterSpacing: '-0.02em' },
            h2: {
              fontWeight: '600',
              borderBottom: `2px solid ${theme('colors.orange.400')}`,
              paddingBottom: '0.25em',
            },
            blockquote: {
              borderLeftColor: theme('colors.orange.400'),
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: theme('colors.orange.400'),
              padding: '0.2em 0.4em',
              borderRadius: theme('borderRadius.md'),
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              padding: theme('spacing.4'),
              borderRadius: theme('borderRadius.lg'),
            },
          },
        },
      }),
    },
  },
};
