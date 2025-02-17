/* eslint-disable react/destructuring-assignment */
import { DatePicker, Form, InputNumber, Modal } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
// eslint-disable-next-line import/no-cycle
import { EditableContext } from './LeftBarParcelsModalTable'

const { confirm } = Modal

export class LeftBarParcelsEditableCell extends React.Component {
  state = {
    editing: false,
  }

  toggleEdit = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const editing = !this.state.editing
    this.setState({ editing })
  }

  save = e => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return
      }
      this.toggleEdit()
      handleSave({ ...record, ...values })
    })
  }

  saveDate = e => {
    const { record, handleSave } = this.props
    this.form.validateFields((error, values) => {
      const newDate = moment(values.dueDate).format('YYYY-MM-DD')
      // eslint-disable-next-line no-underscore-dangle
      const newValues = { dueDate: newDate }
      if (error && error[e.currentTarget.id]) {
        return
      }
      if (record.number === 1) {
        confirm({
          title: 'Editar outras parcelas',
          content: 'Deseja alterar as demais parcelas com base na primeira?',
          onOk: () => handleSave({ ...record, ...newValues }, true),
          onCancel: () => handleSave({ ...record, ...newValues }, false),
          cancelText: 'Não',
          okText: 'Sim',
          okButtonProps: {
            size: 'large',
          },
          cancelButtonProps: {
            size: 'large',
          },
        })
      } else {
        handleSave({ ...record, ...newValues }, false)
      }
      this.toggleEdit()
    })
  }

  exitDate = e => {
    this.toggleEdit()
  }

  renderCell = form => {
    this.form = form
    const { children, dataIndex, record, title, isDate } = this.props
    const { editing } = this.state
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} é um campo obrigatório.`,
            },
          ],
          initialValue: isDate ? moment(record[dataIndex]) : record[dataIndex],
        })(
          isDate ? (
            <DatePicker
              placeholder="DD/MM/AAAA"
              open
              onOk={this.saveDate}
              onBlur={this.exitDate}
              showTime
              format="DD/MM/YYYY"
            />
          ) : (
            <InputNumber
              autoFocus
              onPressEnter={this.save}
              decimalSeparator=","
              precision={2}
              onBlur={this.save}
            />
          ),
        )}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
        role="textbox"
      >
        {children}
      </div>
    )
  }

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    )
  }
}
LeftBarParcelsEditableCell.propTypes = {
  children: PropTypes.any,
  dataIndex: PropTypes.any,
  editable: PropTypes.any,
  handleSave: PropTypes.any,
  index: PropTypes.any,
  isDate: PropTypes.any,
  record: PropTypes.any,
  title: PropTypes.any,
  value: PropTypes.any,
}
