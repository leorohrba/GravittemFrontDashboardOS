/* eslint-disable react-hooks/exhaustive-deps */
import { DatePicker, Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export function NewSimpleSearchForm({
  searchOptions,
  form,
  fieldNameIndex,
  setSearchValues,
  getSearchValues,
  inputSize,
  updateTags,
  searchBoxWidth,
  selectOptionsWidth,
  defaultType,
  disableAutoFocus,
  isSaveSearch,
}) {
  const initialOption =
    defaultType || (searchOptions.length > 0 ? searchOptions[0].value : null)
  const { getFieldDecorator } = form

  const [placeholder, setPlaceholder] = useState(
    searchOptions.length > 0 ? searchOptions[0].placeholder : null,
  )
  const [searchType, setSearchType] = useState(
    searchOptions.length > 0 ? searchOptions[0].type : null,
  )

  const [selectOptions, setSelectOptions] = useState(
    searchOptions.length > 0 ? searchOptions[0].options : null,
  )

  const [searchLabel, setSearchLabel] = useState(
    searchOptions.length > 0 ? searchOptions[0].value : '',
  )

  const [showAction, setShowAction] = useState(['click'])

  const inputSearch = useRef(null)
  const inputSelect = useRef(null)
  const inputRange = useRef(null)

  const fieldNameDescription = `fieldName_${fieldNameIndex || 0}`
  const searchBoxDescription = `searchBox_${fieldNameIndex || 0}`

  function changeType(value) {
    let newSearchType = null
    for (let i = 0; i < searchOptions.length; i++) {
      if (searchOptions[i].value === value) {
        newSearchType = searchOptions[i].type
        setSearchLabel(searchOptions[i].value)
        setSearchType(searchOptions[i].type)
        setPlaceholder(searchOptions[i].placeholder)
        setSelectOptions(searchOptions[i].options)
        break
      }
    }

    form.setFieldsValue({
      [searchBoxDescription]:
        (newSearchType || searchType) === 'rangeDate'
          ? getInitialRange(value)
          : undefined,
    })
  }

  useEffect(() => {
    if (searchType && searchLabel) {
      form.setFieldsValue({
        [searchBoxDescription]:
          searchType === 'rangeDate' ? getInitialRange(searchLabel) : undefined,
      })
    }
  }, [searchType, searchLabel])

  function getInitialRange(value) {
    const searchOption = searchOptions.find(x => x.value === value)
    if (searchOption?.initialValue) {
      return searchOption.initialValue
    } else {
      return []
    }
  }

  useEffect(() => {
    // dar o foco no componente quando o tipo mudar
    !disableAutoFocus && focusOnComponent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLabel])

  useEffect(() => {
    !disableAutoFocus && focusOnComponent()
    // mudar o search se houver um padrão
    if (defaultType) {
      changeType(defaultType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function focusOnComponent() {
    if (inputSearch.current != null && searchType === 'search') {
      inputSearch.current.focus()
    }

    if (inputSelect.current != null && searchType === 'select') {
      inputSelect.current.focus()
    }

    if (inputRange.current != null && searchType === 'rangeDate') {
      inputRange.current.focus()
    }
  }

  const changeSelect = optionSelected => {
    if (
      optionSelected !== null &&
      optionSelected !== '' &&
      optionSelected !== undefined
    ) {
      // OBS: valor pode ser 0 (zero) ou 'false'
      updateTags &&
        updateTags(form.getFieldValue(fieldNameDescription), optionSelected)
    }
  }

  const onRangePickerChange = value => {
    const valueWork = [
      value[0] ? value[0].startOf('day') : null,
      value[1] ? value[1].endOf('day') : null,
    ]
    updateTags &&
      updateTags(form.getFieldValue(fieldNameDescription), valueWork)
  }

  const addFilterToTag = e => {
    e.target.value &&
      updateTags &&
      updateTags(form.getFieldValue(fieldNameDescription), e.target.value)
    form.resetFields(searchBoxDescription)
  }

  return (
    <Form
      style={{
        display: 'flex',
        height: '33px',
      }}
    >
      <Form.Item>
        {getFieldDecorator(fieldNameDescription, {
          initialValue: initialOption,
        })(
          <Select
            onFocus={() => setShowAction(['focus', 'click'])}
            style={{
              width: selectOptionsWidth || 150,
            }}
            className="select-search-options"
            id="select-search-options"
            onChange={e => changeType(e)}
          >
            {searchOptions.map((
              searchOption,
              index, // eslint-disable-next-line react/no-array-index-key
            ) => (
              <Option key={index} value={searchOption.value}>
                {searchOption.label}
              </Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <Form.Item
        style={{
          width: searchBoxWidth || 300,
        }}
      >
        {searchType === 'search' &&
          getFieldDecorator(searchBoxDescription, { initialValue: '' })(
            <Input
              id="simple-search"
              className="rounded-none"
              placeholder={placeholder}
              size={inputSize}
              onPressEnter={e => !isSaveSearch && addFilterToTag(e)}
              ref={inputSearch}
            />,
          )}
        {searchType === 'select' &&
          getFieldDecorator(searchBoxDescription, {})(
            <Select
              placeholder={placeholder}
              className="no-select-border fix-arrow-click"
              style={{
                width: '100%',
              }}
              onChange={optionSelected => changeSelect(optionSelected)}
              ref={inputSelect}
              showSearch
              allowClear
              showAction={showAction}
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
              {selectOptions.map((
                option,
                index, // eslint-disable-next-line react/no-array-index-key
              ) => (
                <Option label={option.label} key={index} value={option.value}>
                  {option.render ? option.render : option.label}
                </Option>
              ))}
            </Select>,
          )}
        {searchType === 'rangeDate' &&
          getFieldDecorator(searchBoxDescription, { initialValue: [] })(
            <RangePicker
              className="no-range-picker-border"
              onChange={onRangePickerChange}
              format="DD/MM/YYYY"
              placeholder={['Data inicial', 'Data final']}
              ref={inputRange}
              style={{
                width: '100%',
              }}
              suffixIcon={
                getInitialRange(searchLabel)?.length === 0 ||
                form.getFieldValue(searchBoxDescription)?.length > 0 ? (
                  undefined
                ) : (
                  <i
                    className="fa fa-repeat cursor-pointer"
                    style={{ color: 'green' }}
                    onClick={() =>
                      form.setFieldsValue({
                        [searchBoxDescription]: getInitialRange(searchLabel),
                      })
                    }
                  />
                )
              }
            />,
          )}
      </Form.Item>
    </Form>
  )
}

NewSimpleSearchForm.propTypes = {
  defaultType: PropTypes.bool,
  disableAutoFocus: PropTypes.bool,
  isSaveSearch: PropTypes.bool,
  fieldNameIndex: PropTypes.number,
  form: PropTypes.object,
  getSearchValues: PropTypes.func,
  inputSize: PropTypes.number,
  searchBoxWidth: PropTypes.number,
  searchOptions: PropTypes.array,
  selectOptionsWidth: PropTypes.number,
  setSearchValues: PropTypes.func,
  updateTags: PropTypes.func,
}
