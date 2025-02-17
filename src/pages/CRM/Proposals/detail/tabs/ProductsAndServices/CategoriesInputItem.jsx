import { apiCRM } from '@services/api'
import { addBrlCurrencyToNumber, handleAuthError } from '@utils'
import { Avatar, Col, Form, message, Row, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processMaterialTypeSearchId = 0

const CategoriesInputMaterialType = React.forwardRef((props, ref) => {
  const { form, setMaterialType, editData, canBeUpdated, autoFocus } = props

  const [materialTypeSource, setMaterialTypeSource] = useState([])
  const [
    materialTypeNoResultsMessage,
    setMaterialTypeNoResultsMessage,
  ] = useState(null)
  const [loadingMaterialTypes, setLoadingMaterialTypes] = useState(false)

  useEffect(() => {
    form.setFieldsValue({ materialTypeDescription: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    populateMaterialTypeSearch()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChangeMaterialType = value => {
    setMaterialType(value)
  }

  const populateMaterialTypeSearch = () => {
    setMaterialTypeSource([])
    setLoadingMaterialTypes(true)

    processMaterialTypeSearchId++
    const internalProcessMaterialTypeSearchId = processMaterialTypeSearchId
    getMaterialTypes()
      .then(records => {
        if (
          internalProcessMaterialTypeSearchId === processMaterialTypeSearchId
        ) {
          const source = []
          setMaterialTypeNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                value: record.id,
                label: record.description,
                code: record.code,
                isProduct: record.isProduct,
                isActive: record.isActive,
              }),
            )
          } else {
            setMaterialTypeNoResultsMessage('Não foram encontradas categorias')
          }
          setMaterialTypeSource(source)
          setLoadingMaterialTypes(false)
        }
      })
      .catch(error => {
        setMaterialTypeNoResultsMessage('Não foi possível buscar as categorias')
        setLoadingMaterialTypes(false)
      })
  }

  const getMaterialTypes = () => {
    return apiCRM
      .get(`/api/crm/MaterialType`)
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.materialTypes
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
        label="Categoria"
        name="materialTypeDescription"
        initialValue={editData ? editData?.materialTypeDescription : null}
        rules={[{ required: true, message: 'Campo obrigatório!' }]}
      >
        <Select
          placeholder="Digite o nome da categoria"
          filterOption={false}
          disabled={!canBeUpdated}
          onChange={handleChangeMaterialType}
          ref={ref}
          style={{ textIndent: '2px' }}
          optionLabelProp="label"
          autoFocus={
            autoFocus === null || autoFocus === undefined ? false : autoFocus
          }
          notFoundContent={
            loadingMaterialTypes ? (
              <Spin size="small" />
            ) : (
              materialTypeNoResultsMessage
            )
          }
        >
          {materialTypeSource.map((record, index) => (
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

CategoriesInputMaterialType.propTypes = {
  form: PropTypes.any,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  editData: PropTypes.any,
}

export default CategoriesInputMaterialType
