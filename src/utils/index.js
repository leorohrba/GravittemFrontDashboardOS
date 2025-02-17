/* eslint-disable no-control-regex */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable no-param-reassign */
import { apiSearch } from '@services/api'
import { Alert, message, notification, Spin } from 'antd'
import image2base64 from 'image-to-base64/browser'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { formatMessage, getLocale } from 'umi-plugin-react/locale'

export function NoVisualize({ userPermissions }) {
  return userPermissions === null || userPermissions === undefined ? (
    <div className="container">
      <Spin style={{ marginLeft: '50%', marginTop: '10%' }} size="large" />
    </div>
  ) : (
    <Alert
      className="mx-8 my-8"
      message={<h3>Usuário não tem permissão para visualização dos dados!</h3>}
      type="error"
    />
  )
}

export function getEnumDefaultOption(
  enums,
  entity,
  property,
  status,
  filterValues,
) {
  return enums
    .find(x => x.entidade === entity && x.propriedade === property)
    ?.valores?.filter(
      x =>
        (!status || (x.statusValidos && x.statusValidos.includes(status))) &&
        (!filterValues || (filterValues && filterValues.includes(x.valor))),
    ).length > 0
    ? enums
        .find(x => x.entidade === entity && x.propriedade === property)
        .valores.filter(
          x =>
            (!status ||
              (x.statusValidos && x.statusValidos.includes(status))) &&
            (!filterValues || (filterValues && filterValues.includes(x.valor))),
        )[0].valor
    : undefined
}

export function enumExists(enums, entity, property, status, value) {
  return (
    enums
      .find(x => x.entidade === entity && x.propriedade === property)
      ?.valores?.findIndex(
        x =>
          x.valor === value &&
          (!status || (x.statusValidos && x.statusValidos.includes(status))),
      ) >= 0
  )
}

export function formatCnpjCpf(value) {
  if (!value) {
    return null
  }

  const cnpjCpf = value.replace(/\D/g, '')

  if (cnpjCpf.length === 11) {
    return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4')
  }

  return cnpjCpf.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
    '$1.$2.$3/$4-$5',
  )
}

export function companyIsFranchisee(id, source) {
  if (!source) {
    return false
  }
  const company = source.find(x => x.value === id)
  return company?.isFranchisee || false
}

export function setParamValues(params, searchOptions, tags, exception) {
  searchOptions.map(searchOption => {
    if (!(exception && exception.find(x => x === searchOption.value))) {
      if (searchOption.type === 'rangeDate') {
        setRangeDateParamValue(
          params,
          searchOption.value,
          tags,
          searchOption.paramValueDateFormat,
        )
      } else {
        params[searchOption.value] = tags
          .filter(s => s.fieldValue === searchOption.value)
          .map(tag => tag.searchFieldValue)
          .join('|')
      }
    }
    return true
  })
}

function setRangeDateParamValue(params, fieldValue, tags, dateFormat) {
  if (!dateFormat) {
    dateFormat = 'YYYY-MM-DD'
  }
  const paramName1 = `start${fieldValue}`
  const paramName2 = `end${fieldValue}`
  const tag = tags.find(s => s.fieldValue === fieldValue)
  if (tag) {
    params[paramName1] = tag.searchFieldValue[0].format(dateFormat)
    params[paramName2] = tag.searchFieldValue[1].format(dateFormat)
  } else {
    params[paramName1] = null
    params[paramName2] = null
  }
}

