import { Col, Form, Row, Select } from 'antd'
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'
import React from 'react'
import InputRegion from './InputRegion'

const { Option } = Select

export default function PersonMainFranchiseeForm({
  form,
  canBeUpdated,
  editData,
  regionSource,
  setRegionSource,
}) {

  return (
    <div
      style={{ display: form.getFieldValue('isFranchisee') ? 'block' : 'none' }}
    >
      <Row type="flex" gutter={36}>
        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Capital disponível"
            name="availableCapital"
            initialValue={editData?.availableCapital || null}
          >
            <NumberFormat
              className="ant-input"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$"
              disabled={!canBeUpdated}
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '350px' }}>
          <Form.Item
            label="Tipo de royalties"
            name="royaltyType"
            initialValue={editData?.royaltyType || undefined}
          >
            <Select
              showSearch
              allowClear
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={1}>
                Royalties - Percentual sobre faturamento
              </Option>
              <Option value={2}>Royalties - Valor fixo</Option>
              <Option value={3}>Percentual sobre venda de produtos</Option>
              <Option value={4}>Comissionamento no total faturado</Option>
              <Option value={5}>Comissionamento nas recorrências</Option>
              <Option value={null}> </Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: '300px' }}>
          <Form.Item
            label="Como conheceu a franquia"
            name="meetFranchise"
            initialValue={editData?.meetFranchise || undefined}
          >
            <Select
              showSearch
              allowClear
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={1}>Anúncio em TV</Option>
              <Option value={2}>Anúncio em revista</Option>
              <Option value={3}>Anúncio em internet</Option>
              <Option value={4}>Facebook</Option>
              <Option value={5}>Google</Option>
              <Option value={6}>Indicação</Option>
              <Option value={7}>Instagram</Option>
              <Option value={8}>Linkedin</Option>
              <Option value={9}>Outros</Option>
              <Option value={null}> </Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row type="flex">
        <Col style={{ width: '350px' }}>
          <InputRegion
            form={form}
            regionSource={regionSource}
            setRegionSource={setRegionSource}
            defaultValue={editData?.regionId || undefined}
            canBeUpdated={canBeUpdated}
            fieldName="regionId"
          />
        </Col>
      </Row>
    </div>
  )
}

PersonMainFranchiseeForm.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  editData: PropTypes.any,
  regionSource: PropTypes.array,
  setRegionSource: PropTypes.func,
}
