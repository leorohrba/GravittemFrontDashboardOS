import { apiFinancial, apiNewContract } from '@services/api'
import { handleAuthError } from '@utils'
import { message } from 'antd'

export async function getCostCenter(CostCenterId) {
  try {
    const response = await apiFinancial({
      method: 'GET',
      url: `api/CentroCusto/${CostCenterId}`,
    })
    const { data } = response
    return data
  } catch (error) {
    handleAuthError(error)
  }
}

export async function PostConstCenter(costCenterBody) {
  try {
    const response = await apiNewContract({
      method: 'POST',
      url: `/api/CentroCusto`,
      data: costCenterBody,
    })
    const { data } = response

    if (!data.isOk) {
      message.error(
        data.mensagem ||
          'Não foi possível salvar! Verifique as mensagens de validação.',
      )
    }
  } catch (error) {
    handleAuthError(error)
  }
}
