import { apiWhatsapp, apiComments } from '@services/api'
import { handleAuthError } from '@utils'

export const getWhatsappAccount = async () => {
  try {
    const response = await apiComments.get('/api/ContaWhatsapp')
    return response.data
  } catch (error) {
    handleAuthError(error)
    return null
  }
}

export const getPhone = async (session, token) => {
  try {
    const response = await apiWhatsapp.get(`/api/${session}/get-phone-number`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data.response
  } catch (error) {
    handleAuthError(error.message)
    return null
  }
}

export const downloadAttachment = async attachment => {
  try {
    const response = await apiComments({
      url: `/api/whatsapp/baixaranexo`,
      method: 'GET',
      params: { filePath: attachment.filePath },
      responseType: 'blob', // important
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', attachment.fileName)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.log(error)
    handleAuthError(error)
  }
}
