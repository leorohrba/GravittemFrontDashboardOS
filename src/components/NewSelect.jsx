/* eslint-disable no-eval */
import { useCombinedRefs } from '@utils'
import { Form } from '@ant-design/compatible'
import { Select, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { getExtra, getRender, getProperty, getTooltip } from '@utils/components'
import { formatMessage } from 'umi-plugin-react/locale'
import NewLabelField from './NewLabelField'

const { Option } = Select

const NewSelect = React.forwardRef((props, ref) => {

  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)
  
  const {
    form,
    options,
    optionValue,
    optionLabel,
    optionRender,
    optionIcon,
    optionColor,
    defaultValue,
    getFirstValue,
    fieldName,
    label,
    placeholder,
    required,
    disabled,
    onChange,
    autoFocus,
    extra,
    optionLabelProp,
    tooltip,
    info,
    onNewItem,
    onRefineSearch,
    icons,
    loading,
    search,
  } = props

  const { getFieldDecorator } = form

  const extraType = extra && React.isValidElement(extra) ? 'React' : ''  
  const optionRenderType = optionRender && React.isValidElement(optionRender) ? 'React' :
                            typeof optionRender === "function" ? 'function' : ''
  
  const handleChange = (value) => {
    
    if (onChange !== undefined) {
      onChange(value)
    }
  }
  
  function getFirstOptionValue() {
    if (options.length > 0) {
      return options[0][optionValue]
    }
    return undefined
  }
  
  return (
    <React.Fragment>
      <Form.Item 
        label={label ? <NewLabelField {...{ label, info, disabled, onRefineSearch, onNewItem, icons, form, fieldName }} /> : undefined} 
        className="mb-0" 
        extra={getExtra(form.getFieldValue(fieldName), options, extra, extraType, optionValue, optionLabel)}
      >
         <Tooltip title={tooltip ? getTooltip(form.getFieldValue(fieldName), options, optionValue, optionLabel) : null}>
          {getFieldDecorator(fieldName, {
            initialValue: defaultValue !== null && defaultValue !== undefined ? defaultValue : (getFirstValue ? getFirstOptionValue() : undefined),
            rules: [
              {
                required,
                message: formatMessage({ id: 'requiredFieldMessage' }),
              },
            ],
          })(
            <Select
              showSearch
              className="w-full"
              size="default"
              ref={combinedRef}
              loading={loading}
              placeholder={placeholder}
              autoFocus={autoFocus}
              onChange={handleChange}
              allowClear={!disabled && !required}
              disabled={disabled}
              optionLabelProp={optionLabelProp}
              optionFilterProp="children"
              filterOption={(input, option) => {
                let checkFilter = -1
                try {
                  checkFilter = option.props.search
                    .toLowerCase()
                    .indexOf(input.toLowerCase())
                } catch {
                  checkFilter = -1
                }
                return checkFilter >= 0
              }}
            >
              {options && options.map((record) => (
                <Option 
                  label={getProperty(record, optionLabel || 'label')} 
                  search={search ? getProperty(record, search) : getProperty(record, optionLabel || 'label')}
                  value={optionValue ? getProperty(record, optionValue || 'value') : record.value}
                >
                  {optionRender ? (
                    <React.Fragment>
                     {getRender(record, optionRender, optionRenderType, optionLabel || 'label')}
                    </React.Fragment>
                   ) : (                  
                    <div>
                      {record[optionIcon] && (
                        <i
                          className={`fa ${record[optionIcon]} mr-3`}
                          style={{
                            color: `${record[optionColor]}`,
                          }}
                        />
                      )}
                      <span>{getProperty(record, optionLabel || 'label')}</span>
                    </div>
                  )}
                </Option>
               ))}
            </Select>,        
          )}
        </Tooltip>  
      </Form.Item>
    </React.Fragment>
  )
})

NewSelect.propTypes = {
  form: PropTypes.any,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  optionColor: PropTypes.string,
  optionIcon: PropTypes.string,
  options: PropTypes.array,
  defaultValue: PropTypes.any,
  getFirstValue: PropTypes.bool,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
  extra: PropTypes.string,
  optionRender: PropTypes.string,
  optionLabelProp: PropTypes.string,
  tooltip: PropTypes.bool,
  search: PropTypes.string,
  info: PropTypes.any,
  onNewItem: PropTypes.func,
  onRefineSearch: PropTypes.func,
  icons: PropTypes.array,
  loading: PropTypes.bool,
}

export default NewSelect
