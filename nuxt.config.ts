export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss'],

  nitro: {
    preset: 'vercel',
  },

  runtimeConfig: {
    tursoUrl: process.env.TURSO_DATABASE_URL ?? '',
    tursoToken: process.env.TURSO_AUTH_TOKEN ?? '',
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'Sticker Swap Matcher',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Find your perfect sticker trades at events' },
        { name: 'theme-color', content: '#2563eb' },
      ],
    },
  },
})
