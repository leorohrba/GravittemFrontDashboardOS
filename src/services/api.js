import axios from 'axios'

export const apiLayoutGenerator = axios.create({
  baseURL: process.env.UMI_API_LAYOUT_GENERATOR,
  headers: { Authorization: getAuthToken() },
})

export const apiCRM = axios.create({
  baseURL: process.env.UMI_API_HOST_CRM,
  headers: { Authorization: getAuthToken() },
})

export const apiNotification = axios.create({
  baseURL: process.env.UMI_API_HOST_NOTIFICATION,
  headers: { Authorization: getAuthToken() },
})

export const apiNewContract = axios.create({
  baseURL: process.env.UMI_API_HOST_NEW_CONTRACT,
  headers: { Authorization: getAuthToken() },
})

export const apiServices = axios.create({
  baseURL: process.env.UMI_API_HOST_SERVICES,
  headers: { Authorization: getAuthToken() },
})


export const apiRegion = axios.create({
  baseURL: process.env.UMI_API_HOST_REGION,
  headers: { Authorization: getAuthToken() },
})

export const apiComments = axios.create({
  baseURL: process.env.UMI_API_HOST_COMMENT,
  headers: { Authorization: getAuthToken() },
})

export const apiWhatsapp = axios.create({
  baseURL: process.env.UMI_API_HOST_WHATSAPP,
})

export const apiAttachment = axios.create({
  baseURL: process.env.UMI_API_HOST_ATTACHMENT,
  headers: { Authorization: getAuthToken() },
})

export const apiSearch = axios.create({
  baseURL: process.env.UMI_API_HOST_SEARCH,
  headers: { Authorization: getAuthToken() },
})

export const apiFinancial = axios.create({
  baseURL: process.env.UMI_API_FINANCIAL,
  headers: { Authorization: getAuthToken() },
})

export const apiGravittem = axios.create({
  baseURL: process.env.UMI_API_HOST_GRAVITTEM,
  headers: { Authorization: getAuthToken() },
})

export const apiAttendance = axios.create({
  baseURL: process.env.UMI_API_HOST_ATTENDANCE,
  headers: { Authorization: getAuthToken() },
})

export const apiChecklist = axios.create({
  baseURL: process.env.UMI_API_HOST_CHECKLIST,
  headers: { Authorization: getAuthToken() },
})

export const apiContract = axios.create({
  baseURL: process.env.UMI_API_HOST_CONTRACT,
  headers: { Authorization: getAuthToken() },
})

function getAuthToken() {
  const token =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('token')
      : null

  const authTokenData = token !== null ? token : localStorage.getItem('token')
  localStorage.setItem('token', authTokenData)
  return authTokenData
}
