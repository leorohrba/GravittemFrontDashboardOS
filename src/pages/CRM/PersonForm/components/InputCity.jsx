import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processCitySearchId = 0
const limit = 250

const InputCity = props => {
  const {
    form,
    citySource,
    setCitySource,
    canBeUpdated,
    onChange,
    defaultValue,
  } = props

  const [autoCompleteDisabled, setAutoCompleteDisabled] = useState(false)
  const [cityName, setCityName] = useState('')
  const [cityNoResultsMessage, setCityNoResultsMessage] = useState(null)
  const [loadingCities, setLoadingCities] = useState(false)
  const cityInput = useRef(null)

  const debouncedCityName = useDebounce(cityName, 400)

  useEffect(() => {
    setCityName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('cityId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedCityName) {
      populateCitySearch(debouncedCityName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCityName])

  const handleSearchCity = value => {
    setCityName(value)
  }

  const populateCitySearch = (name, id, isExact) => {
    setCitySource([])
    setLoadingCities(true)

    processCitySearchId++
    const internalProcessCitySearchId = processCitySearchId
    getCities(name, id, isExact)
      .then(records => {
        if (internalProcessCitySearchId === processCitySearchId) {
          const source = []
          setCityNoResultsMessage(null)

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
                cityId: record.cityId,
                cityName: record.cityName,
                stateAbbreviation: record.stateAbbreviation,
                stateName: record.stateName,
                stateId: record.stateId,
                countryName: record.countryName,
                countryId: record.countryId,
              }),
            )
          } else {
            setCityNoResultsMessage('Não foram encontradas cidades')
          }
          setCitySource(source)
          setLoadingCities(false)
        }
      })
      .catch(error => {
        setCityNoResultsMessage('Não foi possível buscar as cidades')
        setLoadingCities(false)
      })
  }

  const getCities = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      cityName: `%${name}%`,
    }

    return apiCRM
      .get(`/api/crm/city`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.cities
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const handleChangeCity = value => {
    setCityName('')
    const city = citySource.find(x => x.cityId === value)
    if (onChange !== undefined && city) {
      onChange(city)
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

  return (
    <React.Fragment>
      <Form.Item
        label="Cidade"
        name="cityId"
        initialValue={defaultValue || null}
        rules={[{ required: true, message: 'Informe a cidade!' }]}
        className="mb-0"
      >
        <Select
          placeholder="Digite a cidade"
          disabled={!canBeUpdated}
          filterOption={false}
          showSearch
          onFocus={handleFocus}
          autocomplete="off"
          optionLabelProp="label"
          onSearch={handleSearchCity}
          onChange={handleChangeCity}
          ref={cityInput}
          showArrow={false}
          className="select-autocomplete"
          notFoundContent={
            loadingCities ? (
              <Spin size="small" />
            ) : cityName ? (
              cityNoResultsMessage
            ) : null
          }
        >
          {citySource.map((record, index) => (
            <Option key={index} value={record.cityId} label={record.cityName}>
              {`${record.cityName} - ${record.stateAbbreviation}`}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}

InputCity.propTypes = {
  form: PropTypes.any,
  citySource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setCitySource: PropTypes.func,
  defaultValue: PropTypes.number,
  onChange: PropTypes.func,
}

export default InputCity
