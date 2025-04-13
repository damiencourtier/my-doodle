// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: false,

    timeline: {
      enabled: false
    }
  },
  modules: ['@nuxt/ui', 'nuxt-lucide-icons','@nuxtjs/color-mode'],
  css: ['~/assets/css/main.css'],
})