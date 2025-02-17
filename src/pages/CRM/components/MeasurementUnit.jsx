import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { addBrlCurrencyToNumber, handleAuthError } from '@utils'
import { Avatar, Col, Form, message, Row, Select, Spin } from 'antd'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processItemSearchId = 0
const MeasurementUnit = React.forwardRef((props, ref) => {
  const { form, itemSource, setItemSource, canBeUpdated } = props

  const [itemName, setItemName] = useState('')
  const [itemNoResultsMessage, setItemNoResultsMessage] = useState(null)
  const [loadingItems, setLoadingItems] = useState(false)

  const debouncedItemName = useDebounce(itemName, 400)

  useEffect(() => {
    form.setFieldsValue({ unMedidaId: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setItemName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('unMedidaId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedItemName) {
      populateItemSearch(debouncedItemName)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemName])

  const handleSearchMeasurementUnit = value => {
    setItemName(value)
  }

  const handleChangeMeasurementUnit = value => {
    setItemName('')
  }

  const populateItemSearch = name => {
    setItemSource([])
    setLoadingItems(true)

    processItemSearchId++
    const internalProcessItemSearchId = processItemSearchId
    getItems(name)
      .then(records => {
        if (internalProcessItemSearchId === processItemSearchId) {
          const source = []
          setItemNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: `${record.codigo} - ${record.descricao}`,
                value: record.id,
              }),
            )
          } else {
            setItemNoResultsMessage('Não foram encontradas unidades de medida')
          }
          setItemSource(source)
          setLoadingItems(false)
        }
      })
      .catch(error => {
        setItemNoResultsMessage('Não foi possível buscar as unidades de medida')
        setLoadingItems(false)
      })
  }

  const getItems = name => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      descricao: `%${name}%`,
    }

    return apiCRM
      .get(`/api/crm/UnidadeMedida`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.unidadeMedida
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }
  return (
    <React.Fragment>
      <Form.Item
        label="Unidade de medida"
        name="unMedidaId"
        rules={[{ required: true, message: 'Campo obrigatório!' }]}
      >
        <Select
          placeholder="Digite a unidade de medida"
          filterOption={false}
          disabled={!canBeUpdated}
          showSearch
          onChange={handleChangeMeasurementUnit}
          onSearch={handleSearchMeasurementUnit}
          ref={ref}
          showArrow={false}
          className="select-autocomplete"
          style={{ textIndent: '2px' }}
          optionLabelProp="label"
          notFoundContent={
            loadingItems ? (
              <Spin size="small" />
            ) : itemName ? (
              itemNoResultsMessage
            ) : (
              ''
            )
          }
        >
          {itemSource.map((record, index) => (
            <Option
              key={index}
              value={record.value}
              label={
                <Row type="flex">
                  <Col className="truncate" style={{ maxWidth: '430px' }}>
                    {record.label}
                  </Col>
                </Row>
              }
            >
              <Row type="flex">
                <Col className="truncate" style={{ width: '340px' }}>
                  {record.label}
                </Col>
                <Col className="text-right" style={{ width: '100px' }}>
                  {record.defaultUnitValue || record.defaultUnitValue === 0
                    ? addBrlCurrencyToNumber(record.defaultUnitValue)
                    : ''}
                </Col>
                <Col>
                  {record.isRecurrence ? (
                    <Avatar
                      size={16}
                      className="ml-2"
                      style={{
                        marginTop: '-3px',
                        backgroundColor: '#1976d2',
                        verticalAlign: 'middle',
                      }}
                    >
                      R
                    </Avatar>
                  ) : (
                    ''
                  )}
                </Col>
              </Row>
            </Option>
          ))}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
})

export default MeasurementUnit
