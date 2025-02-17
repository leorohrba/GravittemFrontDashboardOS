/* eslint-disable react/jsx-boolean-value */
import { Badge, Col, Form, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select
const { TextArea } = Input 

const RegionEditForm = React.forwardRef((props, ref) => {
  const {
    form,
    canBeUpdated,
    editData,
  } = props

  const { getFieldDecorator } = form

  return (
    <Form layout="vertical">
      <Row type="flex" gutter={12}>
        <Col span={12}>
          <Form.Item label="Região">
            {getFieldDecorator('name', {
              initialValue: editData?.nome,
              rules: [ { required: true, message: 'Campo obrigatório' } ],
            })(
               <Input ref={ref} readOnly={!canBeUpdated} />
            )}
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item label="Delimitado por">
            {getFieldDecorator('delimitedBy',
              { initialValue: editData?.delimitadoPor ,
                rules: [ { required: true, message: 'Campo obrigatório' } ],
              },
            )(
              <Select
                showSearch
                disabled={!canBeUpdated}
                size="default"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value={1}>Sem delimitação</Option>
                <Option value={2}>CEP</Option>
                <Option value={3}>Bairro/município</Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item label="Status">
            {getFieldDecorator('status', {
              initialValue: editData ? editData?.status : 1,
              rules: [ { required: true, message: 'Campo obrigatório' } ],
            })(
              <Select
                disabled={!canBeUpdated}
                placeholder={formatMessage({
                  id: 'select',
                })}
              >
                <Option value={1}>
                  <Badge style={{ color: 'green' }} color="green" text="Ativo" />
                </Option>
                <Option value={2}>
                  <Badge style={{ color: 'red' }} color="red" text="Inativo" />
                </Option>
              </Select>,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex">
        <Col span={12}>
          <Form.Item label="Descrição">
            {getFieldDecorator('description', {
              initialValue: editData?.descricao,
              rules: [ { required: true, message: 'Campo obrigatório' } ],
            })(
               <TextArea readOnly={!canBeUpdated} autoSize={{ minRows: 2, maxRows: 3 }} />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
})

RegionEditForm.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  editData: PropTypes.object,
}

export default RegionEditForm
