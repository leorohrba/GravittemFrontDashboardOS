import { Form, Col, Input, Row, Select, message } from 'antd'
import { validateByMask } from '@utils'
import InputMask from 'react-input-mask'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

export default function PersonMainContactForm({
  canBeUpdated,
  editData,
  contactSourceSource,
  businessAreaSource,
}) {
  const phoneValidate = (rule, value, callback) => {
    if (!validateByMask(value)) {
      callback('Telefone incompleto!')
    } else {
      callback()
    }
  }

  const cellPhoneValidate = (rule, value, callback) => {
    if (!validateByMask(value)) {
      callback('Celular incompleto!')
    } else {
      callback()
    }
  }

  return (
    <React.Fragment>
      <Row type="flex" gutter={20}>
        <Col style={{ width: '320px' }}>
          <Form.Item
            label="Email"
            name="defaultEmail"
            initialValue={editData?.defaultEmail || null}
            rules={[
              {
                type: 'email',
                message: 'E-mail inválido!',
              },
            ]}
          >
            <Input placeholder="Digite o seu email" disabled={!canBeUpdated} />
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Telefone"
            name="phone"
            initialValue={editData?.phone || ''}
            rules={[
              {
                validator: phoneValidate,
              },
            ]}
          >
            <InputMask
              mask="(99) 9999-9999"
              maskChar="_"
              disabled={!canBeUpdated}
              className="ant-input"
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Celular"
            name="cellPhone"
            initialValue={editData?.cellPhone || ''}
            rules={[
              {
                validator: cellPhoneValidate,
              },
            ]}
          >
            <InputMask
              mask="(99) 99999-9999"
              maskChar="_"
              disabled={!canBeUpdated}
              className="ant-input"
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '270px' }}>
          <Form.Item
            label="Origem do contato"
            name="contactSourceId"
            initialValue={editData?.contactSourceId || undefined}
          >
            <Select
              showSearch
              allowClear={canBeUpdated}
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {contactSourceSource.map(d => (
                <Option value={d.id}>{d.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row type="flex" gutter={20}>
        <Col style={{ width: '310px' }}>
          <Form.Item
            label="Site"
            name="site"
            initialValue={editData?.site || null}
          >
            <Input disabled={!canBeUpdated} placeholder="Digite o site" />
          </Form.Item>
        </Col>
        <Col style={{ width: '400px' }}>
          <Form.Item label="Áreas de negócios">
            <Select
              showSearch
              value={editData?.businessAreaId || []}
              onChange={value =>
                message.error(
                  'Área de negócio está habilitado somente na criação de negócios',
                )
              }
              mode="multiple"
              disabled={!canBeUpdated}
            >
              {businessAreaSource.map(d => (
                <Option value={d.id}>{d.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </React.Fragment>
  )
}

PersonMainContactForm.propTypes = {
  canBeUpdated: PropTypes.bool,
  editData: PropTypes.any,
  contactSourceSource: PropTypes.array,
  businessAreaSource: PropTypes.array,
}
