import React, { FC, useEffect, useState } from 'react'
import { Button, Modal, Row, Col, Form,  Select, Spin } from 'antd'
import { getService } from '../service'
import { IPriceList } from '@interfaces/CRM/PriceListInterface'
import { IItensModalProps } from '../interfaces/itensModal/ItensModalPropsInterface'

const ItensModal:FC<IItensModalProps> = props => {
  const {
    visibleModal,
    formModal,
    handlerCancelModal,
    onFinish,
    selectedRowKeys,
    spin
  } = props
  const { Option } = Select
  const [listPriceChange, setListPriceChange] = useState<number>(1)
  const [listPrice, setListPrice] = useState<IPriceList[]>([])
  
  useEffect(() => {
    listPriceChange == 1 && formModal.setFieldsValue({ listPrice : null })
  },[listPriceChange])

  useEffect(() => {
    getService('api/crm/pricelist', setListPrice)
    setListPriceChange(1)
  }, [visibleModal])

  return (
    <Modal
      title={`Editar em lote (${selectedRowKeys.length})`}
      visible={visibleModal}
      destroyOnClose
      centered
      onCancel={handlerCancelModal}
      width="35%"
      footer={
        <>
          <Button onClick={handlerCancelModal} className="ml-3">
            Cancelar
          </Button>
          <Button
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
            }}
            htmlType="submit"
            form={"ItensPriceLisForm"}

            className="ml-3"
          >
            Salvar
          </Button>
        </>
      }
    >
      <Spin spinning={spin}>
        <Form form={formModal} layout="vertical" onFinish={onFinish} id='ItensPriceLisForm'>
          <Row style={{ width: '100%' }}>
            <Col style={{ width: '100%' }}>
              <Form.Item label="Lista de preço" name="alter">
                <Select
                  defaultValue={listPriceChange}
                  onChange={e => setListPriceChange(e)}
                >
                  <Option value={1}>Manter valor existente</Option>
                  <Option value={2}>Substituir valor existente com...</Option>
                </Select>
              </Form.Item>
              {listPriceChange === 2 && (
                <Form.Item
                  name="listPrice"
                  rules={[
                    {
                      required: true,
                      message: 'Selecione uma lista de preço',
                    },
                  ]}
                >
                  <Select >
                    {listPrice &&
                      listPrice?.priceList?.map(s => (
                        <Option value={s.priceListId}>{s.name}</Option>
                      ))}
                  </Select>
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  )
}

export default ItensModal
