export interface DashboardProjetoResponse {
  id_projeto: number
  codigo_projeto: string | null
  nome_projeto: string | null
  responsavel: string | null
  status: string | null
  custo_hora: number
  total_horas: number
  custo_materiais: number
  custo_horas: number
  custo_total: number
}

export interface DashboardResumoResponse {
  total_projetos: number
  custo_total_geral: number
  custo_medio_por_projeto: number
  total_horas_geral: number
  custo_materiais_geral: number
  custo_horas_geral: number
}