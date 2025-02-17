import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message } from 'antd'

export async function getFranchiseDiscountScope(
  owner,
  listPrice = null,
  sellerId,
  IndFranquiaVendedor,
) {
  let url = `/api/AlcadaDescontoFranquia?IndFranquiaVendedor=${IndFranquiaVendedor}&FranchiseeId=${
    owner?.franchiseeId
  }&${listPrice ? 'ListaPrecoId=' + listPrice : ''}`

  if (owner?.parentOwnerId !== owner?.ownerId) {
    url += `&ChildOwnerId=${owner?.ownerId}`
  }

  if (sellerId) {
    url += `&SellerId=${sellerId}&Status=${1}&OwnerId=${owner?.ownerId}`
  } else {
    url += `&Status=${1}&OwnerId=${owner?.parentOwnerId}`
  }

  try {
    const response = await apiCRM({
      method: 'GET',
      url: url,
    })

    const { data } = response

    return data
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getService(url, setState) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: url,
    })
    const { data } = response
    setState(data)
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getFederativeUnits() {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: '/api/UnidadeFederativa?PaisId=1&CodigoIbgePais=1058',
    })

    return response
  } catch (error) {
    handleAuthError(error)
  }
}

export async function updatePriceProposalItems(
  proposalId,
  tableSelectedRowKeys,
  refreshData = null,
  setLoading = null,
  createHistory,
  onChange,
) {
  const dateHistoryBody = {
    proposalHistories: [
      {
        proposalHistoryId: 0,
        proposalId,
        type: 'Proposal',
        title: 'Valores atualizados com base na lista de preço',
        action: 'Include',
      },
    ],
  }
  setLoading && setLoading(true)

  try {
    const response = await apiCRM({
      method: 'PUT',
      url: `/api/crm/PriceProposalItem`,
      data: { proposalId, proposalItemIds: tableSelectedRowKeys },
    })

    setLoading && setLoading(false)
    const { data } = response

    if (!data.isOk) {
      message.error(data.message)
    }

    refreshData && refreshData()
    createHistory(dateHistoryBody, onChange)
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getProposalHistories(
  proposalId,
  setProposalHistory,
  setLoading = null,
) {
  const updateLoading = boolean => {
    setLoading && setLoading(boolean)
  }

  updateLoading(true)
  try {
    const response = await apiCRM({
      method: 'POST',
      url: `/api/crm/historiesByProposalId`,
      data: { proposalId },
    })

    updateLoading(false)

    const { data } = response

    if (data.isOk) {
      setProposalHistory(data.proposalHistories)
    } else {
      message.error(data.message)
    }
  } catch (error) {
    message.error('Não foi possível obter o histórico dos negócios')
    updateLoading(false)
    handleAuthError(error)
  }
}
