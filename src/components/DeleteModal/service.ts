import { handleAuthError } from '@utils'
import { message } from 'antd'
import { AxiosInstance } from 'axios'

export async function deleteItem(
  selectedRows,
  serviceApi: AxiosInstance,
  api: string,
  setState: (visible: boolean) => void,
) {
  try {
    const response = await serviceApi({
      method: 'DELETE',
      url: `${api}`,
      data: selectedRows,
    })
    const { data } = response
    if (data.isOk) {
      message.success('Excluído com sucesso')
      setState(true)
    } else {
      message.error(
        data.notifications.length > 0
          ? data.notifications[0]
          : 'Não foi possível excluir! Verifique as mensagens de validação.',
      )
      setState(false)
    }
  } catch (error) {
    handleAuthError(error)
    setState(false)
  }
}
