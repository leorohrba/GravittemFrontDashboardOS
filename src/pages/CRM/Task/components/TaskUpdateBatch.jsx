import { Form } from '@ant-design/compatible'
import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import {
  Alert,
  Button,
  Col,
  DatePicker,
  message,
  Modal,
  Row,
  Select,
  Spin,
  TimePicker,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processSellerSearchId = 0

function TaskUpdateBatchImplement(props) {
  const { form, tasks, isAllDay, show } = props

  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)

  const sellerInput = useRef(null)
  const changeSellerInput = useRef(null)
  const [sellerName, setSellerName] = useState('')
  const [sellerSource, setSellerSource] = useState([])
  const [sellerNoResultsMessage, setSellerNoResultsMessage] = useState(null)
  const [loadingSellers, setLoadingSellers] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()

    setAlertMessages([])

    if (tasks.length === 0) {
      setAlertMessages(['Não há selecionadas tarefas para atualizar'])
      return
    }

    if (
      form.getFieldValue('changeSeller') === 1 &&
      form.getFieldValue('changeDateTime') === 1
    ) {
      setAlertMessages(['Não há valores para alterar!'])
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveTasks()
      }
    })
  }

  function handleCancel() {
    props.closeTaskUpdateBatch(false)
  }

  useEffect(() => {
    if (show) {
      clearForm()
      if (changeSellerInput.current) {
        changeSellerInput.current.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function clearForm() {
    form.resetFields()
    setAlertMessages([])
    setSellerName('')
    setSellerSource([])
    setSellerNoResultsMessage(null)
    setLoadingSellers(false)
  }

  const buildDateTime = (date, time, isAllDay) => {
    if (!date) {
      return null
    }

    let expectedDateTime = date.format('YYYY-MM-DD')

    if (isAllDay) {
      expectedDateTime += 'T00:00'
    } else if (time) {
      expectedDateTime += `T${time.format('HH:mm')}`
    } else {
      expectedDateTime += 'T00:00'
    }

    expectedDateTime = moment(expectedDateTime, 'YYYY-MM-DDTHH:mm').format(
      'YYYY-MM-DDTHH:mm',
    )
    return expectedDateTime
  }

  async function saveTasks() {
    const taskBody = { task: [] }

    tasks.map(task => {
      let expectedDateTime = null

      if (form.getFieldValue('changeDateTime') === 2) {
        expectedDateTime = buildDateTime(
          form.getFieldValue('expectedDate'),
          form.getFieldValue('expectedTime')
            ? form.getFieldValue('expectedTime')
            : moment(task.expectedDateTime),
          task.isAllDay,
        )
      }

      const sellerId =
        form.getFieldValue('changeSeller') === 2
          ? form.getFieldValue('sellerId')
          : null

      taskBody.task.push({
        taskId: task.taskId,
        expectedDateTime,
        sellerId,
      })

      return true
    })

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/taskSchedule`,
        data: taskBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        props.closeTaskUpdateBatch(true)
      } else {
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)

      handleAuthError(error)
    }
  }

  // ---- CONTROLE DE VENDEDORES
  const debouncedSellerName = useDebounce(sellerName, 400)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedSellerName) {
      populateSellerSearch(debouncedSellerName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSellerName])

  const handleSearchSeller = value => {
    setSellerName(value)
  }

  useEffect(() => {
    setSellerName('')
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [form.getFieldValue('sellerId')])


  const handleChangeSeller = value => {
    setSellerName('')
  }

  const populateSellerSearch = (name, id, isExact) => {
    setSellerSource([])
    setLoadingSellers(true)
    processSellerSearchId++
    const internalProcessSellerSearchId = processSellerSearchId
    getSellers(name, id, isExact)
      .then(records => {
        if (internalProcessSellerSearchId === processSellerSearchId) {
          const source = []
          setSellerNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({ label: record.shortName, value: record.sellerId }),
            )
          } else {
            setSellerNoResultsMessage('Não foram encontrados vendedores')
          }
          setSellerSource(source)
          setLoadingSellers(false)
        }
      })
      .catch(error => {
        setSellerNoResultsMessage('Não foi possível buscar os vendedores')
        setLoadingSellers(false)
      })
  }

  const getSellers = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isSeller: true,
      sellerId: id,
      getPersonDetails: false,
    }

    return apiCRM
      .get(`/api/crm/person`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.person
        }

        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const sellerValidate = (rule, value, callback) => {
    if (!value &&
      form.getFieldValue('changeSeller') === 2
    ) {
      callback('Informe o vendedor!')
    } else {
      callback()
    }
  }

  const expectedDateValidate = (rule, value, callback) => {
    if (!value && form.getFieldValue('changeDateTime') === 2) {
      callback('Informe a data!')
    } else {
      callback()
    }
  }

  const clearAlerts = () => {
    setAlertMessages([])
  }

  const { getFieldDecorator } = form

  return (
    <Modal
      visible={show}
      title={`Editar em lote (${tasks.length})`}
      width="400px"
      onOk={e => handleSubmit(e)}
      onCancel={handleCancel}
      centered
      footer={[
        <React.Fragment>
          <Button
            type="primary"
            className="formButton"
            loading={isSaving}
            onClick={e => handleSubmit(e)}
            htmlFor="submit-form"
          >
            Atualizar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </React.Fragment>,
      ]}
    >
      <div>
        <Form onSubmit={e => handleSubmit(e, false)}>
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
            <Col className="mb-2">
              <strong>Vendedor:</strong>
            </Col>
          </Row>

          <Row
            style={{
              marginBottom:
                form.getFieldValue('changeSeller') === 1 ? '20px' : '0px',
            }}
          >
            <Col className="mb-2">
              {getFieldDecorator('changeSeller', {
                initialValue: 1,
              })(
                <Select
                  onChange={clearAlerts}
                  autoFocus
                  ref={changeSellerInput}
                >
                  <Option value={1}>Manter valor existente</Option>
                  <Option value={2}>Substituir valor existente com...</Option>
                </Select>,
              )}
            </Col>
          </Row>

          <Row
            style={{
              display:
                form.getFieldValue('changeSeller') === 2 ? 'block' : 'none',
            }}
          >
            <Col>
              <Form.Item>
                {getFieldDecorator('sellerId', {
                  initialValue: null,
                  rules: [
                    {
                      validator: sellerValidate,
                    },
                  ],
                })(
                  <Select
                    placeholder="Procurar"
                    filterOption={false}
                    showSearch
                    onChange={handleChangeSeller}
                    onSearch={handleSearchSeller}
                    ref={sellerInput}
                    showArrow={false}
                    className="select-autocomplete"
                    notFoundContent={
                      loadingSellers ? (
                        <Spin size="small" />
                      ) : sellerName ? (
                        sellerNoResultsMessage
                      ) : null
                    }
                  >
                    {sellerSource.map((record, index) => (
                      <Option key={index} value={record.value}>
                        {record.label}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col className="mb-2">
              <strong>Data:</strong>
            </Col>

            <Col className="mb-2">
              {getFieldDecorator('changeDateTime', {
                initialValue: 1,
              })(
                <Select onChange={clearAlerts}>
                  <Option value={1}>Manter valor existente</Option>
                  <Option value={2}>Substituir valor existente com...</Option>
                </Select>,
              )}
            </Col>
          </Row>

          <Row
            style={{
              display:
                form.getFieldValue('changeDateTime') === 2 ? 'flex' : 'none',
            }}
            type="flex"
            gutter={20}
          >
            <Col style={{ width: '200px' }}>
              <Form.Item>
                {getFieldDecorator('expectedDate', {
                  initialValue: null,
                  rules: [
                    {
                      validator: expectedDateValidate,
                    },
                  ],
                })(<DatePicker placeholder="DD/MM/AAAA" format="DD/MM/YYYY" />)}
              </Form.Item>
            </Col>

            <Col
              style={{ display: isAllDay ? 'none' : 'block', width: '140px' }}
              offset={2}
            >
              <Form.Item>
                {getFieldDecorator('expectedTime', {
                  initialValue: null,
                })(
                  <TimePicker
                    className="w-full"
                    placeholder="HH:MM"
                    format="HH:mm"
                    defaultOpenValue={moment('08:00', 'HH:mm')}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </div>
    </Modal>
  )
}

const TaskUpdateBatch = Form.create()(TaskUpdateBatchImplement)
export default TaskUpdateBatch

TaskUpdateBatchImplement.propTypes = {
  form: PropTypes.object,
  show: PropTypes.bool,
  tasks: PropTypes.array,
  closeTaskUpdateBatch: PropTypes.func,
  isAllDay: PropTypes.bool,
}
