import { message } from 'antd'
import { handleAuthError } from '@utils'
import { apiComments } from '@services/api'
import moment from 'moment'

export const getMessages = async chat => {
  const response = await apiComments.get(`/api/whatsapp/${chat.id}/Mensagens`)
  return response.data
}

export const getChats = async entityId => {
  try {
    const response = await apiComments.get(
      `/api/Whatsapp?entidadeId=${entityId}`,
    )
    return response.data
  } catch (error) {
    handleAuthError(error)
    message.error('Não foi possível obter os comentários')
    return []
  }
}

export const getChat = async (
  startDate,
  person,
  entityId,
  tableName,
) => {
  return apiComments.post('/api/WhatsApp', {
    inicioPeriodo: moment(startDate).format('YYYY-MM-DDTHH:mm'),
    entidadeId: entityId?.toString(),
    destinatarioNome: person.contactName,
    destinatarioNumero: person.cellPhone,
    tableName,
  })
}
