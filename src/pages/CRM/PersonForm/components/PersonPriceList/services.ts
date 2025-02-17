import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message } from 'antd'
import { INewDiscountAllowance } from "../../interfaces/NewDiscountAllowanceInterface";

export async function postDiscountAllowance(
  data: INewDiscountAllowance[], 
  ownerId: number, 
  sellerId: number
) {
  const body = getBody(data, ownerId, sellerId)
  const discountAllowanceError = (data: { notifications: string }) =>
    message.error(
      data.notifications.length > 0
        ? data.notifications[0]
        : 'Não foi possível gerar alçada de desconto.',
    )
  try {
      const response = await apiCRM({
          method: 'POST',
          url: '/api/AlcadaDesconto',
          data: body
      })
      const { data } = response

      if(!data.isOk){
        discountAllowanceError(data)
      }
  } catch (error) {
      handleAuthError(error)
  }
}

export async function getPriceListOptions(setPriceListOptions: (priceListOptions: any[]) => void) {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: '/api/CRM/PriceList',
      })
      const { data } = response
      if (data.isOk) {
        setPriceListOptions(data.priceList)
      } else {
        message.error("Não foi possível obter lista de preço")
      }
    } catch (error) {
      handleAuthError(error)
    }
}

const getBody = (
  data: INewDiscountAllowance[], 
  ownerId: number,
  sellerId: number
) => {
  return data.filter((d: INewDiscountAllowance) => d?.isNew).map(d => ({
    ownerId: ownerId,
    indFranquiaVendedor: 2,
    franchiseeId: 0,
    sellerId: sellerId,
    percentualDsctoMaximo: getPercentField(d.percentualDsctoMaximo),
    percentualAcrescimoMaximo: getPercentField(d.percentualAcrescimoMaximo),
    listaPrecoId: d.listaPrecoId,
    status: true,
    id: typeof d?.id === 'string' ? null : d?.id
  }
))
}

const getPercentField = (value: string) => {
  if(value.length > 1) {
      return Number(parseFloat(value.slice(0, value.length).replace(',','.')).toFixed(2))
  } else {
      return Number(parseFloat(value).toFixed(2))
  }
}

export async function getPriceListData(
  setPriceListTableData: (priceListTableData: any[]) => void, 
  ownerId: number,
  sellerId: number
) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/AlcadaDescontoFranquia?IndFranquiaVendedor=2&OwnerId=${ownerId}&SellerId=${sellerId}`,
    })
    const { data } = response
    setPriceListTableData(data[0].vendedores)
  } catch (error) {
    handleAuthError(error)
  }
}

export async function deletePriceList(
  ids: number[],
  setPriceListTableData: (priceListData: any[]) => void,
  newRowState: any[],
  setSuccessDelete: (success: boolean) => void
) {
  const deleteError = () => message.error("Não foi possível deletar lista de preço")

  try {
    const response = await apiCRM({
      method: 'DELETE',
      url: `/api/AlcadaDesconto`,
      data: {
        ids: ids
      }
    })
    const { data } = response
    if (data.isOk) {
      setPriceListTableData(newRowState)
      setSuccessDelete(true)
    } else{
      deleteError()
    }
  } catch (error) {
    handleAuthError(error)
    deleteError()
  }
}

export async function getService(url:string, setState,params=null){
  try{
      const response = await apiCRM({
          method: 'GET',
          url: url,
          params:params
      })
      const { data } = response
      setState(data)
      return data
  }catch(error){
      handleAuthError(error)
  }
}
