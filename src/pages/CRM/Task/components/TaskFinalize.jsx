import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Button, Col, Input, message, Row, Spin, Popover, Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styles from '@pages/CRM/styles.css'

const { TextArea } = Input

export default function TaskFinalize({
  taskId,
  closeTaskFinalize,
  keyTable,
  setKeyTable,
}) {
  const observationInput = useRef(null)
  const [observation, setObservation] = useState(null)
  const [loadingForm, setLoadingForm] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [task, setTask] = useState(null)
  const [keyTaskFinalize, setKeyTaskFinalize] = useState(1)
  const [popOverFinalizeVisible, setPopOverFinalizeVisible] = useState(false)

  const handleVisibleFinalizeTaskChange = (visible, key) => {
    setPopOverFinalizeVisible(visible)
    if (visible) {
      setKeyTaskFinalize(keyTaskFinalize + 1)
    }
    setKeyTable(key)
  }

  useEffect(() => {
    getTask()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function getTask() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/task`,
        params: { taskId },
      })

      setLoadingForm(false)

      const { data } = response

      if (data.isOk) {
        if (data.task.length === 0) {
          message.error('Tarefa não existe ou não há permissão para acesso')
          closeTaskFinalize(false, false)
        } else {
          const taskWork = data.task[0]
          setTask(taskWork)
          setObservation(taskWork.observation)
          if (observationInput.current) {
            observationInput.current.focus()
          }
        }
      } else {
        message.error(data.message)
        closeTaskFinalize(false, false)
      }
    } catch (error) {
      handleAuthError(error)
      closeTaskFinalize(false, false)
    }
  }

  const handleChangeObservation = e => {
    setObservation(e.target.value)
  }

  async function finalizeTask(openNewTask) {
    const taskBody = {
      task: {
        taskId: task.taskId,
        taskTypeId: task.taskTypeId,
        subject: task.subject,
        expectedDateTime: task.expectedDateTime,
        expectedDuration: task.expectedDuration,
        sellerId: task.sellerId,
        companyId: task.companyId,
        franchiseeId: task.franchiseeId,
        observation,
        proposalId: task.proposalId,
        isAllDay: task.isAllDay,
        realizedDate: moment().format('YYYY-MM-DDTHH:mm:ss'),
      },
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/task`,
        data: taskBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        closeTaskFinalize(true, openNewTask)
      } else {
        if (data.validationMessageList.length > 0) {
          message.error(data.validationMessageList[0])
        } else {
          message.error(data.message)
        }
        closeTaskFinalize(false, false)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
      closeTaskFinalize(false, false)
    }
  }

  return (
    <Tooltip placement="top" title="Concluir e agendar">
      <Popover
        placement="bottomLeft"
        overlayClassName="table-popover"
        trigger="click"
        visible={popOverFinalizeVisible && keyTable === taskId}
        onVisibleChange={visible =>
          handleVisibleFinalizeTaskChange(visible, taskId)
        }
        content={
          <React.Fragment>
            <Row align="middle" type="flex">
              <Col className="mx-2 my-2">
                <strong>{loadingForm ? 'Carregando...' : 'Observação:'}</strong>
              </Col>
              <Col>
                <div
                  className="px-2"
                  style={{ display: loadingForm ? 'block' : 'none' }}
                >
                  <Spin size="small" />
                </div>
              </Col>
            </Row>
            <Row>
              <Col className="w-full mx-3 mb-4">
                <TextArea
                  rows={1}
                  disabled={loadingForm}
                  placeholder="Inserir observações"
                  ref={observationInput}
                  value={observation}
                  onChange={handleChangeObservation}
                  autoSize={{
                    minRows: 1,
                    maxRows: 6,
                  }}
                />
              </Col>
            </Row>
            <Row type="flex" gutter={6}>
              <Col>
                <Button
                  type="primary"
                  disabled={loadingForm}
                  loading={isSaving}
                  className="formButton ml-3"
                  onClick={() => finalizeTask(true)}
                >
                  Concluir e agendar
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  disabled={loadingForm}
                  loading={isSaving}
                  className="formButton"
                  onClick={() => finalizeTask(false)}
                >
                  Concluir
                </Button>
              </Col>
              <Col>
                <Button
                  className="mr-3 mb-3"
                  onClick={() => {
                    setPopOverFinalizeVisible(false)
                  }}
                >
                  Cancelar
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        }
      >
        <Button
          shape="circle"
          size="default"
          type="primary"
          ghost
          className="iconButton"
        >
          <i className={`fa fa-check ${styles.crmColorIconEdit}`} />
        </Button>
      </Popover>
    </Tooltip>
  )
}

TaskFinalize.propTypes = {
  taskId: PropTypes.number,
  closeTaskFinalize: PropTypes.func,
}
