import { apiCRM, apiComments } from '@services/api'
import { handleAuthError, showNotifications } from '@utils'
import { message } from 'antd'
import { ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'

export const getEmailSent = async (emailSentId, setLoading, setEditData) => {
  setLoading(true)
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/CRM/emailSent`,
      params: { emailSentId },
    })
    const { data } = response
    setLoading(false)
    if (data.isOk) {
      if (data.emailSent.length === 0) {
        message.error('E-mail não encontrado!')
      } else {
        setEditData(data.emailSent[0])
      }
    } else {
      message.error(data.message)
    }
  } catch (error) {
    setLoading(false)
    handleAuthError(error)
  }
}

export const sendEmail = async (
  form,
  emailData,
  proposalId,
  messageModel,
  fileList,
  setLoading,
  clearForm,
  onChange,
  blob = null,
) => {
  setLoading(true)
  const formData = new FormData()
  formData.append('from', form.getFieldValue('from'))
  formData.append('to', form.getFieldValue('to'))
  if (form.getFieldValue('cc')) {
    formData.append('cc', form.getFieldValue('cc'))
  }
  if (form.getFieldValue('cco')) {
    formData.append('cco', form.getFieldValue('cco'))
  }
  formData.append('subject', form.getFieldValue('subject'))
  formData.append('body', emailData)
  formData.append('proposalId', proposalId)

  if (messageModel?.messageModelItemEmailId) {
    formData.append(
      'messageModelItemEmailId',
      messageModel?.messageModelItemEmailId,
    )
  }

  if (blob) formData.append('files', blob, `Proposta comercial.pdf`)

  fileList.map(file => formData.append('files', file))

  try {
    const response = await apiCRM({
      method: 'POST',
      url: `/api/CRM/SendEmail`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    setLoading(false)
    const { data } = response
    if (data.isOk) {
      clearForm()
      if (onChange !== undefined) {
        onChange()
      }
      message.success('E-mail enviado com sucesso!')
    } else if (data.validationMessageList.length > 0) {
      showNotifications(data.validationMessageList)
    } else {
      showNotifications([data.message])
    }
  } catch (error) {
    setLoading(false)
    message.error(error)
    handleAuthError(error)
  }
}

export const sendWhatsapp = async (
  form,
  proposalId,
  fileList,
  setLoading,
  clearForm,
  onChange,
  blob = null,
) => {
  setLoading(true)
  const formData = new FormData()
  formData.append('destinatario', form.getFieldValue('to'))
  formData.append('mensagem', form.getFieldValue('message'))
  formData.append('negocioId', proposalId)

  if (blob) formData.append('arquivos', blob, `Proposta comercial.pdf`)

  fileList.map(file => formData.append('arquivos', file))

  try {
    const response = await apiComments({
      method: 'POST',
      url: `/api/Whatsapp/Enviar`,
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    setLoading(false)
    const { data } = response
    if (data.isOk) {
      clearForm()
      if (onChange !== undefined) {
        onChange()
      }
      message.success('Mensagem enviada com sucesso!')
    } else if (data.notificacoes?.length > 0) {
      showNotifications(data.notificacoes.map(n => n.mensagem))
    }
  } catch (error) {
    setLoading(false)
    message.error(error)
    showNotifications([error.data.message])
    handleAuthError(error)
  }
}

export const generateEmail = async (
  modelId,
  proposalId,
  form,
  setLoading,
  setTextContent,
) => {
  setLoading(true)
  const params = {
    messageModelItemEmailId: modelId,
    baseId: proposalId.toString(),
    processId: 706,
    generateTablesAsImage: true,
  }
  try {
    const response = await apiCRM({
      method: 'POST',
      url: `/api/crm/generateEmail`,
      data: params,
    })
    setLoading(false)
    const { data } = response
    if (data.isOk) {
      form.setFieldsValue({ subject: data.emailGenerated.subject })

      if (data.emailGenerated.body) {
        const contentBlock = htmlToDraft(data.emailGenerated.body)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
            contentBlock.entityMap,
          )
          const editorState = EditorState.createWithContent(contentState)
          setTextContent(editorState)
        } else {
          setTextContent(EditorState.createEmpty())
        }
      } else {
        setTextContent(EditorState.createEmpty())
      }
    } else if (data.validationMessageList.length > 0) {
      showNotifications(data.validationMessageList)
    } else {
      showNotifications([data.message])
    }
  } catch (error) {
    setLoading(false)
    handleAuthError(error)
  }
}

export const downloadAttachment = async (id, fileName, setLoading) => {
  setLoading(true)
  try {
    const response = await apiCRM({
      url: `/api/crm/DownloadEmailAttachmentSent`,
      method: 'GET',
      params: { emailAttachmentSentId: id },
      responseType: 'blob', // important
    })
    setLoading(false)
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    message.error(error)
    setLoading(false)
    handleAuthError(error)
  }
}
