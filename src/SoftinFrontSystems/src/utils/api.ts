import axios from 'axios'

let endpoint = '.dev'

export const apiLayoutGenerator = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/Gravittem/GeradorLayout`,
  headers: { Authorization: getAuthToken() },
})

export const apiCRM = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/Gravittem/CRM`,
  headers: { Authorization: getAuthToken() },
})

export const apiNotification = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/Notificacoes`,
  headers: { Authorization: getAuthToken() },
})

export const apiNewContract = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/contrato`,
  headers: { Authorization: getAuthToken() },
})

export const apiRegion = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/Gravittem/Regiao`,
  headers: { Authorization: getAuthToken() },
})

export const apiComments = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/comentarios`,
  headers: { Authorization: getAuthToken() },
})

export const apiAttachment = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/anexos`,
  headers: { Authorization: getAuthToken() },
})

export const apiSearch = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/pesquisas`,
  headers: { Authorization: getAuthToken() },
})

export const apiFinancial = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/financeiro`,
  headers: { Authorization: getAuthToken() },
})

export const apiGravittem = axios.create({
  baseURL: `https://${endpoint}.gravittem.com.br`,
  headers: { Authorization: getAuthToken() },
})

export const apiAttendance = axios.create({
  baseURL: `https://services${endpoint}.gravittem.com.br/gravittem/atendimento`,
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
