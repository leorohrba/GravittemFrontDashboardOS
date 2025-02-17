export interface IFranchiseeVendor {
  id: number
  franchiseeId: number
  nome: string
  abreviado: string
  tipoDocumento: string
  documento: string
  endereco: string
  numero: string
  bairro: string
  cidade: string
  uf: string
  listaPrecoId: number
  listaPreco: string
  percentualDsctoMaximo: number
  percentualAcrescimoMaximo: number
  status: number
  statusDescricao: string
}
