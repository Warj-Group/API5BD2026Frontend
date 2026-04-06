import { api } from '../utils/api'
import type {
  DashboardProjetoResponse,
  DashboardResumoResponse
} from '~/types/dashboard'

export const dashboardService = {
  getResumo: () =>
    api.get<DashboardResumoResponse>('/dashboard/resumo'),

  getProjetos: () =>
    api.get<DashboardProjetoResponse[]>('/dashboard/projetos')
}