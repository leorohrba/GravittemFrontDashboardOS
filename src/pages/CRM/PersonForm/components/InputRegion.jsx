import useDebounce from '@components/useDebounce'
import { apiRegion } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import RegionModal from '../../Region/RegionModal'

const { Option } = Select

let processRegionSearchId = 0
const limit = 250

const InputRegion = props => {
  const {
    form,
    regionSource,
    setRegionSource,
    canBeUpdated,
    onChange,
    defaultValue,
    fieldName,
    required,
  } = props

  const [regionName, setRegionName] = useState('')
  const [autoCompleteDisabled, setAutoCompleteDisabled] = useState(false)
  const [regionNoResultsMessage, setRegionNoResultsMessage] = useState(null)
  const [loadingRegions, setLoadingRegions] = useState(false)
  const [regionId, setRegionId] = useState(null)
  const [regionModalVisible, setRegionModalVisible] = useState(false)

  const regionInput = useRef(null)

  const debouncedRegionName = useDebounce(regionName, 400)

  useEffect(() => {
    setRegionName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue(fieldName)])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedRegionName) {
      populateRegionSearch(debouncedRegionName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRegionName])

  const handleSearchRegion = value => {
    setRegionName(value)
  }

  const populateRegionSearch = (name, id, isExact) => {
    setRegionSource([])
    setLoadingRegions(true)

    processRegionSearchId++
    const internalProcessRegionSearchId = processRegionSearchId
    getRegions(name, id, isExact)
      .then(records => {
        if (internalProcessRegionSearchId === processRegionSearchId) {
          const source = []
          setRegionNoResultsMessage(null)

          const recordCount = records.length

          if (recordCount > 0) {
            const recordsFiltered =
              recordCount > limit ? records.slice(0, limit) : records
            if (recordCount > limit) {
              message.info(
                `Foram listados somente os primeiros ${limit} registros!`,
              )
            }

            recordsFiltered.map(record =>
              source.push({
                regionId: record.regiaoId,
                regionName: record.nome,
                regionDescription: record.descricao,
              }),
            )
          } else {
            setRegionNoResultsMessage('Não foram encontradas regiões')
          }
          setRegionSource(source)
          setLoadingRegions(false)
        }
      })
      .catch(error => {
        setRegionNoResultsMessage('Não foi possível buscar as regiões')
        setLoadingRegions(false)
      })
  }

  const getRegions = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      nome: name,
      status: 1, // ativos
    }

    return apiRegion
      .get(`/api/Regiao`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.regiao
        }

        message.error(data.mensagem)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const handleChangeRegion = value => {
    setRegionName('')
    const region = regionSource.find(x => x.regionId === value)
    if (onChange !== undefined && region) {
      onChange(region)
    }
  }

  const handleFocus = () => {
    // Desabilitar o autoComplete do browser
    if (!autoCompleteDisabled) {
      let i
      const el = document.getElementsByClassName('ant-select-search__field')
      for (i = 0; i < el.length; i++) {
        el[i].setAttribute('autocomplete', 'registration-select')
      }
      setAutoCompleteDisabled(true)
    }
  }

  const openRegionModal = () => {
    setRegionId(form.getFieldValue(fieldName))
    setRegionModalVisible(true)
  }

  const footer = (id, source) => {
    let result
    const region = source.find(x => x.regionId === id)
    if (region && region.regionStatus === 2) {
      result = <span style={{ color: 'red' }}>Inativo</span>
    }
    return result
  }

  return (
    <React.Fragment>
      <RegionModal
        visible={regionModalVisible}
        setVisible={setRegionModalVisible}
        regionId={regionId}
        setRegionId={setRegionId}
        readOnly
      />
      <Form.Item
        colon={false}
        extra={footer(form.getFieldValue(fieldName), regionSource)}
        label={
          <React.Fragment>
            <span>Região:</span>
            {form.getFieldValue(fieldName) && (
              <i
                onClick={() => openRegionModal()}
                className="ml-2 fa fa-info-circle cursor-pointer"
                style={{ color: 'gray' }}
                role="button"
              />
            )}
          </React.Fragment>
        }
        name={fieldName}
        initialValue={defaultValue || undefined}
        rules={[{ required, message: 'Informe a região!' }]}
      >
        <Select
          placeholder="Digite a região"
          disabled={!canBeUpdated}
          filterOption={false}
          showSearch
          onFocus={handleFocus}
          allowClear={!required}
          optionLabelProp="label"
          onSearch={handleSearchRegion}
          onChange={handleChangeRegion}
          ref={regionInput}
          showArrow={false}
          className="select-autocomplete"
          notFoundContent={
            loadingRegions ? (
              <Spin size="small" />
            ) : regionName ? (
              regionNoResultsMessage
            ) : null
          }
        >
          {regionSource.map((record, index) => (
            <Option
              key={index}
              value={record.regionId}
              label={record.regionName}
            >
              {record.regionName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}

InputRegion.propTypes = {
  form: PropTypes.any,
  regionSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setRegionSource: PropTypes.func,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func,
  fieldName: PropTypes.string,
  required: PropTypes.bool,
}

export default InputRegion
