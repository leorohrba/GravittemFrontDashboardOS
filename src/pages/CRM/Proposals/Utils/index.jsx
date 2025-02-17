import { getFranchiseDiscountScope } from '../service'
import { notification, Select } from 'antd'
const { Option } = Select

export async function validDiscount(percent, Owner, listPrice, jsonPercent) {
  let franchiseDiscountScope
  let nameJson = 'vendedores'

  franchiseDiscountScope = await getFranchiseDiscountScope(
    Owner,
    listPrice,
    Owner?.sellerId,
    2,
  )

  if (franchiseDiscountScope[0].vendedores.length === 0) {
    franchiseDiscountScope = await getFranchiseDiscountScope(
      Owner,
      listPrice,
      Owner?.parentOwnerId == Owner?.ownerId ? Owner?.sellerId : null,
      1,
    )
    nameJson = 'franquias'
  }
  const franquias = franchiseDiscountScope[0][nameJson]

  const validDiscount =
    franquias && franquias.length > 0
      ? percent > franquias[0][jsonPercent] && true
      : true

  return [validDiscount, franquias]
}

export function notificationWarning(description) {
  notification.warning({
    message: <h2>Atenção</h2>,
    description: description,
    placement: 'top',
  })
}

export function notificationError(description) {
  notification.error({
    message: <h2>Atenção</h2>,
    description: description,
    placement: 'top',
  })
}

export function renderOptions(state) {
  if (state && state.length > 0) {
    return state.map(d => (
      <Option key={d?.priceListId} value={d?.priceListId} data={d}>
        {d?.name}
      </Option>
    ))
  }
  return null
}
