<template>
  <div class="flex flex-col gap-8 w-full font-sans">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-[#210B45]">Dashboard</h2>
        <p class="text-sm font-medium text-[#6C757D]">Visão geral e desempenho do sistema.</p>
      </div>
      
      <div class="flex items-center gap-3">
        <UInput 
          icon="i-lucide-calendar" 
          model-value="Jan 01, 2026 - Mar 30, 2026" 
          readonly 
          variant="outline"
          class="hidden sm:block shadow-sm"
        />
        <UButton 
          icon="i-lucide-download" 
          color="white" 
          variant="solid" 
          class="text-[#210B45] shadow-sm ring-1 ring-gray-200 hover:bg-gray-50 font-bold"
        >
          Relatório
        </UButton>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard 
        v-for="(stat, index) in stats" 
        :key="index" 
        class="border-none shadow-sm ring-1 ring-gray-100 hover:ring-[#6F42C1]/40 transition-all bg-white"
        :ui="{ body: 'p-5' }"
      >
        <div class="flex justify-between items-start">
          <div>
            <p class="text-[#6C757D] text-[11px] font-bold uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-black text-[#210B45]">{{ stat.value }}</p>
          </div>
          <div class="text-[#00D9A6] flex items-center text-xs font-black bg-[#00D9A6]/10 px-2.5 py-1 rounded-md">
            <UIcon :name="stat.trendIcon" class="mr-1 w-3.5 h-3.5" /> {{ stat.trend }}
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <UCard class="lg:col-span-2 border-none shadow-sm ring-1 ring-gray-100 bg-white">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-[#210B45] text-lg">Receita e Desempenho</h3>
            <USelectMenu 
              v-model="view" 
              :options="['Diário', 'Semanal', 'Mensal']" 
              size="sm" 
              class="w-32"
            />
          </div>
        </template>
        <div class="h-80 w-full relative">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </UCard>

      <UCard class="border-none shadow-sm ring-1 ring-gray-100 bg-white flex flex-col h-full">
        <template #header>
          <h3 class="font-bold text-[#210B45] text-lg">Atividade Recente</h3>
        </template>
        <div class="space-y-6">
          <div v-for="(activity, index) in recentActivity" :key="index" class="flex gap-4">
            <div class="mt-0.5">
              <div class="w-8 h-8 rounded-full bg-[#F8F9FA] flex items-center justify-center ring-1 ring-gray-200">
                <UIcon :name="activity.icon" class="w-4 h-4 text-[#6F42C1]" />
              </div>
            </div>
            <div>
              <p class="text-sm font-bold text-[#210B45]">{{ activity.title }}</p>
              <p class="text-xs font-medium text-[#6C757D]">{{ activity.desc }}</p>
              <p class="text-[10px] font-bold text-[#6C757D] mt-1 uppercase">{{ activity.time }}</p>
            </div>
          </div>
        </div>
        
        <template #footer>
          <UButton block variant="ghost" class="text-[#6F42C1] font-bold hover:bg-[#F8F9FA]">
            Ver todo o histórico
          </UButton>
        </template>
      </UCard>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js'

// Registro dos módulos do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

// Filtro do gráfico
const view = ref('Mensal')

// --- DADOS DOS KPIs ---
// Usando as cores estratégicas: Verde Neon para crescimento [cite: 81]
const stats = [
  { label: 'Receita Total', value: '$6F42C1', trend: '+15.2%', trendIcon: 'i-lucide-trending-up' },
  { label: 'Usuários Ativos', value: '1.350', trend: '+5.4%', trendIcon: 'i-lucide-users' },
  { label: 'Taxa de Conversão', value: '3.24%', trend: '+12.1%', trendIcon: 'i-lucide-mouse-pointer-click' },
  { label: 'NPS (Satisfação)', value: '94/100', trend: '+8.0%', trendIcon: 'i-lucide-smile' }
]

// --- DADOS DO FEED DE ATIVIDADE ---
const recentActivity = [
  { title: 'Novo usuário cadastrado', desc: 'Ana Souza finalizou o onboarding.', time: 'Há 5 minutos', icon: 'i-lucide-user-plus' },
  { title: 'Relatório exportado', desc: 'Willian exportou "Dados_Q1.csv".', time: 'Há 2 horas', icon: 'i-lucide-file-down' },
  { title: 'Meta atingida', desc: 'Ultrapassamos 1.000 acessos simultâneos.', time: 'Ontem às 14:30', icon: 'i-lucide-target' },
  { title: 'Sistema atualizado', desc: 'Patch v4.3.1 aplicado com sucesso.', time: 'Ontem às 02:00', icon: 'i-lucide-server' }
]

// --- CONFIGURAÇÃO DO GRÁFICO (CHART.JS) ---
// Usando as cores neutras e frias (Roxo Tecnológico) para a estrutura de dados [cite: 80, 83]
const chartData = {
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Crescimento de Receita',
      data: [65, 59, 80, 81, 56, 95, 110],
      borderColor: '#6F42C1', // Roxo Tecnológico [cite: 83]
      backgroundColor: 'rgba(111, 66, 193, 0.15)', // Fundo com opacidade
      borderWidth: 3,
      pointBackgroundColor: '#00D9A6', // Pontos em Verde Neon
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#00D9A6',
      fill: true,
      tension: 0.4 // Deixa a linha curvada/suave
    }
  ]
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#210B45', // Tooltip escuro (Roxo IA) [cite: 77]
      titleFont: { family: 'Public Sans', size: 13 },
      bodyFont: { family: 'Public Sans', size: 14, weight: 'bold' },
      padding: 12,
      displayColors: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: '#F8F9FA', drawBorder: false },
      ticks: { color: '#6C757D', font: { family: 'Public Sans', weight: 'bold' } }
    },
    x: {
      grid: { display: false, drawBorder: false },
      ticks: { color: '#6C757D', font: { family: 'Public Sans', weight: 'bold' } }
    }
  }
}
</script>