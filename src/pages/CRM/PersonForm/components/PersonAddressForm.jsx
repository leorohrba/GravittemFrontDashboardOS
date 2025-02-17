/**
 * breadcrumb: Formulário do cadastro de endereços da pessoa
 */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react'
import {
  removeNumberFormatting,
  removeMask,
  validateByMask,
  zeroesLeft,
  handleAuthError,
} from '@utils'
import { apiCRM } from '@services/api'
import PropTypes from 'prop-types'
import {
  Form,
  Button,
  Col,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Select,
} from 'antd'
import InputMask from 'react-input-mask'
import InputCity from './InputCity'

const { Option } = Select

function PersonAddressFormImplement(props) {
  const {
    personAddress,
    states,
    tiposEndereco,
    canBeUpdated,
    show,
    closePersonAddressForm,
    savePersonAddressForm,
    setCurrentState,
  } = props

  const [citySource, setCitySource] = useState([])
  const [key, setKey] = useState(0)

  const [form] = Form.useForm()

  useEffect(() => {
    if (show) {
      form.resetFields()
      setCitySource([])
      if (personAddress !== null) {
        setCitySource([
          {
            cityId: personAddress.cityId,
            cityName: personAddress.cityName,
            stateAbbreviation: personAddress.stateAbbreviation,
            stateName: personAddress.stateName,
            stateId: personAddress.stateId,
          },
        ])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  const handleSubmit = e => {
    e.preventDefault()
    if (!canBeUpdated) {
      message.error('Você não pode atualizar o endereço!')
      return
    }

    form
      .validateFields()
      .then(values => {
        savePersonAddress()
      })
      .catch(err => message.warning('Há campos à serem preenchidos.'))
  }

  function handleCancel() {
    closePersonAddressForm()
  }

  function savePersonAddress() {
    setCurrentState(true)
    const city = citySource.find(x => x.cityId === form.getFieldValue('cityId'))
    const address = {
      id: personAddress === null ? 0 : personAddress.id,
      typeId: form.getFieldValue('typeId'),
      isStandart: false,
      isActive: form.getFieldValue('isActive'),
      name: form.getFieldValue('name'),
      number: form.getFieldValue('number'),
      neighborhood: form.getFieldValue('neighborhood'),
      complement: form.getFieldValue('complement'),
      zipCode:
        form.getFieldValue('zipCode') === null
          ? null
          : removeMask(form.getFieldValue('zipCode')),
      cityId: form.getFieldValue('cityId'),
      cityName: city?.cityName,
      stateAbbreviation: form.getFieldValue('stateAbbreviation'),
      countryId: form.getFieldValue('countryId'),
      locationReference: form.getFieldValue('locationReference'),
      key: personAddress === null ? -1 : personAddress.key,
    }

    savePersonAddressForm(address)
    setCurrentState(false)
  }

  const zipCodeValidate = (rule, value, callback) => {
    if (!validateByMask(value)) {
      callback('CEP incompleto!')
    } else {
      callback()
    }
  }

  const stateValidate = (rule, value, callback) => {
    const city = citySource.find(x => x.cityId === form.getFieldValue('cityId'))
    if (value && !city) {
      callback('Informe a cidade antes de informar o estado!')
    } else if (value && city.stateAbbreviation !== value) {
      callback('Estado selecionado não pertence a cidade informada!')
    } else {
      callback()
    }
  }

  const handleChangeCep = async value => {
    if (removeNumberFormatting(value)?.replace('-', '').length === 8) {
      try {
        const response = await apiCRM.get(
          `api/CRM/BuscaCEP?cep=${removeNumberFormatting(value)?.replace(
            '-',
            '',
          )}`,
        )

        const { data } = response
        if (data.isOk) {
          const addressData = data.cep[0]
          setCitySource([
            {
              cityId: addressData?.citiId,
              cityName: addressData?.cidade,
              stateAbbreviation: addressData?.uf,
              stateName: addressData?.estado,
              stateId: addressData?.ufId,
            },
          ])

          form.setFieldsValue({
            name: addressData?.endereco,
            neighborhood: addressData?.bairro,
            complement: addressData?.complemento,
            cityId: addressData?.citiId,
            stateAbbreviation: addressData?.uf,
          })

          setKey(key + 1)
        }
      } catch (error) {
        handleAuthError(error)
      }
    }
  }

  return (
    <Modal
      visible={show}
      title={
        personAddress === null
          ? 'Novo endereço'
          : canBeUpdated
          ? 'Alterar endereço'
          : 'Consultar endereço'
      }
      onOk={handleSubmit}
      onCancel={handleCancel}
      centered
      width="600"
      footer={[
        <React.Fragment>
          {canBeUpdated && (
            <Button
              type="primary"
              onClick={handleSubmit}
              htmlFor="submit-form"
              className="formButton"
            >
              {personAddress === null ? 'Adicionar' : 'Confirmar'}
            </Button>
          )}
          <Button onClick={handleCancel}>
            {canBeUpdated ? 'Cancelar' : 'Retornar'}
          </Button>
        </React.Fragment>,
      ]}
    >
      <Form layout="vertical" form={form} onSubmit={handleSubmit}>
        <Row type="flex" gutter={20}>
          <Col>
            <Form.Item
              label="Status"
              name="isActive"
              initialValue={personAddress?.isActive || true}
              rules={[
                { required: true, message: 'Informe o status do endereço!' },
              ]}
            >
              <Radio.Group buttonStyle="solid" disabled={!canBeUpdated}>
                <Radio.Button style={{ fontWeight: 'normal' }} value>
                  Ativo
                </Radio.Button>
                <Radio.Button style={{ fontWeight: 'normal' }} value={false}>
                  Inativo
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col style={{ width: '200px' }}>
            <Form.Item
              label="Tipo de endereço"
              name="typeId"
              initialValue={personAddress?.typeId || tiposEndereco[0]?.id}
              rules={[
                { required: true, message: 'Selecione o tipo de endereço' },
              ]}
            >
              <Select
                showSearch
                disabled={!canBeUpdated}
                placeholder="Selecionar"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {tiposEndereco.map(tipoDocumento => (
                  <Option key={tipoDocumento.id} value={tipoDocumento.id}>
                    {tipoDocumento.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col style={{ width: '150px' }}>
            <Form.Item
              label="CEP"
              name="zipCode"
              initialValue={
                personAddress?.zipCode
                  ? zeroesLeft(removeMask(personAddress?.zipCode), 8)
                  : ''
              }
              rules={[
                {
                  validator: zipCodeValidate,
                },
              ]}
              onChange={e => handleChangeCep(e.target.value)}
            >
              <InputMask
                mask="99999-999"
                maskChar="_"
                className="ant-input"
                disabled={!canBeUpdated}
                autoFocus
              />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={20}>
          <Col style={{ width: '400px' }}>
            <Form.Item
              label="Endereço"
              name="name"
              initialValue={personAddress?.name || null}
              rules={[{ required: true, message: 'Informe o endereço!' }]}
            >
              <Input placeholder="Digite o endereço" disabled={!canBeUpdated} />
            </Form.Item>
          </Col>

          <Col style={{ width: '150px' }}>
            <Form.Item
              label="Número"
              name="number"
              initialValue={personAddress?.number || null}
              rules={[{ required: true, message: 'Informe o número!' }]}
            >
              <Input disabled={!canBeUpdated} />
            </Form.Item>
          </Col>

          <Col style={{ width: '250px' }}>
            <Form.Item
              label="Bairro"
              name="neighborhood"
              initialValue={personAddress?.neighborhood || null}
              rules={[{ required: true, message: 'Informe o bairro!' }]}
            >
              <Input placeholder="Digite o bairro" disabled={!canBeUpdated} />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={20}>
          <Col style={{ width: '300px' }}>
            <Form.Item
              label="Complemento"
              name="complement"
              initialValue={personAddress?.complement || null}
            >
              <Input
                placeholder="Adicione um complemento"
                disabled={!canBeUpdated}
              />
            </Form.Item>
          </Col>

          <Col style={{ width: '400px' }}>
            <Form.Item
              label="Referência"
              name="locationReference"
              initialValue={personAddress?.locationReference || null}
            >
              <Input
                placeholder="Adicione alguma referência"
                disabled={!canBeUpdated}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={20}>
          <Col style={{ width: '350px' }}>
            <InputCity
              form={form}
              canBeUpdated={canBeUpdated}
              citySource={citySource}
              setCitySource={setCitySource}
              onChange={value =>
                form.setFieldsValue({
                  stateAbbreviation: value?.stateAbbreviation,
                })
              }
              defaultValue={personAddress?.cityId || null}
            />
          </Col>

          <Col style={{ width: '250px' }}>
            <Form.Item
              label="Estado"
              name="stateAbbreviation"
              initialValue={personAddress?.stateAbbreviation || null}
              rules={[
                { required: true, message: 'Selecione o estado!' },
                { validator: stateValidate },
              ]}
            >
              <Select
                showSearch
                disabled={!canBeUpdated}
                placeholder="Selecione um estado"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {states.map(state => (
                  <Option key={state.stateId} value={state.stateAbbreviation}>
                    {state.stateName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col style={{ width: '150px' }}>
            <Form.Item
              label="País"
              name="countryId"
              initialValue={personAddress?.countryId || 1}
              rules={[{ required: true, message: 'Selecione o país!' }]}
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
                <Option value={1}>Brasil</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <input type="submit" id="submit-form" className="hidden" />
      </Form>
    </Modal>
  )
}

PersonAddressFormImplement.propTypes = {
  canBeUpdated: PropTypes.func,
  closePersonAddressForm: PropTypes.func,
  personAddress: PropTypes.string,
  savePersonAddressForm: PropTypes.func,
  show: PropTypes.bool,
  states: PropTypes.any,
}

export default PersonAddressFormImplement
