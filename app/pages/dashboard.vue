<template>
  <div class="flex flex-col gap-8 w-full font-sans">
    
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-[#6F42C1] rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-[#6C757D] font-medium">Carregando dashboard...</p>
      </div>
    </div>

    <div v-else class="flex flex-col gap-8">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js'
import { dashboardService } from '~/services/dashboardService'
import type { DashboardResumoResponse, DashboardProjetoResponse } from '~/types/dashboard'

// Registro dos módulos do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

// Filtro do gráfico
const view = ref('Mensal')

// Estados de dados
const loading = ref(true)
const resumo = ref<DashboardResumoResponse | null>(null)
const projetos = ref<DashboardProjetoResponse[]>([])

// --- KPIs derivados dos dados do backend ---
const stats = computed(() => {
  if (!resumo.value) return []

  return [
    {
      label: 'Total de Projetos',
      value: resumo.value.total_projetos,
      trend: '+0%',
      trendIcon: 'i-lucide-trending-up'
    },
    {
      label: 'Custo Total',
      value: `R$ ${(Number(resumo.value.custo_total_geral) / 1000).toFixed(1)}k`,
      trend: `R$ ${Number(resumo.value.custo_medio_por_projeto).toFixed(2)}/proj.`,
      trendIcon: 'i-lucide-wallet'
    },
    {
      label: 'Total de Horas',
      value: Number(resumo.value.total_horas_geral),
      trend: 'h',
      trendIcon: 'i-lucide-clock'
    },
    {
      label: 'Custo de Materiais',
      value: `R$ ${(Number(resumo.value.custo_materiais_geral) / 1000).toFixed(1)}k`,
      trend: '+Variável',
      trendIcon: 'i-lucide-box'
    }
  ]
})

// --- Atividade recente derivada dos projetos ---
const recentActivity = computed(() => {
  const projetosList = projetos.value || []
  if (projetosList.length === 0) return []

  return projetosList.slice(0, 4).map(projeto => ({
    title: projeto?.nome_projeto || 'Projeto sem nome',
    desc: `Status: ${projeto?.status || 'N/A'} | Responsável: ${projeto?.responsavel || 'N/A'}`,
    time: `R$ ${Number(projeto?.custo_total || 0).toFixed(2)}`,
    icon: 'i-lucide-briefcase'
  }))
})

// --- Dados do gráfico derivados dos projetos ---
const chartData = computed(() => {
  const projetosList = projetos.value || []
  if (projetosList.length === 0) {
    return {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
      datasets: [
        {
          label: 'Custo por Projeto',
          data: [0],
          borderColor: '#6F42C1',
          backgroundColor: 'rgba(111, 66, 193, 0.15)',
          borderWidth: 3,
          pointBackgroundColor: '#00D9A6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#00D9A6',
          fill: true,
          tension: 0.4
        }
      ]
    }
  }

  const labels = projetosList.slice(0, 7).map((p, i) => `P${i + 1}`)
  const data = projetosList.slice(0, 7).map(p => Number(p?.custo_total || 0))

  return {
    labels: labels.length > 0 ? labels : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Custo por Projeto',
        data: data.length > 0 ? data : [0],
        borderColor: '#6F42C1',
        backgroundColor: 'rgba(111, 66, 193, 0.15)',
        borderWidth: 3,
        pointBackgroundColor: '#00D9A6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00D9A6',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#210B45',
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

// --- Carrega dados do backend ---
onMounted(async () => {
  try {
    loading.value = true
    const [resumoData, projetosData] = await Promise.all([
      dashboardService.getResumo(),
      dashboardService.getProjetos()
    ])

    // Tratamento defensivo para diferentes formatos de resposta da API
    resumo.value = resumoData?.data || resumoData || null
    projetos.value = Array.isArray(projetosData?.data) ? projetosData.data :
                    Array.isArray(projetosData) ? projetosData : []
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error)
    // Em caso de erro, garantir que os arrays não sejam undefined
    projetos.value = []
    resumo.value = null
  } finally {
    loading.value = false
  }
})
</script>