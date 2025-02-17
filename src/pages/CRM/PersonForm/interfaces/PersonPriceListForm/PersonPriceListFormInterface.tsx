import { FormInstance } from 'antd'
import { INewDiscountAllowance } from '../NewDiscountAllowanceInterface'

export interface PersonPriceListFormProps {
  visiblePriceListModal: boolean
  canBeUpdated: boolean
  savePriceList: (body: INewDiscountAllowance) => void
  editData: INewDiscountAllowance
  form: FormInstance
  handleCancel: () => void
  permissionPersonPriceList: boolean
}
