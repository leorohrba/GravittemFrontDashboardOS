import { IOptions } from './OptionsInterface'

export interface ISearchOptions {
  value: string
  label: string
  placeholder: string
  type: string
  options?: IOptions[]
}
