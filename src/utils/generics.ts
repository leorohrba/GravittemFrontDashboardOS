import { message } from 'antd'
import axios from 'axios'
import { handleAuthError } from '@utils'

export const axiosType = axios.create()

/** Função de enviarDados para o servidor
 *  feita para substituir a sendDataToServer.
 *   Nas APIs do Back acaba tendo problema com a lista do C#
 *   se utilizar a sendDataToServer
 */

export const sendDataToServerList = async (
  apiHost,
  apiMethod = 'post',
  apiUrl,
  errorMessage,
  body = {},
  returnData = false,
  showSuccessMessage = true,
) => {
  try {
    const response = await apiHost[apiMethod](apiUrl, body)
    const { data } = response

    if (data.isOk) {
      showSuccessMessage &&
        message.success(
          apiMethod === 'put'
            ? 'Dados atualizados com sucesso'
            : 'Dados salvos com sucesso',
        )
      if (returnData) {
        return data
      }
      return true
    }
    if (data.notificacoes && data.notificacoes.length > 0) {
      data.notificacoes.forEach(n => message.error(n.mensagem, 5))
    } else if (data.mensagem) {
      message.error(data.mensagem)
    } else {
      message.error(errorMessage)
    }
  } catch (error) {
    handleAuthError(error)
    if (error.response.data?.notificacoes?.length > 0) {
      message.error(error.response.data.notificacoes?.[0].mensagem)
    } else if (error.response.data?.mensagem) {
      message.error(error.response.data.mensagem)
    } else {
      message.error(errorMessage)
    }
    return false
  }
  return false
}

/** Função que cria enums
 *  @param {Array <string>} received - Um array com nome dos enums
 *  @param {string} nameprop - Nome da propriedade do enum
 */
export function createEnums(received, nameprop) {
  return received.map((r, index) => ({ id: index + 1, [nameprop]: r }))
}

/** Função que cria enums e o id a partir de um objeto
 *  @param {Array <object>} received - Um array com os enums
 * @param {string} receivedName - propriedade com o nome do enum
 *  @param {string} nameprop - Nome da propriedade do enum
 *  @param {string} propid - Nome da propriedade com id
 * @param {string} customProp? - Propriedade customizada
 * @param {string} customPropName? - Nome da propriedade customizada
 */
export function createEnumsObjectId(
  received,
  receivedName,
  nameprop,
  propid,
  customProp,
  customPropName,
) {
  return received.map(r =>
    customProp
      ? {
          id: r[propid],
          [nameprop]: r[receivedName],
          [customProp]: r[customPropName],
        }
      : { id: r[propid], [nameprop]: r[receivedName] },
  )
}

/** Função pra achar um enum
 *  @param {Array } array - Um array com os enums
 *  @param data = Dado para procurar no array de enum
 *  @param name - Nome da propriedade a ser usada para procurar
 */
export function enumFind(array, data, name) {
  const value = array.find(index => index.id === data[name])
  return value.name
}

export function notNullUndefined(value) {
  return value !== null && value !== undefined
}
