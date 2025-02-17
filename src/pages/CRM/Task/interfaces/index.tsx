export interface IData {
  canBeUpdated?: boolean
  companyId:number
  companyShortName?: string
  durationDays?
  expectedDuration?
  expectedDateTime?:string
  franchiseeId
  franchiseeOwnerId?
  franchiseeName?
  hourFullDay?
  hourFullDayMail?
  isAllDay?: boolean
  isBatchGenerated: boolean
  isFranchisee?: boolean
  observation?:string
  proposalId:number
  proposalNumber?:number
  realizedDate?: string
  sellerId:number
  sellerName?:string
  subject?:string
  taskId?:number
  taskTypeIcon?:string
  taskTypeId?:number
  taskTypeName?:string
  time: number
  timeMail: number
  timeType: number
  timeTypeMail: number
}

export interface ISellerSource {
  label?: string
  value?: number
}

export interface ICurrentTaskType {
  icon?: string
  id?: number
  name?: string
}

export interface ITaskOwner {
  companyId: number
  isOk: boolean
  isProposalRateLocation: boolean
  ownerFullName: string
  ownerId: number
  ownerProfile: string
  ownerProfileId: number
  ownerShortName: string
  showCRMActivationDate: boolean
  showFieldApartmentQuantityCRM: boolean
  userId: number
  userName: string
  franchiseeId
}


export interface ITaskTypesSaved {
  label:string
  render
  value:number
}

export interface ITaskType {
  canBeUpdated:boolean
  icon:string
  isDeleted:boolean
  name:string
  taskType:number
}