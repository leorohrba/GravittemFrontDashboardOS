import { IOption } from './OptionInterface'

export interface ISearchField {
  value: string
  label: string
  type: string
  options: IOption[]
}
