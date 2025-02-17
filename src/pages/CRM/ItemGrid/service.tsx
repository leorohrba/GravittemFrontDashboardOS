import { handleAuthError } from '@utils'
import { message } from 'antd'
import { apiCRM } from '@services/api'
import { INewDiscountAllowance } from '../PersonForm/interfaces/NewDiscountAllowanceInterface'
import React, { Dispatch, SetStateAction } from 'react'
import { IPriceList } from '@interfaces/CRM/PriceListInterface'
import { IField } from '@interfaces/FieldInterface'

export async function postItemPriceList(
  body: INewDiscountAllowance,
  setSuccess: Dispatch<SetStateAction<boolean>>,
) {
  setSuccess((prevEvent: boolean) => (prevEvent = true))
  const messageError = (data: { notifications: string[] }) =>
    message.error(
      data.notifications.length > 0
        ? data.notifications[0]
        : 'Não foi possível salvar! Verifique as mensagens de validação.',
    )

  try {
    const response = await apiCRM({
      method: 'PUT',
      url: '/api/CRM/ItemPriceList',
      data: body,
    })
    const { data } = response

    if (data.isOk) {
      message.success('Salvo com sucesso')
    } else {
      messageError(data)
    }
    setSuccess((prevEvent: boolean) => (prevEvent = false))
  } catch (error) {
    handleAuthError(error)
    setSuccess((prevEvent: boolean) => (prevEvent = false))
  }
}

export async function getService(
  url: string,
  setDataState: Dispatch<SetStateAction<IPriceList>>,
) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: url,
    })
    const { data } = response
    setDataState(data)
    return data
  } catch (error) {
    handleAuthError(error)
  }
}
export async function getMaterialTypes(
  campoData: IField[],
  setSearchOptions: React.Dispatch<React.SetStateAction<IField[]>>) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/crm/materialtype`,
      params: { status: 1 },
    })
    const { data } = response

    if (data.isOk) {
      const i = campoData.findIndex(x => x.value == 'materialtypeid')
      if (i >= 0 && data.materialTypes?.length > 0) {
        data.materialTypes.map(d => {
          campoData[i].options.push({
            label: d.description,
            value: d.description,
          })
          return true
        })
        setSearchOptions([...campoData])
      }
    } else {
      message.error(data.message)
    }
  } catch (error) {
    handleAuthError(error)
  }
}

export async function getDefaultOptions(setSearchOptions: React.Dispatch<React.SetStateAction<IField[]>>) {
  try {
    const response = await apiCRM({
      method: 'GET',
      url: `/api/CRM/Campos`,
    })
    const { data } = response

    if (data) {
      console.log(data, 'data')
      setSearchOptions(data)
      await getMaterialTypes(data,setSearchOptions)
    } else {
      message.error(data.message)
    }
  } catch (error) {
    handleAuthError(error)
  }
}