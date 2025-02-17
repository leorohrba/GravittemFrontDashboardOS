import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message } from 'antd'

export const findAddress = async (): Promise<IGetAddressData> => {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/crm/TipoEndereco`,
    })

    const { data } = response

    if (!data.isOk) {
      message.error(data.message)
    }

    return data
  } catch (error) {
    handleAuthError(error)
  }
}
