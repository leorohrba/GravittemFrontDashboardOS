import { apiWhatsapp, apiCRM, apiComments } from '@services/api'
import { handleAuthError } from '@utils'
import { message } from 'antd'

export const handleLogin = async (
  setQrCode,
  setShowQrCode,
  showQrCode = true,
) => {
  setQrCode(null)
  const session = await getOwnerProfile()

  const token = await generateToken(session)

  if (token) {
    const response = await startSession(
      session,
      token,
      setQrCode,
      setShowQrCode,
      showQrCode,
    )
    if (response) {
      await salvarConta(session, token)
    }
  }
}

async function waitForConnection(session, token, setShowQrCode) {
  try {
    const response = await apiWhatsapp.get(
      `/api/${session}/check-connection-session`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (response.data.status) {
      setShowQrCode(false)
      return true
    }

    await new Promise(resolve => setTimeout(resolve, 2000)) // Wait for 2 seconds before retrying
    return await waitForConnection(session, token, setShowQrCode) // Recursively call the function
  } catch (error) {
    console.log(error)
    message.error(error.message)
  }
  return false
}

const startSession = async (
  session,
  token,
  setQrCode,
  setShowQrCode,
  showQrCode = true,
) => {
  try {
    const response = await apiWhatsapp.post(
      `/api/${session}/start-session`,
      {
        waitQrCode: true,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    if (response.data.status !== 'CONNECTED') {
      return await getQrCode(
        session,
        token,
        setQrCode,
        setShowQrCode,
        showQrCode,
      )
    }
  } catch (error) {
    message.error(error.message)
  }
  return null
}

async function getQrCode(
  session,
  token,
  setQrCode,
  setShowQrCode,
  showQrCode = true,
) {
  try {
    const response = await apiWhatsapp.get(`/api/${session}/qrcode-session`, {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.data) {
      setQrCode(URL.createObjectURL(response.data))
    }
    if (showQrCode) {
      setShowQrCode(true)
    }
    return await waitForConnection(session, token, setShowQrCode)
  } catch (error) {
    message.error(error.message)
    return null
  }
}

const generateToken = async session => {
  try {
    const response = await apiWhatsapp.post(
      `/api/${session}/${process.env.UMI_WHATSAPP_SECRET_KEY}/generate-token`,
    )
    const newToken = response.data.token
    return newToken
  } catch (error) {
    console.log(error)
  }
  return null
}

const salvarConta = async (session, token) => {
  try {
    await apiComments.post('/api/ContaWhatsapp', {
      nomeSessao: session,
      token,
    })
  } catch (error) {
    handleAuthError(error)
  }
}

const getOwnerProfile = async () => {
  try {
    const response = await apiCRM.get('/api/crm/owner')

    const { data } = response

    if (data.isOk) {
      let { userName } = data
      if (userName.includes('.')) {
        userName = `${userName.replace('.', '_')}_session`
      } else userName += '_session'
      return userName.toUpperCase()
    }

    message.error(data.message)
    return null
  } catch (error) {
    handleAuthError(error)
  }
  return null
}
