import { apiFinancial } from '@services/api'
import { getImgToBase64, handleAuthError } from '@utils'
import { message } from 'antd'
import { useEffect, useState } from 'react'

export function useSearchOptions({ apiHost, screenName }) {
  const [searchOptions, setSearchOptions] = useState([])
  const [loadingSearchOptions, setLoadingSearchOptions] = useState(true)

  useEffect(() => {
    const getSearchOptions = async () => {
      try {
        const response = await apiHost.get(`/api/${screenName}/Campos`)
        setSearchOptions(response.data)
        setLoadingSearchOptions(false)
      } catch (error) {
        handleAuthError(error)
        message.error('Não foi possível obter os campos da pesquisa')
      }
    }
    getSearchOptions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [searchOptions, loadingSearchOptions]
}
export function useGetTableData(
  { apiHost, screenName },
  searchQuery,
  urlTags = '[]',
  tags = [],
) {
  const [tableData, setTableData] = useState({})
  const [loadingTableData, setLoadingTableData] = useState(true)

  useEffect(() => {
    const getTableData = async () => {
      setLoadingTableData(true)
      try {
        const response = await apiHost.get(`/api/${screenName}${searchQuery}`)
        setTableData(response.data)
        setLoadingTableData(false)
      } catch (error) {
        handleAuthError(error)
        message.error('Não foi possível obter os dados da tabela')
      }
    }
    if (urlTags !== '[]' && tags.length > 0) {
      getTableData()
    } else if ((!urlTags || urlTags === '[]') && tags.length === 0) {
      getTableData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, screenName])

  return [tableData, loadingTableData]
}

export function useGetDataFromServer(
  apiHost,
  apiUrl,
  errorMessage,
  getOnMount,
  dataStarterValue = [],
) {
  const [loadingData, setLoadingData] = useState(true)
  const [data, setData] = useState(dataStarterValue)
  const getDataFromServer = async () => {
    setLoadingData(true)
    if (apiUrl) {
      try {
        const response = await apiHost.get(apiUrl)
        setData(response.data)
      } catch (error) {
        handleAuthError(error)
        message.error(errorMessage)
      }
    }
    setLoadingData(false)
  }
  useEffect(() => {
    getOnMount && getDataFromServer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOnMount])
  return [data, loadingData, getDataFromServer]
}

export async function getLoginData(setData) {
  try {
    const response = await apiFinancial({
      method: 'GET',
      url: `/api/Empresa/LogoEUsuario`,
    })
    const { data } = response
    if (data) {
      setData({
        empresa: data.empresa,
        logo:
          data.logo !== null
            ? `data:image/png;base64,${data.logo}`
            : await getImgToBase64(
                require(`@assets/images/companyLogo/emptyLogo.png`),
              ),
        usuario: data.usuario,
      })
    }
  } catch (error) {
    setData({
      empresa: '',
      logo: await getImgToBase64(
        require(`@assets/images/companyLogo/emptyLogo.png`),
      ),
      usuario: '',
    })
  }
}
