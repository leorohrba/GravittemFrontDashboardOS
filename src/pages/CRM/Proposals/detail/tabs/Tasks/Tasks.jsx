import { handleAuthError } from '@utils'
import { Modal ,message} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'


import { apiCRM } from '@services/api'
import TaskForm from '../../../../Task/components/TaskForm'
import TasksHeader from './TasksHeader'
import TasksTable from './TasksTable'

export default function Tasks(props) {
  const {
    proposalId,
    onChange,
    userPermissions,
    proposalCanBeUpdate,
    proposal,
    owner,
  } = props
  const [tableSelectedRowKeys, setTableSelectedRowKeys] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [tasks, setTasks] = useState([])
  const [keyTaskForm, setKeyTaskForm] = useState(0)
  const [keyRowTable, setKeyRowTable] = useState(-1)
  const [keyTable, setKeyTable] = useState(0)

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [taskId, setTaskId] = useState(0)
  let taskPerformed = []

  useEffect(() => {
    getTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshData = () => {
    onChange()
    getTasks()
  }

  async function getTasks() {
    setKeyRowTable(-1)
    setLoadingTasks(true)
    setTableSelectedRowKeys([])

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/Task`,
        params: { proposalId },
      })

      const { data } = response

      setLoadingTasks(false)

      if (data.isOk) {
        setTasks(data.task)
        setKeyTable(keyTable + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingTasks(false)
      handleAuthError(error)
    }
  }

  const editTask = taskIdToEdit => {
    setTaskId(taskIdToEdit)
    setKeyTaskForm(keyTaskForm + 1)
    setShowTaskForm(true)
  }

  const closeTaskForm = () => {
    setShowTaskForm(false)
  }

  function confirmDeleteTasks() {
    Modal.confirm({
      content:
        tableSelectedRowKeys.length === 1
          ? 'Você tem certeza que deseja excluir a tarefa selecionada?'
          : 'Você tem certeza que deseja excluir as tarefas selecionadas?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deleteTasks()
      },
    })
  }

  function addTaskPerformed(taskPerformedId) {
    taskPerformed.push(taskPerformedId)

    if (taskPerformed.length >= tableSelectedRowKeys.length) {
      taskPerformed = []
      refreshData()
    }
  }

  function deleteTasks() {
    setLoadingTasks(true)
    taskPerformed = []
    tableSelectedRowKeys.map(selectedRowKey => deleteTask(selectedRowKey))
  }

  async function deleteTask(taskIdToDelete) {
    try {
      const response = await apiCRM({
        method: 'DELETE',
        url: `/api/crm/task`,
        params: { taskId: taskIdToDelete },
      })

      const { data } = response

      if (!data.isOk) {
        message.error(data.message)
      }
      addTaskPerformed(taskIdToDelete)
    } catch (error) {
      handleAuthError(error)
      // Adiciona à lista do mesmo jeito
      addTaskPerformed(taskIdToDelete)
    }
  }

  return (
    <div className="w-full">
      <TasksHeader
        tableSelectedRowKeys={tableSelectedRowKeys}
        setTableSelectedRowKeys={setTableSelectedRowKeys}
        userPermissions={userPermissions}
        proposalCanBeUpdate={proposalCanBeUpdate}
        editTask={editTask}
        confirmDeleteTasks={confirmDeleteTasks}
      />

      <TasksTable
        setTableSelectedRowKeys={setTableSelectedRowKeys}
        tasks={tasks}
        loading={loadingTasks}
        userPermissions={userPermissions}
        proposalCanBeUpdate={proposalCanBeUpdate}
        editTask={editTask}
        keyRowTable={keyRowTable}
        setKeyRowTable={key => setKeyRowTable(key)}
        refreshData={refreshData}
        keyTable={keyTable}
        setKeyTable={setKeyTable}
      />

      <TaskForm
        show={showTaskForm}
        taskId={taskId}
        closeTaskForm={closeTaskForm}
        owner={owner}
        userPermissions={userPermissions}
        refreshData={refreshData}
        newTask={() => setTaskId(0)}
        proposal={proposal}
        key={keyTaskForm}
      />
    </div>
  )
}

Tasks.propTypes = {
  proposalId: PropTypes.number,
  onChange: PropTypes.func,
  userPermissions: PropTypes.array,
  proposalCanBeUpdate: PropTypes.bool,
  proposal: PropTypes.object,
  owner: PropTypes.any,
}
