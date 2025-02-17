import { Col, Form, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { addBrlCurrencyToNumber } from '@utils'

const { Option } = Select

const ProductAndServicesInputPriceList = props => {
  const {
    form,
    priceListSource,
    canBeUpdated,
    loading,
    handleUnitValueByPriceList,
    editData,
    rules,
  } = props

  const priceListInput = useRef(null)

  const handleChangePriceList = value => {
    handleUnitValueByPriceList(value, priceListSource)
  }

  return (
    <Form.Item
      label="Lista de preço"
      name="priceListId"
      initialValue={editData ? editData?.priceListId : null}
      rules={[{ required: rules != null, message: 'Campo obrigatório!' }]}
    >
      <Select
        onChange={handleChangePriceList}
        disabled={!canBeUpdated}
        ref={priceListInput}
        showSearch
        showArrow
        loading={loading}
        optionLabelProp="label"
        placeholder="Lista de preço"
        optionFilterProp="children"
        filterOption={(input, option) => {
          let checkFilter = -1
          try {
            checkFilter = option.props.label // children.props.children[1].props.children
              .toLowerCase()
              .indexOf(input.toLowerCase())
          } catch {
            checkFilter = -1
          }
          return checkFilter >= 0
        }}
      >
        {priceListSource.map(p => (
          <Option key={p.value} value={p.value} label={p.label}>
            <Row type="flex">
              <Col className="truncate" style={{ width: '180px' }}>
                {p.label}
              </Col>
              <Col className="text-right" style={{ width: '100px' }}>
                {addBrlCurrencyToNumber(p.unitValue)}
              </Col>
            </Row>
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

ProductAndServicesInputPriceList.propTypes = {
  form: PropTypes.any,
  priceListSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  loading: PropTypes.bool,
  handleUnitValueByPriceList: PropTypes.func,
  editData: PropTypes.any,
}

export default ProductAndServicesInputPriceList
