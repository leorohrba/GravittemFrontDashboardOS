import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { addBrlCurrencyToNumber, handleAuthError } from '@utils'
import { Avatar, Col, Form, message, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processItemSearchId = 0

const ProductAndServicesInputItem = React.forwardRef((props, ref) => {
  const {
    form,
    itemSource,
    setItemSource,
    editData,
    canBeUpdated,
    autoFocus,
    onChange,
    materialType,
  } = props

  const [itemName, setItemName] = useState('')
  const [itemNoResultsMessage, setItemNoResultsMessage] = useState(null)
  const [loadingItems, setLoadingItems] = useState(false)

  const debouncedItemName = useDebounce(itemName, 400)

  useEffect(() => {
    form.setFieldsValue({ itemId: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setItemName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('itemId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedItemName) {
      populateItemSearch(debouncedItemName, form.getFieldValue('type'))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedItemName])

  const handleSearchItem = value => {
    setItemName(value)
  }

  const handleChangeItem = value => {
    const item = itemSource.find(x => x.value === value)
    if (!(onChange === null || onChange === undefined) && item) {
      onChange(item)
    }
    setItemName('')
  }

  const populateItemSearch = (name, type) => {
    setItemSource([])
    setLoadingItems(true)
    processItemSearchId++
    const internalProcessItemSearchId = processItemSearchId
    getItems(name, type)
      .then(records => {
        if (internalProcessItemSearchId === processItemSearchId) {
          const source = []
          setItemNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.code ? (
                  <>
                    <b>{record.code}</b> - {record.name}{' '}
                  </>
                ) : (
                  record.name
                ),
                code: record.code,
                defaultUnitValue: record.defaultUnitValue,
                unitValue: null,
                defaultPriceListId: record.defaultPriceListId,
                type: record.type,
                isRecurrence: record.isRecurrence,
                value: record.itemId,
                materialTypeDescription: record.materialTypeDescription,
                note: record.note,
                unMedida: record.unMedida,
              }),
            )
          } else {
            setItemNoResultsMessage(
              'Não foram encontrados produtos ou serviços',
            )
          }
          setItemSource(source)
          setLoadingItems(false)
        }
      })
      .catch(error => {
        setItemNoResultsMessage(
          'Não foi possível buscar os produtos ou serviços',
        )
        setLoadingItems(false)
      })
  }

  const getItems = (name, type) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      name: `%${name}%`,
      code: `%${name}%`,
      queryOperator: 'like',
      type,
      status: 1,
      getPriceList: false,
      materialTypeId: materialType,
    }

    return apiCRM
      .get(`/api/crm/item`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.item
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
        label="Nome do produto ou serviço"
        name="itemId"
        initialValue={editData ? editData?.itemId : null}
        rules={[{ required: true, message: 'Campo obrigatório!' }]}
      >
        <Select
          placeholder="Digite o nome do produto ou serviço"
          filterOption={false}
          disabled={!canBeUpdated}
          showSearch
          onChange={handleChangeItem}
          onSearch={handleSearchItem}
          ref={ref}
          showArrow={false}
          className="select-autocomplete"
          style={{ textIndent: '2px' }}
          optionLabelProp="label"
          autoFocus={
            autoFocus === null || autoFocus === undefined ? false : autoFocus
          }
          notFoundContent={
            loadingItems ? (
              <Spin size="small" />
            ) : itemName ? (
              itemNoResultsMessage
            ) : null
          }
        >
          {itemSource.map((record, index) => (
            <Option
              key={index}
              value={record.value}
              label={
                <Row type="flex">
                  <Col className="truncate" style={{ maxWidth: '630px' }}>
                    {record.label}
                  </Col>
                </Row>
              }
            >
              <Row type="flex">
                <Col className="truncate" style={{ width: '80%' }}>
                  {record.label}
                </Col>
                <Col
                  className="text-right flex justify-end"
                  style={{ width: '100px' }}
                >
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

ProductAndServicesInputItem.propTypes = {
  form: PropTypes.any,
  itemSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setItemSource: PropTypes.func,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  editData: PropTypes.any,
}

export default ProductAndServicesInputItem
