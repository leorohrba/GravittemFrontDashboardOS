/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/button-has-type */
import { hasPermission } from '@utils'
import { Button, Popover, Row, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styles from '@pages/CRM/styles.css'

export default function TaskMoreOptions(props) {
  const {
    canBeUpdated,
    userPermissions,
    task,
    owner,
    keyTable,
    setKeyTable,
    setTask,
    keyModalProposal,
    setKeyModalProposal,
    setShowNewProposalModal,
    setTaskId,
    setKeyModalForm,
    keyModalForm,
    setShowTaskForm,
  } = props
  const buttonRef = useRef(null)
  const [keyMoreOptions, setKeyMoreOptions] = useState(1)
  const [popOverVisible, setPopOverVisible] = useState(false)
  const handleVisibleChange = (visible, key) => {
    setPopOverVisible(visible)
    if (visible) {
      setKeyMoreOptions(keyMoreOptions + 1)
    }
    setKeyTable(key)
  }

  const editTask = taskIdToEdit => {
    setTaskId(taskIdToEdit)
    setKeyModalForm(keyModalForm + 1)
    setShowTaskForm(true)
  }

  const createProposal = taskForProposal => {
    setPopOverVisible(false)
    setTask(taskForProposal)
    setKeyModalProposal(keyModalProposal + 1)
    setShowNewProposalModal(true)
  }

  useEffect(() => {
    setTimeout(() => {
      if (buttonRef.current) {
        buttonRef.current.focus()
      }
    }, 100)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Tooltip placement="top" title="Mais opções">
      <Popover
        placement="bottomLeft"
        overlayClassName="table-popover"
        visible={popOverVisible && keyTable === props.taskId}
        onVisibleChange={visible => handleVisibleChange(visible, props.taskId)}
        trigger="click"
        content={
          <React.Fragment>
            <Row
              style={{
                display:
                  !task.realizedDate &&
                  ((owner?.ownerProfile &&
                    owner?.ownerProfile !== 'Franchise') ||
                    task.franchiseeId === owner?.franchiseeId) &&
                  !task.proposalId &&
                  hasPermission(userPermissions, 'Alter')
                    ? 'block'
                    : 'none',
              }}
            >
              <button
                className="menuButton"
                onClick={() => createProposal(task)}
                style={{
                  width: '120px',
                }}
              >
                Criar negócio
              </button>
            </Row>
            <Row>
              <button
                className="menuButton"
                ref={buttonRef}
                onClick={() => editTask(props.taskId)}
                style={{ width: '120px' }}
              >
                {canBeUpdated && hasPermission(userPermissions, 'Alter')
                  ? 'Editar'
                  : 'Consultar'}
              </button>
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
          <i className={`fa fa-ellipsis-h ${styles.crmColorIconEdit}`} />
        </Button>
      </Popover>
    </Tooltip>
  )
}

TaskMoreOptions.propTypes = {
  canBeUpdated: PropTypes.bool,
  owner: PropTypes.any,
  task: PropTypes.object,
  taskId: PropTypes.number,
  userPermissions: PropTypes.array,
}
