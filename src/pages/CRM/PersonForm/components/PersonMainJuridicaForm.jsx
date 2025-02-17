import { Col, Form, Input, Row, DatePicker, Switch, Button, Select } from 'antd'
import { validateByMask, removeMask } from '@utils'
import InputMask from 'react-input-mask'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

export default function PersonMainJuridicaForm({
  switchKey,
  setSwitchKey,
  form,
  canBeUpdated,
  personId,
  ownerProfile,
  isSearchingPerson,
  searchPersonByDocument,
  editData,
  marketSegmentSource,
}) {

  const cnpjValidate = (rule, value, callback) => {
    if (
      removeMask(value) &&
      !validateByMask(value) &&
      form.getFieldValue('personType') === 2
    ) {
      callback('CNPJ incompleto!')
    } else {
      callback()
    }
  }

  const companyNameValidate = (rule, value, callback) => {
    if (!value && form.getFieldValue('personType') === 2) {
      callback('Informe a razão social!')
    } else {
      callback()
    }
  }

  return (
    <div
      style={{
        display: form.getFieldValue('personType') === 2 ? 'block' : 'none',
      }}
    >
      <Row type="flex" gutter={20} align="middle">
        <Col style={{ width: '200px' }}>
          <Form.Item
            label="CNPJ"
            name="cnpj"
            initialValue={editData?.cnpj || ''}
            rules={[
              {
                validator: cnpjValidate,
              },
            ]}
          >
            <InputMask
              mask="99.999.999/9999-99"
              maskChar="_"
              disabled={!canBeUpdated}
              className="ant-input"
            />
          </Form.Item>
        </Col>

        {personId === 0 && (
          <Col style={{ paddingTop: '7px' }}>
            <Button
              type="outline"
              loading={isSearchingPerson}
              onClick={() => searchPersonByDocument()}
            >
              <i className="fa fa-search mr-3" />
              Buscar Dados
            </Button>
          </Col>
        )}

        <Col style={{ width: '400px' }}>
          <Form.Item
            label="Razão Social"
            name="companyName"
            initialValue={editData?.companyName || null}
            rules={[
              {
                validator: companyNameValidate,
              },
            ]}
          >
            <Input
              disabled={!canBeUpdated}
              placeholder="Digite a razão social"
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '400px' }}>
          <Form.Item
            label="Segmento de mercado"
            name="marketSegmentId"
            // initialValue={editData?.marketSegmentId || undefined}
          >
            <Select
              showSearch
              mode="multiple"
              showArrow={false}
              className="select-autocomplete"
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {marketSegmentSource.map(d => (
                <Option value={d.id}>{d.descricao}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {ownerProfile.indexOf('Franchisor') > -1 && (
          <Col style={{ width: '200px' }}>
            <Form.Item
              colon={false}
              label="Você é um franqueado?"
              name="isFranchisee"
              initialValue={editData ? editData?.isFranchisee : false}
            >
              <div className="flex">
                <Switch
                  disabled={!canBeUpdated}
                  onChange={e => {
                    form.setFieldsValue({ isFranchisee: e })
                    setSwitchKey(switchKey + 1)
                  }}
                  defaultChecked={editData ? editData?.isFranchisee : false}
                />

                <span className="ml-2">
                  {form.getFieldValue('isFranchisee') ? 'Sim' : 'Não'}
                </span>
              </div>
            </Form.Item>
          </Col>
        )}
      </Row>

      <Row type="flex" gutter={20}>
        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Inscrição Estadual"
            name="ie"
            initialValue={editData?.ie || null}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Inscrição Municipal"
            name="im"
            initialValue={editData?.im || null}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Data de fundação"
            name="foundationDate"
            initialValue={editData?.foundationDate || null}
          >
            <DatePicker
              disabled={!canBeUpdated}
              format="DD/MM/YYYY"
              placeholder="DD/MM/AAAA"
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}

PersonMainJuridicaForm.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  personId: PropTypes.number,
  ownerProfile: PropTypes.string,
  isSearchingPerson: PropTypes.bool,
  searchPersonByDocument: PropTypes.func,
  editData: PropTypes.any,
  marketSegmentSource: PropTypes.array,
}
