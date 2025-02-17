import { IOption } from './Optioninterface'

export interface IField {
  value: string
  label: string
  type: string
  options: IOption[]
  placeholder: string
}
