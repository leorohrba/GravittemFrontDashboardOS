/* eslint-disable react/jsx-no-bind */
// import { Form } from '@ant-design/compatible'
import { hasPermission } from '@utils'
import { Col, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import router from 'umi/router'
import NewTaskForm from '../../NewTaskForm'

function TaskFormImplement(props) {
  const {
    taskId,
    show,
    userPermissions,
    refreshData,
    closeTaskForm,
    newTask,
    proposal,
    owner,
    notificationId,
    somenteVisualizacao,
  } = props

  const [newModal, setNewModal] = useState(true)

  const canBeUpdated =
    (hasPermission(userPermissions, 'Alter') || !notificationId) ?? true

  function handleCancel() {
    closeTaskForm()
    if (notificationId) {
      router.push(window.location.pathname)
    }
  }

  useEffect(() => {
    taskId === 0 ? setNewModal(true) : setNewModal(false)
  }, [taskId])

  return (
    <Modal
      visible={show}
      bodyStyle={{ paddingBottom: 0, paddingTop: 0 }}
      title={
        <Row align="middle" type="flex">
          <Col>
            {taskId === 0
              ? 'Nova tarefa'
              : notificationId
              ? 'Notificação da tarefa'
              : canBeUpdated
              ? 'Alterar tarefa'
              : 'Consultar tarefa'}
          </Col>
        </Row>
      }
      width="770px"
      // onOk={e => handleSubmit(e, false)}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <NewTaskForm
        show={show}
        taskId={taskId}
        closeTaskForm={closeTaskForm}
        newTask={newTask}
        owner={owner}
        proposal={proposal}
        refreshData={refreshData}
        alterPermission={hasPermission(userPermissions, 'Alter')}
        alterDatePermission={hasPermission(userPermissions, 'AlterDate')}
        notificationId={notificationId}
        handleClose={handleCancel}
        somenteVisualizacao={somenteVisualizacao}
        newModal={newModal}
      />
    </Modal>
  )
}

export default TaskFormImplement

TaskFormImplement.propTypes = {
  closeTaskForm: PropTypes.func,
  newTask: PropTypes.func,
  owner: PropTypes.any,
  proposal: PropTypes.object,
  refreshData: PropTypes.func,
  show: PropTypes.bool,
  taskId: PropTypes.number,
  userPermissions: PropTypes.array,
}
