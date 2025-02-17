import { Form, Select, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

const { Option } = Select

const TaskFormInputTaskType = props => {
  const { canBeUpdated, taskTypes, onChange, editData } = props
  return (
    <Form.Item
      label="Tipo de tarefa"
      name="taskTypeId"
      initialValue={editData ? editData?.taskTypeId : null}
      rules={[{ required: true, message: 'Informe o tipo de tarefa!' }]}
      className="mb-1"
    >
        <Select
          placeholder="Procurar"
          disabled={!canBeUpdated}
          showSearch
          optionFilterProp="children"
          onChange={() => onChange()}
          filterOption={(input, option) => {
            let checkFilter = -1
            try {
              checkFilter = option?.props.label // children.props.children[1].props.children
                .toLowerCase()
                .indexOf(input.toLowerCase())
            } catch {
              checkFilter = -1
            }
            return checkFilter >= 0
          }}
        >
          {taskTypes.map(taskType => (
            <Option
              label={taskType.label}
              key={taskType.value}
              value={taskType.value}
            >
              <Tooltip title={taskType.label}>{taskType.render}</Tooltip>
            </Option>
          ))}
        </Select>
    </Form.Item>
  )
}

TaskFormInputTaskType.propTypes = {
  canBeUpdated: PropTypes.bool,
  taskTypes: PropTypes.array,
  onChange: PropTypes.func,
  editData: PropTypes.any,
}

export default TaskFormInputTaskType
