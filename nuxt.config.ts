// nuxt.config.ts
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 }, 
  modules: ['@nuxt/eslint', '@nuxt/ui'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  
  // Identidade Visual WARJ conforme o Guia [cite: 9, 10, 77]
  ui: {
    primary: 'green', // Mapeado para o Verde Neon nas ações [cite: 10, 77]
    gray: 'slate'
  },

  app: {
    head: {
      title: 'WARJ - API 5',
      meta: [{ name: 'theme-color', content: '#210B45' }]
    }
  },

  compatibilityDate: '2025-01-15'
})