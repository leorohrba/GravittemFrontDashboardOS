import React, { useState, useEffect } from 'react'
import { Form, Select, Modal, InputNumber, Row, Col, Alert } from 'antd'
import { FieldType } from '../../interfaces/PriceListFieldTypeInterface'
import { INewDiscountAllowance } from '../../interfaces/NewDiscountAllowanceInterface'
import { getPriceListOptions, getService } from './services'
import PersonPriceListModalFooter from './PersonPriceListModalFooter'
import { IPriceListOptions } from '../../interfaces/PriceListOptionsInterface'
import { IAlcadaDiscount } from '@interfaces/CRM/AlcadaDiscount/AlcadaDiscountInterface'
import { IOwner } from '@interfaces/CRM/Person/OwnerInterface'
import { PersonPriceListFormProps } from '../../interfaces/PersonPriceListForm/PersonPriceListFormInterface'

const { Option } = Select

export default function PersonPriceListForm({
  visiblePriceListModal,
  canBeUpdated,
  savePriceList,
  editData,
  form,
  handleCancel,
  permissionPersonPriceList
}: PersonPriceListFormProps) {
  const [priceListOptions, setPriceListOptions] = useState<IPriceListOptions[]>([])
  const [owner, setOwner] = useState<IOwner | null>(null)
  const [alcadaDiscountFranchise, setAlcadaDiscountFranchise] = useState<IAlcadaDiscount[]>([])
  const disabledInputFranchise =
    alcadaDiscountFranchise[0]?.franquias?.length == 0 ||
    alcadaDiscountFranchise.length == 0
  const disabledInput = alcadaDiscountFranchise[0]?.franquias?.length == 0

  const handleOk = () => {
    form.validateFields().then((values: FieldType) => {
      const selectedPriceList = priceListOptions.find(
        pl => pl.priceListId === values.priceList,
      )
      const body: INewDiscountAllowance = {
        percentualDsctoMaximo: values.maxDiscount,
        percentualAcrescimoMaximo: values.maxAddition,
        listaPrecoId: values.priceList,
        listaPreco: selectedPriceList?.name || '',
        isNew: true,
        id:editData ? editData?.id : crypto.randomUUID() ,
      }

      savePriceList(body)
      handleCancel()
    })
  }

  const validMaxAndMin = async (priceListId: number) => {
    if (owner) {
      let params =    
      {
        IndFranquiaVendedor: 1,
        FranchiseeId: owner.franchiseeId,
        ListaPrecoId: priceListId,
        ChildOwnerId: owner.ownerId,
        OwnerId : owner.parentOwnerId,
        Status:1
      }
    await getService(
        '/api/AlcadaDescontoFranquia',
        setAlcadaDiscountFranchise,
        params,
      )
    }
  }

  const maximum = (name: string, json: string) => {
    return (_: any, value: number) => {
      const alcada = alcadaDiscountFranchise[0]?.franquias
      const maxDiscount = alcada.length > 0 && alcada[0][json]
     
      if ((value <= maxDiscount || maxDiscount === false) && value != null) {
        return Promise.resolve()
      }

      if (maxDiscount != null && maxDiscount !== false) {
        return Promise.reject(`${name} máximo permitido é de ${maxDiscount}`)
      } else {
        return Promise.reject(`Informe o ${name.toLowerCase()} máximo`)
      }
    }
  }

  useEffect(() => {
    if (editData != null) {        
    form.setFieldsValue({priceList:editData?.listaPrecoId, maxDiscount:editData?.percentualDsctoMaximo, maxAddition:editData?.percentualAcrescimoMaximo})
      validMaxAndMin(editData?.listaPrecoId)
    }  
  }, [owner])

  useEffect(() => {
    getPriceListOptions(setPriceListOptions)
  }, [])

  useEffect(() => {
    disabledInputFranchise && form.resetFields(['maxAddition', 'maxDiscount'])
  }, [disabledInputFranchise])

  useEffect(() => {
    if (visiblePriceListModal) {
      setAlcadaDiscountFranchise([])
      getService('/api/CRM/Owner', setOwner)
    }
  }, [visiblePriceListModal])
  
  return (
    <Modal
      title="Nova lista de preço"
      width="25rem"
      className="flex items-center justify-center"
      open={visiblePriceListModal}
      onCancel={handleCancel}
      footer={
        <PersonPriceListModalFooter
          isEdit={false}
          canBeUpdated={canBeUpdated}
          handleOk={handleOk}
          handleCancel={handleCancel}
          disabledInput={disabledInput}
        />
      }
    >
      {disabledInput && (
        <>
          <Alert
            message="Não possui alçada de desconto e acréscimo definidos. Entrar em contato com responsável."
            type="error"
            showIcon
          />
          <br />
        </>
      )}
      
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item<FieldType>
              label="Selecione a lista de preço"
              name="priceList"
              rules={[{ required: true, message: 'Informe a lista de preço' }]}
            >
              <Select onChange={validMaxAndMin} disabled={!permissionPersonPriceList}>
                {priceListOptions.map(pl => (
                  <Option key={pl.priceListId} value={pl.priceListId}>
                    {pl.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="Desconto máximo"
              name="maxDiscount"
              rules={[
                {
                  required: true,
                  validator: maximum('Desconto', 'percentualDsctoMaximo'),
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                disabled={permissionPersonPriceList ? disabledInputFranchise: true}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType>
              label="Margem de lucro máximo"
              name="maxAddition"
              rules={[
                {
                  required: true,
                  validator: maximum('Lucro', 'percentualAcrescimoMaximo'),
                },
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                disabled={permissionPersonPriceList ? disabledInputFranchise: true}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
