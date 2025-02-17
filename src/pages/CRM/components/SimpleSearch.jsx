import { DatePicker, Form, Input, Select } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const InputGroup = Input.Group
const { Option } = Select
const { RangePicker } = DatePicker
const { Search } = Input

function SimpleSearch({
  enableAdvancedSearch,
  searchOptions,
  size,
  style,
  form,
  startSearch,
  setSearchValues,
  fixedTypeWidth,
  ...rest
}) {
  const { getFieldDecorator } = form
  const [placeholder, setPlaceholder] = useState(
    searchOptions.length > 0 ? searchOptions[0].placeholder : null,
  )
  const [searchType, setSearchType] = useState(
    searchOptions.length > 0 ? searchOptions[0].type : null,
  )
  const [dataType, setDateType] = useState(
    searchOptions.length > 0 ? searchOptions[0].dataType : null,
  )
  const [selectOptions, setSelectOptions] = useState(
    searchOptions.length > 0 ? searchOptions[0].options : null,
  )
  const [rangePickerValue, setRangePickerValue] = useState([])
  const [selectValue, setSelectValue] = useState(undefined)
  const [searchValue, setSearchValue] = useState('')
  const inputSearch = useRef(null)
  const inputSelect = useRef(null)
  const inputRange = useRef(null)

  const initialOption = searchOptions.length > 0 ? searchOptions[0].value : null

  const getSearchValues = (searchFieldValue, form) => {
    startSearch(form.getFieldValue('fieldName'), searchFieldValue)
  }

  function changeType(value) {
    for (let i = 0; i < searchOptions.length; i++) {
      if (searchOptions[i].value === value) {
        setSearchType(searchOptions[i].type)
        setPlaceholder(searchOptions[i].placeholder)
        setSelectOptions(searchOptions[i].options)
        setDateType(searchOptions[i].dataType)
        break
      }
    }

    setSelectValue('')
    setSearchValue('')
    setRangePickerValue([])
    setSearchValues(
      form.getFieldValue('fieldName'),
      searchType === 'rangeDate' ? [] : '',
    )
    focusOnComponent()
  }

  useEffect(() => {
    focusOnComponent()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType])

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
    setSelectValue(optionSelected)
    startSearch(form.getFieldValue('fieldName'), optionSelected)
  }

  function changeSearchValue(e) {
    let valueWork = e.target.value

    if (dataType && dataType === 'integer') {
      valueWork = valueWork.replace(/\D/, '')
    }

    setSearchValue(valueWork)

    setSearchValues(form.getFieldValue('fieldName'), valueWork)
  }

  const onRangePickerChange = value => {
    const valueWork = [
      value[0] ? value[0].startOf('day') : null,
      value[1] ? value[1].endOf('day') : null,
    ]
    setRangePickerValue(valueWork)
    startSearch(form.getFieldValue('fieldName'), valueWork)
  }

  return (
    <InputGroup>
      <Form style={{ display: 'flex', height: '40px' }} id="form-search">
        <Form.Item>
          {getFieldDecorator('fieldName', {
            initialValue: initialOption,
          })(
            <Select
              style={{ top: '-1px', width: fixedTypeWidth }}
              id="select-search-options"
              onChange={e => changeType(e)}
            >
              {searchOptions.map((searchOption, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Option key={index} value={searchOption.value}>
                  {searchOption.label}
                </Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item style={{ width: '100%' }}>
          {searchType === 'search' && (
            <Search
              id="simple-search"
              placeholder={placeholder}
              size={size}
              value={searchValue}
              onChange={e => changeSearchValue(e)}
              onSearch={value => getSearchValues(value, form)}
              onPressEnter={e => getSearchValues(e.target.value, form)}
              enterButton
              ref={inputSearch}
              {...rest}
            />
          )}
          {searchType === 'select' && (
            <Select
              placeholder={placeholder}
              className="select-autocomplete"
              style={{ width: '100%', top: '-1px' }}
              value={selectValue || undefined}
              onChange={optionSelected => changeSelect(optionSelected)}
              ref={inputSelect}
              showSearch
              showAction={['focus', 'click']}
              showArrow={false}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
            >
              {selectOptions.map((option, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Option key={index} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          )}
          {searchType === 'rangeDate' && (
            <RangePicker
              value={rangePickerValue}
              onChange={onRangePickerChange}
              format="DD/MM/YYYY HH:mm"
              className="text-left"
              placeholder={['Data inicial', 'Data final']}
              ref={inputRange}
              style={{ width: 320, top: '-1px' }}
            />
          )}
        </Form.Item>
      </Form>
      {enableAdvancedSearch && (
        <span style={{ float: 'right', color: '#1976D2', cursor: 'pointer' }}>
          Pesquisa avançada
        </span>
      )}
    </InputGroup>
  )
}

SimpleSearch.propTypes = {
  enableAdvancedSearch: PropTypes.bool,
  fixedTypeWidth: PropTypes.number,
  form: PropTypes.object,
  searchOptions: PropTypes.array,
  setSearchValues: PropTypes.func,
  size: PropTypes.string,
  startSearch: PropTypes.func,
  style: PropTypes.object,
}

const WrappedSimpleSearch = Form.create({ name: 'simple_search' })(SimpleSearch)

export default WrappedSimpleSearch
