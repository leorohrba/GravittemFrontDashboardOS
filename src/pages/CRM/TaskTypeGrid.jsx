/**
 * breadcrumb: Cadastro de Tipo de Tarefas
 */
/* eslint-disable react/jsx-no-bind */
import DefaultTable from '@components/DefaultTable'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import {
  customSort,
  getPermissions,
  handleAuthError,
  hasPermission,
} from '@utils'
import { Button, Col, message, Modal, Row, Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import TaskTypeForm from './components/TaskTypeForm'

export default function TaskTypeGrid(props) {
  const [userPermissions, setUserPermissions] = useState([])
  const [taskTypes, setTaskTypes] = useState([])
  const [loadingTaskTypes, setLoadingTaskTypes] = useState(true)
  const [showTaskTypeForm, setShowTaskTypeForm] = useState(false)
  const [taskTypeId, setTaskTypeId] = useState(0)
  const [key, setKey] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  let taskTypePerformed = []

  const columns = [
    {
      title: 'Tipo de Tarefa',
      dataIndex: 'name',
      sorter: (a, b) => customSort(a.name, b.name),
      render: (text, record) => (
        <div>
          <i
            className={`mr-4 fa ${record.icon} fa-lg fa-fw ${styles.crmColorIconGrid}`}
          />
          {record.name}
        </div>
      ),
      width: '90%',
    },
    {
      title: '',
      dataIndex: '',
      render: (text, record) => (
        <div>
          {record.canBeUpdated && hasPermission(userPermissions, 'Alter') && (
            <Tooltip placement="top" title="Editar">
              <Button
                shape="circle"
                size="default"
                type="primary"
                ghost
                className="iconButton"
                onClick={() => editTaskType(record.taskTypeId)}
              >
                <i
                  className={`fa fa-pencil fa-lg ${styles.crmColorIconEdit}`}
                />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => onSelectChangeTaskType(selectedRowKeys),
    getCheckboxProps: record => ({
      disabled: !record.canBeUpdated, // Column configuration not to be checked
    }),
  }

  const onSelectChangeTaskType = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }

  useEffect(() => {
    setPermissions()
    getTaskTypes()
  }, [])

  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  function editTaskType(taskTypeId) {
    setTaskTypeId(taskTypeId)
    setShowTaskTypeForm(true)
    setKey(key + 1)
  }

  function closeTaskTypeForm(refreshData) {
    setShowTaskTypeForm(false)
    if (refreshData) {
      getTaskTypes()
    }
  }

  async function getTaskTypes() {
    setLoadingTaskTypes(true)

    setSelectedRowKeys([])

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/tasktype`,
      })

      const { data } = response

      if (data.isOk) {
        setTaskTypes(data.taskType)
        setLoadingTaskTypes(false)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteTaskTypes() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir o tipo de tarefa selecionado?'
          : 'Você tem certeza que deseja excluir os tipos de tarefas selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteTaskTypes()
      },
    })
  }

  function addTaskTypePerformed(taskTypeId) {
    taskTypePerformed.push(taskTypeId)

    if (taskTypePerformed.length >= selectedRowKeys.length) {
      taskTypePerformed = []
      getTaskTypes()
    }
  }

  function deleteTaskTypes() {
    setLoadingTaskTypes(true)
    taskTypePerformed = []

    for (let i = 0; i < selectedRowKeys.length; i++) {
      deleteTaskType(selectedRowKeys[i])
    }
  }

  async function deleteTaskType(taskTypeId) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/tasktype`,
        params: { taskTypeId },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }

      // setTaskTypePerformed(array => array.concat(taskTypeId));
      addTaskTypePerformed(taskTypeId)
    } catch (error) {
      handleAuthError(error)
      // Adiciona task a lista do mesmo jeito
      addTaskTypePerformed(taskTypeId)
    }
  }

  return (
    <React.Fragment>
      <div className="p-4">
        <Row type="flex" className="mb-2" gutter={12}>
          <Col
            style={{
              display:
                selectedRowKeys.length === 0 &&
                hasPermission(userPermissions, 'Include')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="primary"
              onClick={() => editTaskType(0)}
              disabled={loadingTaskTypes}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              Cadastrar tipo de tarefa
            </Button>
          </Col>
          <Col
            style={{
              display:
                selectedRowKeys.length > 0 &&
                hasPermission(userPermissions, 'Exclude')
                  ? 'block'
                  : 'none',
            }}
          >
            <Button
              type="outline"
              onClick={() => confirmDeleteTaskTypes()}
              disabled={loadingTaskTypes}
            >
              <i className="fa fa-trash fa-lg mr-3" />
              {`Excluir (${selectedRowKeys.length})`}
            </Button>
          </Col>
        </Row>

        <DefaultTable
          rowKey={record => record.taskTypeId}
          loading={loadingTaskTypes}
          rowSelection={
            hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined
          }
          columns={columns}
          dataSource={taskTypes}
        />

        <TaskTypeForm
          show={showTaskTypeForm}
          taskTypeId={taskTypeId}
          closeTaskTypeForm={closeTaskTypeForm}
          key={key}
        />
      </div>
    </React.Fragment>
  )
}
