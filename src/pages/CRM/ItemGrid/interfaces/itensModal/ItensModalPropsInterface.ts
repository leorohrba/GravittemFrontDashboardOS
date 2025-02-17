import { FormInstance } from 'antd'

export interface IItensModalProps {
  visibleModal: boolean
  formModal: FormInstance
  handlerCancelModal: () => void
  onFinish: () => void
  selectedRowKeys: string[]
  spin: boolean
}
