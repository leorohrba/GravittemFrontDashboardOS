import { Alert, Form, Row, Col, Select, Input, DatePicker } from 'antd'
import React, { useState, useEffect } from 'react'
import InputSeller from './InputSeller'
import PropTypes from 'prop-types'
import styles from '@pages/CRM/styles.css'

const { Option } = Select

export default function TaskGenerateModalForm(props) {
  const {
    handleSubmit,
    form,
    alertMessages,
    sellerSource,
    setSellerSource,
    taskTypes,
    salesFunnels,
  } = props

  const [funnelStages, setFunnelStages] = useState([])

  useEffect(() => {
    form.resetFields()
    if (salesFunnels?.length > 0) {
      setFunnelStages(salesFunnels[0].funnelStage)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesFunnels])

  const handleChangeSalesFunnel = value => {
    const salesFunnel = salesFunnels.find(x => x.salesFunnelId === value)
    let funnelStageId = null
    if (salesFunnel && salesFunnel?.funnelStage?.length > 0) {
      funnelStageId = salesFunnel.funnelStage[0].funnelStageId
      setFunnelStages(salesFunnel.funnelStage)
    }
    form.setFieldsValue({ funnelStageId })
  }

  return (
    <React.Fragment>
      <Form layout="vertical" form={form} onSubmit={e => handleSubmit(e)}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}

        <Row>
          <Col span={12}>
            <InputSeller
              form={form}
              sellerSource={sellerSource}
              setSellerSource={setSellerSource}
            />
          </Col>
        </Row>

        <Row type="flex" gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Data do primeiro contato"
              name="expectedDate"
              initialValue={null}
              rules={[{ required: true, message: 'Campo obrigatório!' }]}
            >
              <DatePicker
                className="w-2/3"
                placeholder="DD/MM/AAAA"
                format="DD/MM/YYYY"
                style={{width: '100%'}}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tipo de tarefa"
              name="taskTypeId"
              initialValue={null}
              rules={[{ required: true, message: 'Campo obrigatório!' }]}
            >
              <Select
                placeholder="Procurar"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => {
                  let checkFilter = -1
                  try {
                    checkFilter = option.props.label // children.props.children[1].props.children
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
                    label={taskType.name}
                    key={taskType.taskTypeId}
                    value={taskType.taskTypeId}
                  >
                    <i
                      className={`mr-4 fa ${taskType.icon} fa-fw ${styles.crmColorIconGrid}`}
                    />
                    {taskType.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={12}>
          <Col span={24}>
            <Form.Item
              label="Assunto"
              name="subject"
              initialValue={null}
              rules={[{ required: true, message: 'Campo obrigatório!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              label="Funil"
              name="salesFunnelId"
              initialValue={
                salesFunnels?.length > 0 ? salesFunnels[0].salesFunnelId : null
              }
              rules={[{ required: true, message: 'Campo obrigatório!' }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={value => handleChangeSalesFunnel(value)}
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {salesFunnels.map((s, index) => (
                  <Option key={s.salesFunnelId} value={s.salesFunnelId}>
                    {s.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Fase do funil"
              name="funnelStageId"
              initialValue={
                salesFunnels?.length > 0 &&
                salesFunnels[0].funnelStage?.length > 0
                  ? salesFunnels[0].funnelStage[0].funnelStageId
                  : null
              }
              rules={[{ required: true, message: 'Campo obrigatório!' }]}
            >
              <Select
                showSearch
                placeholder="Selecione uma fase"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  let checkFilter = -1
                  try {
                    checkFilter = option.props.label // children.props.children[1].props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase())
                  } catch {
                    checkFilter = -1
                  }
                  return checkFilter >= 0
                }}
              >
                {funnelStages.map(record => (
                  <Option
                    label={record.name}
                    key={record.funnelStageId}
                    value={record.funnelStageId}
                  >
                    <i
                      className={`mr-4 fa ${record.icon} fa-fw ${styles.crmColorIconGrid}`}
                    />
                    {record.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <input type="submit" id="submit-form" className="hidden" />
      </Form>
    </React.Fragment>
  )
}

TaskGenerateModalForm.propTypes = {
  form: PropTypes.any,
  handleSubmit: PropTypes.func,
  alertMessages: PropTypes.array,
  sellerSource: PropTypes.array,
  setSellerSource: PropTypes.func,
  taskTypes: PropTypes.array,
  salesFunnels: PropTypes.array,
}
