/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { handleAuthError, useCombinedRefs } from '@utils'
import { message, Spin, Select, Button } from 'antd'
import PropTypes from 'prop-types'
import { getExtra, getRender, getProperty } from '@utils/components'
import { formatMessage } from 'umi-plugin-react/locale'
import NewLabelField from './NewLabelField'

const { Option } = Select

let processSearchId = 0
const limit = 250
              
const NewAutoComplete = React.forwardRef((props, ref) => {

  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)
  
  const {
    form,
    source,
    setSource,
    defaultValue,
    fieldName,
    serviceApi,
    api,
    defaultParams,
    paramName,
    label,
    placeholder,
    required,
    disabled,
    onChange,
    recordId,
    recordDescription,
    recordRender,
    extra,
    autoFocus,
    onRefineSearch,
    onNewItem,
    loading,
    info,
    icons,
    labelRender,
  } = props

  const { getFieldDecorator } = form

  const [name, setName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loadingRecords, setLoadingRecords] = useState(false)

  const debouncedName = useDebounce(name, 400)
  
  const extraType = extra && React.isValidElement(extra) ? 'React' : '' 
  
  const recordRenderType = recordRender && React.isValidElement(recordRender) ? 'React' :
                           recordRender && typeof recordRender === "function" ? 'function' : ''

  const labelRenderType = labelRender && React.isValidElement(labelRender) ? 'React' :
                           labelRender && typeof labelRender === "function" ? 'function' : ''
  
  /*
  useEffect(() => {
    form.setFieldsValue({ [fieldName]: null }) // por causa do bug do antd
  },[])
  */
  
  useEffect(() => {
    setName('')
  
  }, [form.getFieldValue(fieldName)])
  
  useEffect(() => {
    if (debouncedName) {
      populateSearch(debouncedName, null, false)
    }
  }, [debouncedName])

  const handleSearch = value => {
    setName(value)
  }

  const defaultNoResultsMessage = (
    <div
      style={{
        cursor: 'default',
        color: 'black',
        whiteSpace: 'normal',
      }}
      className="flex-wrap"
    >
      Nenhum resultado encontrado para
      <b className="ml-1">{name}</b>.
      {(onRefineSearch !== undefined || onNewItem !== undefined) && (
        <span>
          <span className="ml-2">
            Clique para
          </span>
          {onNewItem !== undefined && ( 
            <Button onClick={() => onNewItem()} type="link" className="ml-1 px-0">
              cadastrar
            </Button>
          )}
          {(onNewItem !== undefined && onRefineSearch !== undefined) && (
            <span className="ml-1 mr-1">ou</span>
          )}
          {onRefineSearch !== undefined && (
            <Button onClick={() => onRefineSearch()} type="link" className="ml-1 px-0">
              refinar busca
            </Button>
          )}
          .
        </span>
      )}        
    </div>
  )
              
  const populateSearch = (argument) => {
    setSource([])
    setLoadingRecords(true)
    processSearchId++
    const internalProcessSearchId = processSearchId
    getRecords(argument)
      .then(records => {
        if (internalProcessSearchId === processSearchId) {
          const source = []
          setNoResultsMessage(null)
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
              source.push(record)
            )
          } else {
            setNoResultsMessage(defaultNoResultsMessage)
          }            
          setSource(source)
          setLoadingRecords(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar registros')
        setLoadingRecords(false)
      })
  }

  const getRecords = (argument) => {
    if (!argument) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = defaultParams || {}
    params[paramName] = argument

    return serviceApi
      .get(api, {
        params,
      })
      .then(response => {
        const { data } = response
        return data || []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }
  
  const handleChange = (value) => {
    if (onChange !== undefined) {
      const item = source.find(x => x[recordId] === value) || null
      onChange(value, item)
    }
    setName('')
  }
  
  return (
    <React.Fragment>
      <Form.Item 
        label={label ? <NewLabelField {...{ label, info, disabled, onRefineSearch, onNewItem, icons, form, fieldName }} /> : undefined} 
        className="mb-0" 
        extra={getExtra(form.getFieldValue(fieldName), source, extra, extraType, recordId, recordDescription)}
      >
        {getFieldDecorator(fieldName, {
          initialValue: defaultValue !== null && defaultValue !== undefined ? defaultValue : undefined,
          rules: [{ required, message: formatMessage({ id: 'requiredFieldMessage' }) }],
        })(
          <Select
            placeholder={placeholder}
            filterOption={false}
            showSearch
            autoFocus={autoFocus}
            disabled={disabled}
            allowClear={!disabled && !required}
            onSearch={handleSearch}
            onChange={handleChange}
            loading={loading}
            ref={combinedRef}
            showArrow={false}
            optionLabelProp={labelRender ? "customLabel" : "label"}
            className="select-autocomplete"
            notFoundContent={
              loadingRecords ? (
                <Spin size="small" />
              ) : name ? (
                noResultsMessage
              ) : null
            }
          >
            {source && source.map((record, index) => (
              <Option 
                label={getProperty(record, recordDescription)} 
                key={index} 
                value={getProperty(record, recordId)}
                customLabel={labelRender ? (
                              <React.Fragment>
                                {getRender(record, labelRender, labelRenderType, recordDescription)}
                              </React.Fragment> ) : undefined}
              >
                {recordRender ? (
                  <React.Fragment>
                    {getRender(record, recordRender, recordRenderType, recordDescription)}
                  </React.Fragment>
                 ) : (                  
                  <React.Fragment>
                    {getProperty(record, recordDescription)}
                  </React.Fragment>  
                )}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </React.Fragment>
  )
})

NewAutoComplete.propTypes = {
  form: PropTypes.any,
  source: PropTypes.array,
  setSource: PropTypes.func,
  defaultValue: PropTypes.any,
  fieldName: PropTypes.string,
  api: PropTypes.string,
  defaultParams: PropTypes.any,
  paramName: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  recordId: PropTypes.string,
  recordDescription: PropTypes.string,
  extra: PropTypes.any,
  autoFocus: PropTypes.bool,
  recordRender: PropTypes.any,
  onRefineSearch: PropTypes.func,
  onNewItem: PropTypes.func,
  loading: PropTypes.bool,
  info: PropTypes.any,
  icons: PropTypes.any,
  serviceApi: PropTypes.any,
  labelRender: PropTypes.any,
}

export default NewAutoComplete
