import { apiFinancial } from '@services/api'
import { exportExcelFormat, handleAuthError } from '@utils'

export const exportExcel = async (
  nome,
  filtros,
  colunas,
  valores,
  nomeArquivo,
  setLoadingExport,
) => {
  setLoadingExport(true)
  try {
    const body = {
      nomeRelatorio: nome,
      filtros,
      colunas,
      valores,
    }
    const response = await apiFinancial({
      url: `/api/Excel`,
      method: 'POST',
      responseType: 'blob',
      data: {
        ...body,
      },
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${exportExcelFormat(nomeArquivo)}.xlsx`)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    handleAuthError(error)
  }
  setLoadingExport(false)
}
