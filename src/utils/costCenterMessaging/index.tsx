import {
  PostConstCenter,
  getCostCenter,
} from '@services/costCenterMessaging/service'

async function prepareBody(constCenter: IConstCenter) {
  const body: IConstCenterBody = {
    centroCustoId: constCenter.id,
    descricao: constCenter.descricao,
    status: constCenter.status,
  }
  return await body
}

export async function messageCostCenter(CostCenterId) {
  const constCenter = await getCostCenter(CostCenterId)
  const costCenterBody = await prepareBody(constCenter)
  costCenterBody && (await PostConstCenter(costCenterBody))
}
