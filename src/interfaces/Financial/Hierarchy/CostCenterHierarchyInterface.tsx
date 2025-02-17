export interface ICostCenterHierarchy {
  id: string
  nrMaximoHierarquiaCentroCusto: number
  centroCusto: ICostCenterGrouper[]
  status: number
  dataAtualizacao: Date
  usuarioId: string
  usuarioNome: string
}

export interface ICostCenterGrouper {
  hierarquiaId: string
  id: string
  codigo: string
  descricao: string
  nrNivelHierarquia: number
  centroCusto: ICostCenterGrouper[] | null | any
}
