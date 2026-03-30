<template>
  <div class="flex min-h-screen font-sans bg-warj-bg">
    <aside class="w-64 bg-warj-deep text-white flex flex-col shadow-xl z-20">
      <div class="p-6 flex items-center gap-3 border-b border-white/10">
        <img src="/WARJ_Logo.png" class="h-8 w-auto" alt="WARJ" />
        <span class="text-xl font-black tracking-tighter">WARJ</span>
      </div>
      
      <nav class="flex-1 px-4 py-6 space-y-2">
        <ULink 
          to="/dashboard" 
          class="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/5"
          active-class="bg-warj-tech text-white shadow-lg" 
        >
          <UIcon name="i-lucide-layout-dashboard" class="w-5 h-5" />
          <span class="font-medium">Dashboard</span>
        </ULink>
        
        <ULink 
          to="/users" 
          class="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/5"
          active-class="bg-warj-tech text-white shadow-lg"
        >
          <UIcon name="i-lucide-users" class="w-5 h-5" />
          <span class="font-medium">Usuários</span>
        </ULink>
      </nav>

      <div class="p-4 border-t border-white/10">
        <UButton @click="handleLogout" variant="ghost" color="white" block icon="i-lucide-log-out" class="hover:bg-white/10 transition-colors">
          Sair
        </UButton>
      </div>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between z-10">
        
        <h2 class="text-warj-deep font-black text-lg tracking-wide uppercase">
          WARJ Insights
        </h2>
        
        <UDropdownMenu :items="profileItems" :ui="{ content: 'w-48' }">
          <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-bold text-warj-deep">William</p>
              <p class="text-[10px] font-bold text-warj-grey uppercase">Administrador</p>
            </div>
            <UAvatar src="/WARJ_Logo_git.png" size="sm" alt="Foto do Usuário" class="ring-2 ring-warj-tech/20" />
          </div>
        </UDropdownMenu>

      </header>
      
      <div class="flex-1 overflow-y-auto p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// --- FUNÇÃO CENTRALIZADA DE LOGOUT ---
const handleLogout = () => {
  // 1. Futuramente: Limpar cookies, localStorage (ex: localStorage.removeItem('token'))
  // 2. Futuramente: Chamar endpoint do backend para invalidar sessão, se necessário
  
  console.log("Realizando logout centralizado e limpando sessão...")
  
  // 3. Redireciona o usuário
  navigateTo('/login')
}

// --- OPÇÕES DO MENU DROPDOWN ---
const profileItems = ref([
  [
    {
      label: 'Configurações',
      icon: 'i-lucide-settings',
      to: '#' // Rota futura
    }
  ],
  [
    {
      label: 'Sair',
      icon: 'i-lucide-log-out',
      onSelect: handleLogout // Agora ele chama a função em vez de apenas linkar
    }
  ]
])
</script>