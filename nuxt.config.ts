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

  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'vue-chartjs',
        'chart.js'
      ]
    }
  },

  app: {
    head: {
      title: 'WARJ Insights',
      htmlAttrs: {
        lang: 'pt-BR'
      },
      meta: [
        { name: 'theme-color', content: '#210B45' }, // Roxo Profundo na barra do navegador
        { name: 'description', content: 'WARJ Insights - Plataforma de Gestão e Análise de Dados.' } // Descrição para o navegador
      ],
      link: [
        // O arquivo favicon.ico DEVE estar na pasta /public
        { rel: 'icon', type: 'image/x-icon', href: '/warj.ico' }
      ]
    }
  },

  compatibilityDate: '2025-01-15'
})