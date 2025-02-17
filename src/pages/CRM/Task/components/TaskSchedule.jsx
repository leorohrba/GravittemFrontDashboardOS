/* eslint-disable react/button-has-type */
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { message, Row, Spin, Tooltip, Popover, Button } from 'antd'
import styles from '@pages/CRM/styles.css'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

export default function TaskSchedule(props) {
  const { taskId, isAllDay, getTasks, keyTable, setKeyTable } = props

  const buttonRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const [keyTaskSchedule, setKeyTaskSchedule] = useState(1)

  const closeTaskSchedule = refreshData => {
    setPopOverTaskSchedule(false)

    if (refreshData) {
      getTasks()
    }
  }

  const handleVisibleTaskScheduleChange = (visible, key) => {
    setPopOverTaskSchedule(visible)
    if (visible) {
      setKeyTaskSchedule(keyTaskSchedule + 1)
    }
    setKeyTable(key)
  }
  const [popOverTaskSchedule, setPopOverTaskSchedule] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus()
      }
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function scheduleTask(option) {
    let expectedDateTime

    if (option === 1) {
      expectedDateTime = moment().add(15, 'minutes')
    } else if (option === 2) {
      expectedDateTime = moment().add(1, 'hours')
    } else if (option === 3) {
      expectedDateTime = moment(
        `${moment()
          .add(1, 'days')
          .format('YYYY-MM-DD')} 08:00`,
        'YYYY-MM-DD HH:mm',
      )
    } else if (option === 4) {
      expectedDateTime = moment(
        `${moment()
          .day(8)
          .format('YYYY-MM-DD')} 08:00`,
        'YYYY-MM-DD HH:mm',
      )
    }

    if (isAllDay) {
      expectedDateTime = moment(
        `${expectedDateTime.format('YYYY-MM-DD')} 00:00`,
        'YYYY-MM-DD HH:mm',
      )
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/task`,
        params: { taskId },
      })

      const { data } = response

      if (data.isOk) {
        if (data.task.length === 0) {
          message.error('Tarefa não existe ou não há permissão para acesso')
          closeTaskSchedule(false)
        } else {
          const task = data.task[0]

          const taskBody = {
            task: {
              taskId: task.taskId,
              taskTypeId: task.taskTypeId,
              subject: task.subject,
              expectedDateTime: expectedDateTime.format('YYYY-MM-DDTHH:mm:ss'),
              expectedDuration: task.expectedDuration,
              sellerId: task.sellerId,
              companyId: task.companyId,
              franchiseeId: task.franchiseeId,
              observation: task.observation,
              proposalId: task.proposalId,
              isAllDay: task.isAllDay,
              realizedDate: task.realizedDate,
            },
          }

          try {
            const responseSave = await apiCRM({
              method: 'POST',
              url: `/api/crm/task`,
              data: taskBody,
              headers: { 'Content-Type': 'application/json' },
            })

            setIsSaving(false)

            const dataSave = responseSave.data

            if (dataSave.isOk) {
              closeTaskSchedule(true)
            } else {
              if (dataSave.validationMessageList.length > 0) {
                message.error(dataSave.validationMessageList[0])
              } else {
                message.error(dataSave.message)
              }
              closeTaskSchedule(false)
            }
          } catch (error) {
            setIsSaving(false)
            handleAuthError(error)
            closeTaskSchedule(false)
          }
        }
      } else {
        message.error(data.message)
        closeTaskSchedule(false)
      }
    } catch (error) {
      handleAuthError(error)
      closeTaskSchedule(false)
    }
  }

  return (
    <Tooltip placement="top" title="Adiar atividade">
      <Popover
        placement="bottomLeft"
        overlayClassName="table-popover"
        visible={popOverTaskSchedule && keyTable === taskId}
        onVisibleChange={visible =>
          handleVisibleTaskScheduleChange(visible, taskId)
        }
        trigger="click"
        content={
          <React.Fragment>
            <Spin spinning={isSaving}>
              <Row style={{ display: isAllDay ? 'none' : 'block' }}>
                <button
                  className="menuButton"
                  onClick={() => scheduleTask(1)}
                  style={{ width: '220px' }}
                >
                  Daqui 15 minutos
                </button>
              </Row>
              <Row style={{ display: isAllDay ? 'none' : 'block' }}>
                <button
                  className="menuButton"
                  onClick={() => scheduleTask(2)}
                  style={{ width: '220px' }}
                >
                  Daqui 1 hora
                </button>
              </Row>
              <Row>
                <button
                  className="menuButton"
                  onClick={() => scheduleTask(3)}
                  style={{ width: '220px' }}
                >
                  {isAllDay ? 'Amanhã' : 'Amanhã de manhã'}
                </button>
              </Row>
              <Row>
                <button
                  className="menuButton"
                  ref={buttonRef}
                  onClick={() => scheduleTask(4)}
                  style={{ width: '220px' }}
                >
                  Próxima segunda-feira
                </button>
              </Row>
            </Spin>
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
          <i className={`fa fa-clock-o ${styles.crmColorIconEdit}`} />
        </Button>
      </Popover>
    </Tooltip>
  )
}

TaskSchedule.propTypes = {
  taskId: PropTypes.number,
  isAllDay: PropTypes.bool,
}
