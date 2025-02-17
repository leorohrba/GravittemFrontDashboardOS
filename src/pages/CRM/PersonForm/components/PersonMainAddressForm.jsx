import React, { useState, useEffect } from 'react'
import { Form, Col, Input, Row, Select } from 'antd'
import PropTypes from 'prop-types'
import { validateByMask, removeNumberFormatting, handleAuthError } from '@utils'
import InputMask from 'react-input-mask'
import InputCity from './InputCity'
import { apiCRM } from '@services/api'
import { notNullUndefined } from '../../../../SoftinFrontSystems/src/utils/utils'

const { Option } = Select

export default function PersonMainAddressForm({
  form,
  canBeUpdated,
  states,
  citySource,
  setCitySource,
  editData,
}) {
  const [adress, setAdress] = useState()
  const [key, setKey] = useState(0)
  const [personCountryId, setPersonCountryId] = useState(null)
  const [personCountryName, setPersonCountryName] = useState(null)
  const [searchAddressData, setSearchAddressData] = useState(null)

  const zipCodeValidate = (rule, value, callback) => {
    if (!validateByMask(value)) {
      callback('Cep incompleto!')
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
        if (response.data) {
          const addressData = response.data.cep[0]
          setAdress(addressData)

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
            addressName: addressData?.endereco,
            neighborhood: addressData?.bairro,
            cityId: addressData?.citiId,
            stateAbbreviation: addressData?.uf,
            complement: addressData?.complemento,
          })

          setKey(key + 1)
        }
      } catch (err) {
        handleAuthError(err)
      }
    }
  }

  const updateFormAddressValues = value => {
    form.setFieldsValue({
      stateAbbreviation: value?.stateAbbreviation,
      countryId: value?.countryId || 1,
    })
  }

  const updateCountryVariables = value => {
    setPersonCountryId(value?.countryId || 1)
    setPersonCountryName(value?.countryName || 'BRASIL')
  }

  const handleAddressChanges = value => {
    if (notNullUndefined(value)) {
      updateFormAddressValues(value)
      updateCountryVariables(value)
    }
  }

  useEffect(() => {
    handleAddressChanges(editData)
  }, [editData, personCountryId])

  useEffect(() => {
    handleAddressChanges(searchAddressData)
  }, [searchAddressData])

  return (
    <React.Fragment>
      <Row>
        <h2>Endereço principal</h2>
        <hr />
      </Row>

      <Row type="flex" gutter={20}>
        <Col style={{ width: '150px' }}>
          <Form.Item
            label="CEP"
            name="zipCode"
            initialValue={editData?.zipCode || ''}
            rules={[{ validator: zipCodeValidate }]}
            onChange={e => handleChangeCep(e.target.value)}
          >
            <InputMask
              mask="99999-999"
              maskChar="_"
              disabled={!canBeUpdated}
              className="ant-input"
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '550px' }}>
          <Form.Item
            label="Endereço"
            name="addressName"
            initialValue={editData?.addressName || undefined}
            rules={[{ required: false, message: 'Informe o endereço!' }]}
          >
            <Input disabled={!canBeUpdated} placeholder="Digite o endereço" />
          </Form.Item>
        </Col>

        <Col style={{ width: '150px' }}>
          <Form.Item
            label="Número"
            name="addressNumber"
            initialValue={editData?.addressNumber || null}
            rules={[{ required: false, message: 'Informe o número!' }]}
          >
            <Input disabled={!canBeUpdated} />
          </Form.Item>
        </Col>
      </Row>

      <Row type="flex" gutter={20}>
        <Col style={{ width: '250px' }}>
          <Form.Item
            label="Bairro"
            name="neighborhood"
            initialValue={editData?.neighborhood || adress?.bairro || null}
            rules={[{ required: false, message: 'Informe o bairro!' }]}
          >
            <Input disabled={!canBeUpdated} placeholder="Digite o bairro" />
          </Form.Item>
        </Col>

        <Col style={{ width: '350px' }}>
          <Form.Item
            label="Complemento"
            name="complement"
            initialValue={editData?.complement || adress?.complemento || null}
          >
            <Input
              disabled={!canBeUpdated}
              placeholder="Adicione um complemento"
            />
          </Form.Item>
        </Col>

        <Col style={{ width: '350px' }}>
          <Form.Item
            label="Referência"
            name="locationReference"
            initialValue={editData?.locationReference || null}
          >
            <Input
              disabled={!canBeUpdated}
              placeholder="Adicione alguma referência"
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
            onChange={value => {
              setSearchAddressData(value)
              handleAddressChanges(value)
            }}
            defaultValue={editData?.cityId || adress?.citiId}
          />
        </Col>

        <Col style={{ width: '320px' }}>
          <Form.Item
            label="Estado"
            name="stateAbbreviation"
            initialValue={editData?.stateAbbreviation || null}
            rules={[
              { required: true, message: 'Selecione o estado!' },
              { validator: stateValidate },
            ]}
          >
            {adress?.ufId ? (
              <Select placeholder="Selecione">
                <Option value={adress?.ufId}> {adress?.estado} </Option>
              </Select>
            ) : (
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
            )}
          </Form.Item>
        </Col>

        <Col style={{ width: '200px', cursor: 'not-allowed' }}>
          <Form.Item
            label="País"
            name="countryId"
            initialValue={personCountryId}
            rules={[{ required: true, message: 'Selecione o país!' }]}
          >
            <Select
              style={{ pointerEvents: 'none' }}
              showSearch
              optionFilterProp="children"
              disabled={!canBeUpdated}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value={personCountryId}>{personCountryName}</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </React.Fragment>
  )
}

PersonMainAddressForm.propTypes = {
  form: PropTypes.any,
  citySource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setCitySource: PropTypes.func,
  editData: PropTypes.any,
  states: PropTypes.array,
}
