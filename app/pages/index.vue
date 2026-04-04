<script setup>
// A instrução layout: false avisa o Nuxt: "Ei, renderize essa página pura, não coloque a barra lateral nem o cabeçalho do default.vue aqui".
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-warj-bg p-6">
    
    <div class="text-center">
      <img src="/warj_logo.png" class="h-20 w-auto mx-auto mb-6" alt="WARJ" >
      <h1 class="text-4xl md:text-5xl font-black text-warj-deep tracking-tighter mb-4">
        WARJ Insights
      </h1>
      <p class="text-lg font-medium text-warj-grey mb-8">
        Acesso ao sistema de Gestão e Análise de Dados.
      </p>
      
      <UButton 
        to="/dashboard" 
        size="xl" 
        class="bg-warj-neon text-warj-deep font-black px-10 shadow-lg hover:shadow-xl transition-all"
      >
        Acessar Sistema
      </UButton>
    </div>

  </div>
</template>