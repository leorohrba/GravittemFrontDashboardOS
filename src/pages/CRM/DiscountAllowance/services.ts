import { ISearchField } from '@interfaces/CRM/DiscountAllowance/SearchFieldInterface'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message } from 'antd'
import { SetStateAction } from 'react'

export async function getSearchOptions(
  setSearchOptions: {
    (value: SetStateAction<ISearchField[]>): void
    (arg0: any): void
  },
  setLoadingSearchOptions: (loadingSearchOptions: boolean) => void,
  ownerId: string,
) {
  setLoadingSearchOptions(true)
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/Campos?cownerId=${ownerId}`,
    })

    const { data } = response
    const renamedData = renameData(data)

    setSearchOptions(renamedData)
    setLoadingSearchOptions(false)
  } catch (error) {
    handleAuthError(error)
    setLoadingSearchOptions(false)
  }

  function renameData(data: ISearchField[]) {
    return data.map((item: ISearchField) => {
      const newItem = { ...item }

      if (newItem.value === 'Franqueado') {
        newItem.value = 'FranchiseeId'
      }
      return newItem
    })
  }
}

export async function getTableData(
  setTableData,
  setIsFranchisee,
  ownerId,
  params,
  setLoadingTableData,
) {
  if (ownerId) {
    setLoadingTableData(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/AlcadaDescontoFranquia?OwnerId=${ownerId}&IndFranquiaVendedor=1`,
        params,
      })
      const { data } = response
      const dataSource = data[0].franquias.map(item => {
        return {
          ...item,
          key: crypto.randomUUID(),
        }
      })
      setTableData(dataSource)
      setIsFranchisee(data[0].franquias != null)
      setLoadingTableData(false)
    } catch (error) {
      handleAuthError(error)
      setLoadingTableData(false)
    }
  }
}

export async function getService(url, setDataState, targetField) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: url,
    })
    const { data } = response
    setDataState(data[targetField])
    return data
  } catch (error) {
    handleAuthError(error)
  }
}

export async function saveDiscountAllowance(
  body,
  setVisibleModal,
  form,
  addAnother = false,
) {
  const messageError = (data: { notifications: string }) =>
    message.error(
      data.notifications.length > 0
        ? data.notifications[0]
        : 'Não foi possível gerar alçada de desconto.',
    )

  try {
    const response = await apiCRM({
      method: 'POST',
      url: '/api/AlcadaDesconto',
      data: body,
    })
    const { data } = response

    if (data.isOk) {
      message.success('Alçada de desconto gerado com sucesso')
      setVisibleModal(addAnother)
      form.resetFields()
    } else {
      messageError(data)
    }
  } catch (error) {
    handleAuthError(error)
  }
}
