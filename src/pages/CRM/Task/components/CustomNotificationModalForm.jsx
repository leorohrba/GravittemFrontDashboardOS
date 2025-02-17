import { Col, Form, InputNumber, Row, Select } from 'antd'
import React from 'react'

export default function CustomNotificationModalForm({ form, timeTypes }) {
  const isAllDay = form.getFieldValue('isAllDay')
  const selectOptions = isAllDay
    ? timeTypes.filter(t => t.isAllDay)
    : timeTypes.slice(1)

  return (
    <Form layout="vertical" form={form}>
      <Row type="flex" gutter={16} className="items-end">
        <Col span={12}>
          <Form.Item label="Notificação" name="time" initialValue={1}>
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="type" initialValue={selectOptions[0].id}>
              <Select style={{ width: '100%' }}>
                {selectOptions.map(opt => (
                  <Select.Option value={opt.id}>{opt.name} antes</Select.Option>
                ))}
              </Select>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}
