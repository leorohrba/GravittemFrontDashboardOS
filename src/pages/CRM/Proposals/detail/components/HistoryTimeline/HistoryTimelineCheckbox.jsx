import { Checkbox } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const CheckboxGroup = Checkbox.Group

export default function HistoryTimelineCheckbox({
  indeterminate,
  onCheckAllChange,
  checkAll,
  plainOptions,
  checkedList,
  onChange,
}) {
  return (
    <div className="mb-16">
      <div style={{ borderBottom: '1px solid #E9E9E9' }}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          Selecionar todos
        </Checkbox>
      </div>
      <br />
      <CheckboxGroup
        options={plainOptions}
        value={checkedList}
        onChange={onChange}
      />
    </div>
  )
}

HistoryTimelineCheckbox.propTypes = {
  checkAll: PropTypes.bool,
  checkedList: PropTypes.array,
  indeterminate: PropTypes.bool,
  onChange: PropTypes.func,
  onCheckAllChange: PropTypes.func,
  plainOptions: PropTypes.array,
}