export function showApiMessages(data) {
  if (data.mensagens && data.mensagens.length > 0) {
    const messageBody = (
      <React.Fragment>
        {data.mensagens.map((message, index) => (
          <React.Fragment>
            {!!index && <br />}
            <span>{message}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )
    message.error(messageBody)
  } else if (data.mensagem) {
    message.error(data.mensagem)
  } else if (data.message) {
    message.error(data.message)
  }
}

export function showApiNotifications(data) {
  if (data.notificacoes && data.notificacoes.length > 0) {
    const messageBody = (
      <React.Fragment>
        {data.notificacoes.map((notification, index) => (
          <React.Fragment>
            {!!index && <br />}
            <span>{notification.mensagem}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )

    notification.error({
      message: 'Atenção!',
      description: messageBody,
    })
  }
}

export function useCombinedRefs(...refs) {
  const targetRef = React.useRef()
  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return
      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current
      }
    })
  }, [refs])
  return targetRef
}

export function hasPermission(userPermissions, permission) {
  try {
    return userPermissions.find(o => o.name === permission) !== undefined
  } catch {
    return false
  }
}

export function customDateTimeFormat(value, format) {
  if (!value) {
    return null
  }

  const result = moment(value).format(format)
  return result
}

export const exportExcelFormat = screenName =>
  `${moment().format('DD-MM-YYYY-HH-mm')}_${screenName}`

export function getProcessId() {
  const winProcessId = new URLSearchParams(window.location.search).get(
    'processId',
  )
  const processId =
    winProcessId !== null ? winProcessId : localStorage.getItem('processId')

  localStorage.setItem('processId', processId)

  return processId
}

export async function getPermissions(processNames = '') {
  const userPermissions = []
  const processId = getProcessId()

  if (!processId) {
    notification.error({
      message: 'Permissão negada',
      description:
        'Não foi possível carregar permissões de acesso, tente sair e entrar na sua conta novamente',
    })

    return userPermissions
  }

  return getPermissionsById(processId, processNames)
}

export async function getPermissionsById(processId, processNames = '') {
  let userPermissions = []

  if (!axios.defaults.headers.common.Authorization) {
    getAuthToken()
  }

  const url = `${
    process.env.UMI_API_HOST_PERMISSION
  }/api/permission?processId=${processId}${
    processNames ? `&processName=${processNames}` : ''
  }`
  try {
    const permissionsResponse = await axios.get(url)
    userPermissions = permissionsResponse.data
  } catch (error) {
    handleAuthError(error)
  }
  return userPermissions
}

export function getAuthToken() {
  const token =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('token')
      : null

  const authTokenData = token !== null ? token : localStorage.getItem('token')

  localStorage.setItem('token', authTokenData)

  axios.defaults.headers.common.Authorization = authTokenData
}

export function handleAuthError(error) {
  if (
    error.response !== undefined &&
    (error.response.status === 403 || error.response.status === 401)
  ) {
    notification.error({
      message: 'Autenticação negada',
      description:
        'Ocorreu um erro de autenticação, tente sair e entrar na sua conta novamente',
    })
  } else {
    notification.error({
      message: 'Servidor não encontrado',
      description: 'Não foi possível conectar ao servidor, contate o suporte',
    })
  }
}

export const sendDataToServer = async (
  apiHost,
  apiMethod = 'post',
  apiUrl,
  errorMessage,
  body = {},
  returnData = false,
  showSuccessMessage = true,
) => {
  try {
    const response = await apiHost[apiMethod](apiUrl, {
      ...body,
    })
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

export const getInitialSearch = async (
  screen,
  microservice,
  setTags,
  startSearch,
  defaultEmpty = false,
) => {
  try {
    const response = await apiSearch.get(
      `/api/Pesquisa/PesquisaInicial?Tela=${screen}&MicroserviceOrigem=${microservice}`,
    )
    const search = response.data?.condicoes
    const isCustom = response.data?.usandoConsultaPersonalizada
    if (search && isCustom) {
      const newQuery = search.map(c => {
        const isRange = c.tipo === 'rangeDate'
        return {
          fieldName: c.descricao || c.propriedade,
          fieldValue: c.propriedade,
          searchField: c.valor,
          searchFieldValue: isRange
            ? [moment(c.chave.split('|')[0]), moment(c.chave.split('|')[1])]
            : c.chave || c.valor,
          fieldType: c.tipo || 'search',
        }
      })
      setTags(newQuery)
      startSearch(newQuery)
    } else if (!defaultEmpty) {
      startSearch()
    }
    sessionStorage.setItem('originPath', screen)
  } catch (error) {
    handleAuthError(error)
    message.error('Não foi possível obter a pesquisa padrão')
  }
}

export function useGetColumnsConfiguration(apiHost, tableName, defaultColumns) {
  const [loadingColumns, setLoadingData] = useState(true)
  const [columns, setColumns] = useState([])
  const getColumns = async () => {
    setLoadingData(true)
    try {
      const response = await apiHost.get(
        `/api/ConfiguracaoColunas/${tableName}`,
      )
      let columnData = response.data?.configuracoes
      if (columnData) {
        columnData = columnData
          .filter(c => c.ativo)
          .sort((a, b) => a.ordem - b.ordem)
        const newColumnArray = []
        // eslint-disable-next-line array-callback-return
        columnData.map((c, index) => {
          const col = defaultColumns.find(
            col => c.nomeColuna === col.nomeColuna,
          )
          col && newColumnArray.splice(index, 0, col)
        })
        setColumns(newColumnArray)
      } else {
        setColumns(defaultColumns.filter(col => col.padrao))
      }
    } catch (error) {
      setColumns(defaultColumns.filter(col => col.padrao))
      message.error('Não foi possível obter a configuração de colunas')
    }
    setLoadingData(false)
  }
  useEffect(() => {
    getColumns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableName])
  return [columns, loadingColumns, getColumns]
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function formatTaskDuration(value) {
  let duration = `${value} minutos`

  if (value > 59 && value < 1440) {
    const hours = Math.floor(value / 60)
    duration = hours.toString()
    const minutes = value - hours * 60
    if (minutes < 10) {
      duration += `:0${minutes.toString()}`
    } else {
      duration += `:${minutes.toString()}`
    }
    duration += ' hs'
  } else if (value >= 1440) {
    const days = Math.round(value / (24 * 60))
    duration = days.toString()
    if (duration > 1) {
      duration += ' dias'
    } else {
      duration += ' dia'
    }
  }

  return duration
}
export function formatTaskDateTime(date, isAllDay) {
  let dateFormated = ''
  try {
    if (isAllDay) {
      dateFormated = moment(date).format('DD MMM')
    } else {
      dateFormated = moment(date).format('DD MMM HH:mm')
    }
  } catch {
    dateFormated = date
  }

  return dateFormated
}

export function customSort(a, b) {
  return !a ? -1 : !b ? 1 : a.toString().localeCompare(b)
}

export function removeAccent(newStringComAcento) {
  let string = newStringComAcento
  const mapaAcentosHex = {
    a: /[\xE0-\xE6]/g,
    A: /[\xC0-\xC6]/g,
    e: /[\xE8-\xEB]/g,
    E: /[\xC8-\xCB]/g,
    i: /[\xEC-\xEF]/g,
    I: /[\xCC-\xCF]/g,
    o: /[\xF2-\xF6]/g,
    O: /[\xD2-\xD6]/g,
    u: /[\xF9-\xFC]/g,
    U: /[\xD9-\xDC]/g,
    c: /\xE7/g,
    C: /\xC7/g,
    n: /\xF1/g,
    N: /\xD1/g,
  }

  // eslint-disable-next-line guard-for-in
  for (const letra in mapaAcentosHex) {
    const expressaoRegular = mapaAcentosHex[letra]
    string = string.replace(expressaoRegular, letra)
  }

  return string
}

export function validateByMask(value) {
  const valueWithoutMask = removeNonDigit(value)
  return !(value.indexOf('_') >= 0 && valueWithoutMask.length > 0)
}
export function removeNonDigit(value) {
  try {
    return value.replace(/\D/g, '')
  } catch (error) {
    return false
  }
}

export function removeMask(value) {
  if (!value) {
    return ''
  }
  const result = removeNonDigit(value)
  return result === null ? '' : result
}

export const getImgToBase64 = async img => {
  const result = await image2base64(img).then(response => {
    return `data:image/png;base64,${response}`
  })
  return result || ''
}

export function formatPhone(phone) {
  try {
    if (!phone) {
      // não formatar se for nulo
      return phone
    }
    if (
      phone.indexOf('(') >= 0 ||
      phone.indexOf(')') >= 0 ||
      phone.indexOf('-') >= 0
    ) {
      return phone // entende que o telefone já está formatado
    }

    phone = phone.replace(/\D/g, '') // Remove tudo o que não é dígito
    const { length } = phone
    phone = phone.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    phone = phone.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos

    if (length === 8) {
      // entende que o telefone não possui o DDD e retira o parênteses
      phone = phone.split('(').join('')
      phone = phone.split(')').join('')
      phone = phone.split(' ').join('')
    }
  } catch (error) {
    console.log(error)
  }

  return phone
}

export const formatToCPF = cpf => {
  if (!cpf) {
    return cpf
  }

  cpf = cpf.replace(/\W/, '')
  cpf = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(
    9,
    11,
  )}`

  return cpf
}

export function formatZipCode(number) {
  let value = ''

  if (number === '' || number === 0 || number === null) {
    return value
  }
  number = removeNonDigit(number)
  value = zeroesLeft(number.toString(), 8)
  return value.replace(/(\d{5})(\d{3})/g, '$1-$2')
}

export function zeroesLeft(value, digits) {
  if (value.length < digits) {
    let zeroes = ''
    for (let i = 0; i < digits - value.length; i++) {
      zeroes += '0'
    }
    value = zeroes + value
  }
  return value
}

export function formatCellPhone(cellPhone) {
  try {
    if (!cellPhone) {
      // não formatar se for nulo
      return cellPhone
    }
    if (
      cellPhone.indexOf('(') >= 0 ||
      cellPhone.indexOf(')') >= 0 ||
      cellPhone.indexOf('-') >= 0
    ) {
      return cellPhone // entende que o celular já está formatado
    }

    cellPhone = cellPhone.replace(/\D/g, '') // Remove tudo o que não é dígito
    const { length } = cellPhone
    cellPhone = cellPhone.replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses em volta dos dois primeiros dígitos
    cellPhone = cellPhone.replace(/(\d)(\d{4})$/, '$1-$2') // Coloca hífen entre o quarto e o quinto dígitos

    if (length === 9) {
      // entende que o celular não possui o DDD e retira o parênteses
      cellPhone = cellPhone.split('(').join('')
      cellPhone = cellPhone.split(')').join('')
      cellPhone = cellPhone.split(' ').join('')
    }
  } catch (error) {
    console.log(error)
  }

  return cellPhone
}

export function replaceAll(str, find, replace) {
  try {
    return str.split(find).join(replace)
  } catch {
    return str
  }
}

export function addBrlCurrencyToNumber(number) {
  // Create our number formatter.
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return formatter.format(number)
}

export function formatNumber(number, fractionDigits) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'decimal',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(number)
}

export function buildAddressLine1(name, number, neighborhood) {
  let result = name
  if (number) {
    result += `, ${number}`
  }
  if (neighborhood) {
    result += ` - ${neighborhood}`
  }
  return result
}

export function buildAddressLine2(cityName, stateAbbreviation) {
  let result = cityName
  if (stateAbbreviation) {
    result += ` - ${stateAbbreviation}`
  }
  return result
}

export function getLocaleCurrency() {
  return getLocale() === 'pt-BR' ? 'BRL' : 'USD'
}

export function getLocaleDateFormat() {
  return getLocale() === 'pt-BR' ? 'DD/MM/YYYY' : 'MM/DD/YYYY'
}

export function getLocalePrefix() {
  return getLocale() === 'pt-BR' ? 'R$ ' : '$ '
}

export function getLocaleDecimalSeparator() {
  return getLocale() === 'pt-BR' ? ',' : '.'
}

export function getLocaleThousandSeparator() {
  return getLocale() === 'pt-BR' ? '.' : ','
}

export function fieldsValidationToast(err) {
  if (Object.keys(err).length === 1) {
    message.error(
      formatMessage({
        id: 'errorSaveSingleField',
      }),
    )
  } else {
    message.error(
      formatMessage({
        id: 'errorSaveMultipleFields',
      }),
    )
  }
}

export function timeToDecimal(t) {
  const arr = t.split(':')
  const dec = parseInt((arr[1] / 6) * 10, 10)

  return parseFloat(`${parseInt(arr[0], 10)}.${dec < 10 ? '0' : ''}${dec}`)
}

export function minuteToHourMinute(t) {
  let minutes = t
  const hours = Math.floor(minutes / 60)
  minutes -= hours * 60
  return `${zeroesLeft(hours.toString(), 2)}:${zeroesLeft(
    minutes.toString(),
    2,
  )}`
}

export function getMinutesDuration(duration) {
  if (!duration) {
    return null
  }
  let minutes = parseInt(duration.format('mm'), 10)
  const hours = parseInt(duration.format('HH'), 10)
  minutes += hours * 60
  return minutes
}

export const iconFile = (url, fileName, extension) => {
  if (extension === '.xls' || extension === '.xlsx') {
    return (
      <i
        className="mr-2 fa fa-file-excel-o fa-3x"
        style={{ color: '#1f6f45' }}
      />
    )
  }
  if (extension === '.doc' || extension === '.docx') {
    return (
      <i
        className="mr-2 fa fa-file-word-o fa-3x"
        style={{ color: '#2c5695' }}
      />
    )
  }
  if (extension === '.pdf') {
    return (
      <i className="mr-2 fa fa-file-pdf-o fa-3x" style={{ color: '#d74c42' }} />
    )
  }
  if (extension && extension.match(/.(jpg|jpeg|png|gif|bmp|svg)$/i)) {
    return <img src={url} height={64} width={64} alt={fileName} />
  }
  return <i className="mr-2 fa fa-file-o fa-3x" style={{ color: '#3182ce' }} />
}

export function isEmail(email) {
  const re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  return re.test(String(email).toLowerCase())
}

export function isPhoneNumber(phone) {
  const regex = new RegExp(
    '^((1[1-9])|([2-9][0-9]))((3[0-9]{3}[0-9]{4})|(9[0-9]{3}[0-9]{5}))$',
  )
  return regex.test(phone)
}

export function showNotifications(notifications) {
  if (notifications.length > 0) {
    const messageBody = (
      <React.Fragment>
        {notifications.map((notification, index) => (
          <React.Fragment>
            {!!index && <br />}
            <span>{notification}</span>
          </React.Fragment>
        ))}
      </React.Fragment>
    )

    notification.error({
      message: 'Atenção!',
      description: messageBody,
    })
  }
}

export const dateToUTC = date => {
  const tz = moment.tz.guess() || 'UTC'
  return moment(date)
    .tz(tz)
    .format()
}

export function isObjEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}
export function removeNumberFormatting(value) {
  if (value === null || value === undefined) {
    return null
  }
  value = replaceAll(value, 'R$', '')
  value = replaceAll(value, '%', '')
  value = replaceAll(value, ' ', '')
  value = replaceAll(value, '.', '')
  value = replaceAll(value, ',', '.')
  value = replaceAll(value, '_', '')
  if (value === '') {
    value = null
  }

  return value
}

export function normalizeString(str) {
  return str
    .normalize('NFD') // Decompor os caracteres acentuados
    .replace(/[\u0300-\u036f]/g, '') // Remover os acentos
    .toLowerCase() // Converter para minúsculas
}
