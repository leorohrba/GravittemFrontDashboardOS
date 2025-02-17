export interface ISalesFunnel extends IFunnelStage {
  canBeDeleted:boolean
  canBeUpdated: boolean
  funnelStage: IFunnelStage
  title: string
  type: number,
}

export interface IFunnelStage {
  funnelStageId: number
  icon: string
  isDeleted?: boolean
  name: string
  order: number
  salesFunnelId: number
}
