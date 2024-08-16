import postcss from './postcss.config'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss','@vueuse/nuxt','@nuxtjs/i18n'],
  postcss,
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
  // i18n:{
  //  vueI18n:'./locel' 
  // }
})
