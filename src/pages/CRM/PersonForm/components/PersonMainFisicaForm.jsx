import React from 'react'
// import { Form } from '@ant-design/compatible'
import { Form, Col, Input, Row, Select, DatePicker, Switch, Button } from 'antd'
import { validateByMask, removeMask } from '@utils'
import InputMask from 'react-input-mask'

const { Option } = Select

export default function PersonMainFisicaForm(props) {
  const {
    form,
    canBeUpdated,
    personId,
    isSearchingPerson,
    searchPersonByDocument,
    editData,
    marketSegmentSource,
    switchKey,
    setSwitchKey,
    setIsSeller,
  } = props

  const cpfValidate = (rule, value, callback) => {
    if (
      removeMask(value) &&
      !validateByMask(value) &&
      form.getFieldValue('personType') === 1
    ) {
      callback('Cpf incompleto!')
    } else {
      callback()
    }
  }

  return (
    <div
      style={{
        display: form.getFieldValue('personType') === 1 ? 'block' : 'none',
      }}
    >
      <Row type="flex" align="middle" gutter={20}>
        <Col style={{ width: '200px' }}>
          <Form.Item
            label="CPF"
            name="cpf"
            initialValue={editData?.cpf || ''}
            rules={[
              {
                validator: cpfValidate,
              },
            ]}
          >
            <InputMask
              mask="999.999.999-99"
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

        <Col style={{ width: '200px' }}>
          <Form.Item label="RG" name="rg" initialValue={editData?.rg || null}>
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            colon={false}
            label="Você é um vendedor?"
            name="isSeller"
            initialValue={editData ? editData.isSeller : false}
          >
            <div className="flex">
              <Switch
                disabled={!canBeUpdated}
                onChange={isSeller => {
                  form.setFieldsValue({ isSeller: isSeller })
                  isSeller && form.setFieldsValue({ isCollaborator: isSeller })
                  setSwitchKey(switchKey + 1)
                  setIsSeller(isSeller)
                }}
                defaultChecked={editData ? editData.isSeller : false}
              />

              <span className="ml-2">
                {form.getFieldValue('isSeller') ? 'Sim' : 'Não'}
              </span>
            </div>
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            colon={false}
            label="Você é um colaborador?"
            name="isCollaborator"
            initialValue={editData ? editData.isCollaborator : false}
          >
            <Switch
              disabled={!canBeUpdated || form.getFieldValue('isSeller')}
              onChange={e => {
                form.setFieldsValue({ isCollaborator: e })
                setSwitchKey(switchKey + 1)
              }}
              defaultChecked={editData ? editData.isCollaborator : false}
              checked={form.getFieldValue('isCollaborator')}
            />

            <span className="ml-2">
              {form.getFieldValue('isCollaborator') ? 'Sim' : 'Não'}
            </span>
          </Form.Item>
        </Col>
      </Row>

      <Row type="flex" gutter={20}>
        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Sexo"
            name="genre"
            initialValue={editData?.genre || null}
            rules={[
              {
                required: form.getFieldValue('personType') === 1,
                message: 'Informe o sexo da pessoa!',
              },
            ]}
          >
            <Select
              showSearch
              disabled={!canBeUpdated}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="M">Masculino</Option>
              <Option value="F">Feminino</Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ width: '200px' }}>
          <Form.Item
            label="Data de nascimento"
            name="bornDate"
            initialValue={editData?.bornDate || null}
          >
            <DatePicker
              disabled={!canBeUpdated}
              format="DD/MM/YYYY"
              placeholder="DD/MM/AAAA"
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '400px' }}>
          <Form.Item
            label="Segmento de mercado"
            name="marketSegmentId"
            initialValue={editData?.marketSegmentId || undefined}
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
      </Row>
    </div>
  )
}
