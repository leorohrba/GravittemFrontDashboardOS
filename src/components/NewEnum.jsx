/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-eval */
import { Form } from '@ant-design/compatible'
import { useCombinedRefs, getEnumDefaultOption } from '@utils'
import { Select } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

const { Option } = Select

const NewEnum = React.forwardRef((props, ref) => {
  const innerRef = React.useRef(null)
  const combinedRef = useCombinedRefs(ref, innerRef)

  const {
    form,
    enums,
    entity,
    property,
    defaultValue,
    getFirstEnumValue,
    fieldName,
    label,
    placeholder,
    required,
    disabled,
    onChange,
    autoFocus,
    status,
    classNameStyle,
    filterValues,
  } = props

  const { getFieldDecorator } = form

  const handleChange = value => {
    if (onChange !== undefined) {
      onChange(value)
    }
  }

  return (
    <React.Fragment>
      <Form.Item label={label} className="mb-0">
        {getFieldDecorator(fieldName, {
          initialValue:
            defaultValue !== null && defaultValue !== undefined
              ? defaultValue
              : getFirstEnumValue
              ? getEnumDefaultOption(
                  enums,
                  entity,
                  property,
                  status,
                  filterValues,
                )
              : undefined,
          rules: [
            {
              required,
              message: formatMessage({ id: 'requiredFieldMessage' }),
            },
          ],
        })(
          <Select
            showSearch
            className={`w-full ${classNameStyle || ''}`}
            size="default"
            ref={combinedRef}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onChange={handleChange}
            allowClear={!disabled && !required}
            disabled={disabled}
            optionFilterProp="children"
            filterOption={(input, option) => {
              let checkFilter = -1
              try {
                checkFilter = option.props.label
                  .toLowerCase()
                  .indexOf(input.toLowerCase())
              } catch {
                checkFilter = -1
              }
              return checkFilter >= 0
            }}
          >
            {enums
              .find(x => x.entidade === entity && x.propriedade === property)
              ?.valores?.filter(
                x =>
                  (!status ||
                    (x.statusValidos && x.statusValidos.includes(status))) &&
                  (!filterValues ||
                    (filterValues && filterValues.includes(x.valor))),
              )
              .map(record => (
                <Option label={record.descricao} value={record.valor}>
                  <div>
                    {record.icone && (
                      <i
                        className={`fa ${record.icone} mr-3`}
                        style={{
                          color: `${record.cor}`,
                        }}
                      />
                    )}
                    <span>{record.descricao}</span>
                  </div>
                </Option>
              ))}
          </Select>,
        )}
      </Form.Item>
    </React.Fragment>
  )
})

NewEnum.propTypes = {
  form: PropTypes.any,
  enums: PropTypes.array,
  entity: PropTypes.string,
  property: PropTypes.string,
  defaultValue: PropTypes.any,
  getFirstEnumValue: PropTypes.bool,
  fieldName: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
  status: PropTypes.any,
  classNameStyle: PropTypes.string,
  filterValues: PropTypes.array,
}

export default NewEnum
