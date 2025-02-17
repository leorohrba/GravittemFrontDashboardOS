import { ICostCenterHierarchy } from '@interfaces/Financial/Hierarchy/CostCenterHierarchyInterface'
import { apiFinancial,apiNewContract } from '@services/api'
import { handleAuthError } from '@utils'
import { AxiosInstance } from 'axios'
import { Dispatch, SetStateAction } from 'react'

export async function getGrouper(
  setState: Dispatch<SetStateAction<ICostCenterHierarchy>>,
) {
  try {
    const response = await apiFinancial({
      method: 'GET',
      url: 'api/hierarquiaCentroCusto/Agrupador',
    })
    setState(response.data || [])
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getService(
  url: string,
  setState: Dispatch<SetStateAction<any>> = null,
  setLoading: Dispatch<SetStateAction<boolean>> = null,
  api: AxiosInstance = apiNewContract,
  campoJson = null,
) {
  try {
    setLoading && setLoading(true)
    const response = await api({
      method: 'GET',
      url: url,
    })
    setState &&
      setState(campoJson ? response.data?.[campoJson] : response.data || [])
    setLoading && setLoading(false)
    return await response.data
  } catch (error) {
    setLoading && setLoading(true)
    handleAuthError(error)
  }
}
