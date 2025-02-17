/**
 * breadcrumb: Tarefas
 */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
/* eslint-disable react/button-has-type */
import DefaultTable from '@components/DefaultTable'
import ConfigurationModal from '@components/modals/ConfigurationModal'
import NewSimpleSearch from '@components/NewSimpleSearch'
import { apiCRM } from '@services/api'
import {
  formatTaskDuration,
  getInitialSearch,
  getPermissions,
  handleAuthError,
  hasPermission,
  setParamValues,
  useGetColumnsConfiguration,
} from '@utils'
import { taskGridColumns } from '@utils/columns/taskGrid'
import {
  Button,
  Col,
  Dropdown,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import router from 'umi/router'
import { exportExcel } from '../../utils/export'
import EditProposalHeader from './Proposals/components/EditProposal/EditProposalHeader'
import TaskFinalize from './Task/components/TaskFinalize'
import TaskForm from './Task/components/TaskForm'
import TaskMoreOptions from './Task/components/TaskMoreOptions'
import TaskSchedule from './Task/components/TaskSchedule'
import TaskUpdateBatch from './Task/components/TaskUpdateBatch'

const { Option } = Select

const params = {
  taskTypeId: null,
  franchiseeName: '',
  companyShortName: '',
  subject: '',
  sellerId: null,
  responsibleId: null,
  startExpectedDate: null,
  endExpectedDate: null,
  filterStatus: 1,
  filterType: 1,
  proposalNumber: null,
  startCreatedDate: null,
  endCreatedDate: null,
  startRealizedDate: null,
  endRealizedDate: null,
  origemContatoId: null,
  qualificacaoId: null,
  areaNegocioId: null,
  segmentoMercadoId: null,
}

export default function TaskGrid(props) {
  const taskIdURL = new URLSearchParams(window.location.search).get('tarefaId')
  const notificationId = new URLSearchParams(window.location.search).get(
    'notificacaoId',
  )
  const somenteVisualizacao =
    new URLSearchParams(window.location.search)
      .get('somenteVisualizacao')
      ?.toLocaleLowerCase() === 'true'

  useEffect(() => {
    if (taskIdURL) {
      editTask(taskIdURL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskIdURL])

  const patternSearchOptions = [
    {
      value: 'ExpectedDate',
      label: 'Data de agenda',
      type: 'rangeDate',
    },
    {
      value: 'taskTypeId',
      label: 'Tipo de tarefa',
      placeholder: 'Buscar pelo tipo de tarefa',
      type: 'select',
      options: [],
    },
    {
      value: 'responsibleId',
      label: 'Responsável',
      placeholder: 'Buscar pelo nome do responsável',
      type: 'select',
      options: [],
    },
    {
      value: 'companyShortName',
      label: 'Organização',
      placeholder: 'Buscar pelo nome da organização',
      type: 'search',
    },
    {
      value: 'subject',
      label: 'Assunto',
      placeholder: 'Buscar pelo assunto',
      type: 'search',
    },
    {
      value: 'sellerId',
      label: 'Vendedor',
      placeholder: 'Buscar pelo vendedor',
      type: 'select',
      options: [],
    },
    {
      value: 'CreatedDate',
      label: 'Data de criação',
      type: 'rangeDate',
    },
    {
      value: 'RealizedDate',
      label: 'Data de conclusão',
      type: 'rangeDate',
    },
    {
      value: 'proposalNumber',
      label: 'Negócio',
      placeholder: 'Buscar pelo número do negócio',
      type: 'search',
      dataType: 'integer',
    },
    {
      value: 'qualificacaoId',
      label: 'Qualificação',
      placeholder: 'Buscar por qualificação',
      type: 'select',
      options: [],
    },
    {
      value: 'origemContatoId',
      label: 'Origem contato',
      placeholder: 'Buscar por origem contato',
      type: 'select',
      options: [],
    },
    {
      value: 'segmentoMercadoId',
      label: 'Segmento mercado',
      placeholder: 'Buscar por segmento mercado',
      type: 'select',
      options: [],
    },
    {
      value: 'areaNegocioId',
      label: 'Area de negócio',
      placeholder: 'Buscar por area de negócio',
      type: 'select',
      options: [],
    },
    {
      value: 'hasFranchisee',
      label: 'Tem franqueado?',
      placeholder: 'Tarefa tem franqueado?',
      type: 'select',
      options: [
        { value: 1, label: 'Sim' },
        { value: 2, label: 'Não' },
      ],
    },
  ]

  const [updateColumnsKey, setUpdateColumnsKey] = useState(0)
  const [
    serverColumns,
    loadingColumns,
    getColumns,
  ] = useGetColumnsConfiguration(apiCRM, `TaskGrid`, taskGridColumns())
  useEffect(() => {
    getColumns()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateColumnsKey])

  const [visibleConfigurationModal, setVisibleConfigurationModal] = useState(
    false,
  )
  const menu = (
    <Menu>
      <Menu.Item onClick={() => setVisibleConfigurationModal(true)}>
        Configurações
      </Menu.Item>
    </Menu>
  )

  // ATENÇÃO: SE O LAYOUT DAS COLUNAS ABAIXO FOR MEXIDO, TEM QUE REVER O LAYOUT DE COLUNAS franchiseeColumns
  const defaultColumns = [
    ...serverColumns,
    {
      title: '',
      key: 'operation',
      width: 120,
      fixed: 'right',
      render: (text, record, index) => (
        <div>
          <Row type="flex" justify="end" gutter={5}>
            <Col
              style={{
                maxWidth: '36px',
                display:
                  record.realizedDate ||
                  !record.canBeUpdated ||
                  !hasPermission(userPermissions, 'Alter')
                    ? 'none'
                    : 'flex',
              }}
            >
              <TaskFinalize
                keyTask={index}
                keyTable={keyTable}
                setKeyTable={setKeyTable}
                taskId={record.taskId}
                closeTaskFinalize={closeTaskFinalize}
              />
            </Col>

            <Col
              style={{
                maxWidth: '36px',
                display:
                  record.realizedDate ||
                  !record.canBeUpdated ||
                  !hasPermission(userPermissions, 'Alter') ||
                  (record.isBatchGenerated &&
                    !hasPermission(userPermissions, 'AlterDate'))
                    ? 'none'
                    : 'flex',
              }}
            >
              <TaskSchedule
                taskId={record.taskId}
                isAllDay={record.isAllDay}
                keyTable={keyTable}
                setKeyTable={setKeyTable}
                getTasks={getTasks}
              />
            </Col>
            <Col style={{ maxWidth: '36px', display: 'flex' }}>
              <TaskMoreOptions
                taskId={record.taskId}
                userPermissions={userPermissions}
                canBeUpdated={record.canBeUpdated}
                task={record}
                owner={owner}
                {...{
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
                }}
              />
            </Col>
          </Row>
        </div>
      ),
    },
  ]

  // Fazer cópia das colunas 'default' para 'franchisees'
  const standardColumns = defaultColumns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  // standardColumns[1].width = '18%' // aumenta tamanho da coluna Organização
  // standardColumns[3].width = '27%' // aumenta tamanho da coluna Assunto

  // Elimina a coluna 'Responsavel'
  for (let i = 0; i < standardColumns.length; i++) {
    if (standardColumns[i].dataIndex === 'responsibleName') {
      standardColumns.splice(i, 1)
      break
    }
  }

  const [userPermissions, setUserPermissions] = useState([])
  const [tasks, setTasks] = useState([])
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [owner, setOwner] = useState(null)
  const [searchOptions, setSearchOptions] = useState(patternSearchOptions)
  const [showTable, setShowTable] = useState(false)
  const [canDelete] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [keyModalForm, setKeyModalForm] = useState(0)
  const [taskId, setTaskId] = useState(0)
  const [keyModalProposal, setKeyModalProposal] = useState(0)
  const [task, setTask] = useState(null)
  const [showNewProposalModal, setShowNewProposalModal] = useState(false)

  const [keyTable, setKeyTable] = useState(-1)
  const [showTaskUpdateBatch, setShowTaskUpdateBatch] = useState(false)
  const [tasksToUpdateBatch, setTasksToUpdateBatch] = useState([])
  const [isAllDay, setIsAllDay] = useState(false)

  const [contactSources, setContactSources] = useState(null)
  const [qualifications, setQualifications] = useState(null)
  const [marketSegments, setMarketSegments] = useState(null)
  const [businessAreas, setBusinessAreas] = useState(null)
  const [taskTypes, setTaskTypes] = useState(null)
  const [sellers, setSellers] = useState(null)
  const [responsibles, setResponsibles] = useState(null)
  const [tags, setTags] = useState([])

  const [filterStatus, setFilterStatus] = useState(1)
  const [filterType, setFilterType] = useState(1)

  let taskPerformed = []

  const closeTaskFinalize = (refreshData, openNewTask) => {
    if (refreshData) {
      getTasks()
    }

    if (openNewTask) {
      editTask(0)
    }
  }

  const handleChangeFilterStatus = value => {
    params.filterStatus = value
    setFilterStatus(value)
    getTasks()
  }

  const handleChangeFilterType = value => {
    params.filterType = value
    setFilterType(value)
    getTasks()
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeysFromTable =>
      onSelectChangeTask(selectedRowKeysFromTable),
    getCheckboxProps: record => ({
      disabled:
        (!record.canBeDeleted && !record.canBeUpdated) ||
        record.realizedDate ||
        (!hasPermission(userPermissions, 'Alter') &&
          !hasPermission(userPermissions, 'Exclude')), // Column configuration not to be checked
    }),
  }

  const onSelectChangeTask = selectedRowKeysFromTable => {
    setSelectedRowKeys(selectedRowKeysFromTable)
  }

  useEffect(() => {
    clearParams()
    params.filterStatus = 1
    params.filterType = 1
    getBusinessAreas()
    getContactSources()
    getQualifications()
    getMarketSegments()
    getTaskType()
    getSellers()
    getResponsible()
    setPermissions()
    getOwner()

    getInitialSearch('TaskGrid', 'crm', setTags, startSearch)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      contactSources &&
      marketSegments &&
      qualifications &&
      businessAreas &&
      sellers &&
      taskTypes &&
      responsibles &&
      owner
    ) {
      configureSearchOptions()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    marketSegments,
    qualifications,
    businessAreas,
    contactSources,
    sellers,
    taskTypes,
    responsibles,
    owner,
  ])

  function configureSearchOptions() {
    const searchOptionsWork = searchOptions.slice(0)

    if (owner?.ownerProfile === 'Franchise') {
      for (let i = 0; i < searchOptionsWork.length; i++) {
        if (searchOptionsWork[i].value === 'franchiseeName') {
          searchOptionsWork.splice(i, 1)
          break
        }
      }
    }

    optionsPopulate(searchOptionsWork, qualifications, 'qualificacaoId')
    optionsPopulate(searchOptionsWork, contactSources, 'origemContatoId')
    optionsPopulate(searchOptionsWork, marketSegments, 'segmentoMercadoId')
    optionsPopulate(searchOptionsWork, businessAreas, 'areaNegocioId')
    optionsPopulate(searchOptionsWork, taskTypes, 'taskTypeId', 'taskTypeId')
    optionsPopulate(searchOptionsWork, sellers, 'sellerId', 'sellerId')
    optionsPopulate(
      searchOptionsWork,
      responsibles,
      'responsibleId',
      'franchiseeId',
    )

    setShowTable(true)
    setSearchOptions(searchOptionsWork)
  }

  function optionsPopulate(options, source, field, optionId) {
    const index = options.findIndex(x => x.value === field)
    if (index >= 0) {
      source.map(record =>
        options[index].options.push({
          value: optionId ? record[optionId] : record.id,
          label: record.descricao ?? record.shortName ?? record.name,
        }),
      )
    }
  }

  async function getTaskType() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/TaskType`,
      })
      const { data } = response
      if (data.isOk) {
        setTaskTypes(data.taskType)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getSellers() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Person`,
        params: { isSeller: true },
      })
      const { data } = response
      if (data.isOk) {
        setSellers(data.person)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getResponsible() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Person`,
        params: { isFranchisee: true },
      })
      const { data } = response
      if (data.isOk) {
        setResponsibles(data.person)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getBusinessAreas() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
      })
      const { data } = response
      if (data.isOk) {
        setBusinessAreas(data.areaNegocio)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getMarketSegments() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SegmentoMercado`,
      })
      const { data } = response
      if (data.isOk) {
        setMarketSegments(data.segmentoMercado)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getContactSources() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/OrigemContato`,
      })
      const { data } = response
      if (data.isOk) {
        setContactSources(data.origemContato)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getQualifications() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Qualificacao`,
      })
      const { data } = response
      if (data.isOk) {
        setQualifications(data.qualificacao)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  async function setPermissions() {
    setUserPermissions(await getPermissions())
  }

  async function getOwner() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })
      const { data } = response
      if (data.isOk) {
        setOwner(data)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getTasks() {
    setLoadingTasks(true)
    setSelectedRowKeys([])
    setKeyTable(-1)
    // alert('getTasks ==> ' + JSON.stringify(params))
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/Task`,
        params,
      })

      const { data } = response

      if (data.isOk) {
        setTasks(data.task)
        setLoadingTasks(false)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function confirmDeleteTasks() {
    Modal.confirm({
      content:
        selectedRowKeys.length === 1
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

    if (taskPerformed.length >= selectedRowKeys.length) {
      taskPerformed = []
      getTasks()
    }
  }

  function deleteTasks() {
    setLoadingTasks(true)
    taskPerformed = []

    selectedRowKeys.map(selectedRowKey => deleteTask(selectedRowKey))
  }

  const refreshData = () => {
    getTasks()
  }
  const closeTaskForm = () => {
    setShowTaskForm(false)
  }

  const updateBatch = () => {
    const tasksWork = tasks.filter(d => selectedRowKeys.includes(d.taskId))
    const tasksToUpdateWork = []
    let isAllDayWork = true

    tasksWork.map(taskWork => {
      if (!taskWork.isAllDay) {
        isAllDayWork = false
      }

      tasksToUpdateWork.push({
        taskId: taskWork.taskId,
        isAllDay: taskWork.isAllDay,
        expectedDateTime: taskWork.expectedDateTime,
      })
      return true
    })

    setTasksToUpdateBatch(tasksToUpdateWork)
    setIsAllDay(isAllDayWork)
    setShowTaskUpdateBatch(true)
  }

  const closeTaskUpdateBatch = refreshData => {
    setShowTaskUpdateBatch(false)
    if (refreshData) {
      getTasks()
    }
  }

  const closeNewProposalModal = (refreshData, proposalId) => {
    setShowNewProposalModal(false)
    if (refreshData && proposalId) {
      router.push(`/CRM/Proposals/detail/${proposalId}`)
    }
  }

  const editTask = taskIdToEdit => {
    setTaskId(taskIdToEdit)
    setKeyModalForm(keyModalForm + 1)
    setShowTaskForm(true)
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

  function exportExcelTask() {
    const defaultExcelColumns = serverColumns.map(s => ({
      label: s.nomeColuna,
      value: s.dataIndex,
    }))

    const index = defaultExcelColumns.findIndex(
      d => d.value === 'expectedDateTime',
    )

    if (index !== -1) {
      defaultExcelColumns.splice(index + 1, 0, {
        label: 'Hora da agenda',
        value: 'expectedHour',
      })
    }
    const exportData = tasks.map(t => ({
      ...t,
    }))

    exportExcel(
      'tarefas',
      tags.map(tag => `${tag.fieldName}: ${tag.searchField}`).join(', '),
      defaultExcelColumns,
      exportData.map(t => {
        t.expectedHour = moment(t.expectedDateTime).format('HH:mm')
        t.expectedHour = t.expectedHour !== '00:00' ? t.expectedHour : ''
        t.expectedDateTime = moment(t.expectedDateTime).format('DD/MM/YYYY')
        const expectedDuration = formatTaskDuration(t.expectedDuration)
        t.expectedDuration = expectedDuration
        t.status = t.realizedDate ? 'Concluído' : 'Pendente'

        return t
      }),
      'tarefas',
      setLoadingTasks,
    )
  }

  function startSearch(newTags) {
    setSearchValues(newTags)
    getTasks()
  }

  function clearParams() {
    params.taskTypeNameId = null
    params.franchiseeName = ''
    params.companyShortName = ''
    params.subject = ''
    params.sellerId = null
    params.proposalNumber = null
    params.startExpectedDate = null
    params.endExpectedDate = null
    params.startCreatedDate = null
    params.endCreatedDate = null
    params.startRealizedDate = null
    params.endRealizedDate = null
    params.responsibleId = null
    params.origemContatoId = null
    params.qualificacaoId = null
    params.areaNegocioId = null
    params.segmentoMercadoId = null
  }

  function setSearchValues(newTags) {
    clearParams()
    setParamValues(params, searchOptions, newTags ?? tags)
  }

  return (
    <React.Fragment>
      <ConfigurationModal
        {...{
          visibleConfigurationModal,
          setVisibleConfigurationModal,
          setUpdateColumnsKey,
        }}
        screenName="TaskGrid"
        tableName="TaskGrid"
        defaultColumns={taskGridColumns()}
        microserviceName="crm"
        microserviceOrigin={apiCRM}
        profile={owner?.ownerProfile}
      />
      <div className="p-4 container">
        <Row className="mb-4">
          <Col className="ml-auto" style={{ width: '570px' }}>
            <NewSimpleSearch
              searchOptions={searchOptions}
              setTags={setTags}
              tags={tags}
              startSearch={startSearch}
              // hideSaveSearch
              getSelectLabel
              selectOptionsWidth={190}
              screenName="TaskGrid"
            />
          </Col>
        </Row>

        <Row type="flex" className="mb-4" gutter={12}>
          <Col className="w-1/2">
            <Row type="flex" gutter={12}>
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
                  disabled={loadingTasks}
                  onClick={() => editTask(0)}
                >
                  <i className="fa fa-plus fa-lg mr-3" />
                  Nova tarefa
                </Button>
              </Col>

              {hasPermission(userPermissions, 'ExportExcel') && (
                <Button
                  onClick={() => exportExcelTask()}
                  className="iconButton"
                  loading={loadingTasks}
                >
                  <i className="fa fa-download fa-lg mr-3" />
                  Exportar
                </Button>
              )}
              <Col
                style={{
                  display:
                    selectedRowKeys.length > 0 &&
                    hasPermission(userPermissions, 'Alter')
                      ? 'block'
                      : 'none',
                }}
              >
                <Button
                  type="outline"
                  onClick={() => updateBatch()}
                  disabled={loadingTasks}
                >
                  <i className="fa fa-pencil mr-3" />
                  {`Editar em lote (${selectedRowKeys.length})`}
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
                  onClick={() => confirmDeleteTasks()}
                  disabled={loadingTasks || !canDelete}
                >
                  <i className="fa fa-trash mr-3" />
                  {`Excluir (${selectedRowKeys.length})`}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col className="w-1/2">
            <Row type="flex" gutter={12} justify="end">
              {owner?.ownerProfile === 'Franchisor' && (
                <Col>
                  <Select
                    style={{ width: '180px' }}
                    value={filterType}
                    onChange={handleChangeFilterType}
                  >
                    <Option value={1}>Todas as tarefas</Option>
                    <Option value={2}>Minhas tarefas</Option>
                    <Option value={3}>Franquias</Option>
                  </Select>
                </Col>
              )}
              <Col>
                <Select
                  style={{ width: '180px' }}
                  value={filterStatus}
                  onChange={handleChangeFilterStatus}
                >
                  <Option value={1}>Todos os status</Option>
                  <Option value={2}>Pendentes</Option>
                  <Option value={3}>Concluidas</Option>
                </Select>
              </Col>
              <Col>
                <Dropdown overlay={menu}>
                  <Button className="iconButton">
                    <i className="fa fa-ellipsis-v" aria-hidden="true" />
                  </Button>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
        <div
          className="w-full text-center pt-10"
          style={{ display: loadingTasks && !showTable ? 'block' : 'none' }}
        >
          <Spin size="large" />
        </div>

        <Row style={{ display: showTable ? 'block' : 'none' }}>
          <DefaultTable
            rowKey={record => record.taskId}
            loading={loadingTasks || loadingColumns}
            rowSelection={
              hasPermission(userPermissions, 'Alter') ||
              hasPermission(userPermissions, 'Exclude')
                ? rowSelection
                : undefined
            }
            columns={
              owner?.ownerProfile === 'Franchise' ||
              owner?.ownerProfile === 'Standard'
                ? standardColumns
                : defaultColumns
            }
            dataSource={tasks}
            scroll={{ x: 'max-content' }}
          />
        </Row>
      </div>
      <React.Fragment>
        <TaskForm
          show={showTaskForm}
          taskId={taskId}
          closeTaskForm={closeTaskForm}
          owner={owner}
          userPermissions={userPermissions}
          refreshData={refreshData}
          newTask={() => setTaskId(0)}
          key={keyModalForm}
          notificationId={notificationId}
          somenteVisualizacao={somenteVisualizacao}
        />
      </React.Fragment>
      <React.Fragment>
        <EditProposalHeader
          proposalId={0}
          show={showNewProposalModal}
          closeEditProposalHeader={closeNewProposalModal}
          userPermissions={userPermissions}
          key={keyModalProposal}
          owner={owner}
          task={task}
        />
      </React.Fragment>
      <TaskUpdateBatch
        show={showTaskUpdateBatch}
        tasks={tasksToUpdateBatch}
        isAllDay={isAllDay}
        closeTaskUpdateBatch={closeTaskUpdateBatch}
      />
    </React.Fragment>
  )
}
