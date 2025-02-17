/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lonely-if */
/* eslint-disable react/jsx-no-bind */
import styles from '@pages/CRM/styles.css'
import { apiCRM, apiNotification } from '@services/api'
import {
  companyIsFranchisee,
  getAuthToken,
  handleAuthError,
  zeroesLeft,
  sendDataToServer,
} from '@utils'
import {
  Form,
  Alert,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  TimePicker,
} from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import CustomNotificationModal from './Task/components/CustomNotificationModal.jsx'
import { timeTypes } from './Task/components/enums'
import TaskFormInputCompany from './Task/components/TaskFormInputCompany'
import TaskFormInputFranchisee from './Task/components/TaskFormInputFranchisee'
import TaskFormInputProposal from './Task/components/TaskFormInputProposal'
import TaskFormInputSeller from './Task/components/TaskFormInputSeller'
import TaskFormInputTaskType from './Task/components/TaskFormInputTaskType'
import {
  IData,
  ISellerSource,
  ICurrentTaskType,
  ITaskOwner,
  ITaskTypesSaved,
  ITaskType,
} from './Task/interfaces'
const { TextArea } = Input

let taskTypesSaved: ITaskTypesSaved[] = []

function TaskFormImplement({
  taskId,
  show = true,
  refreshData,
  closeTaskForm,
  newTask,
  proposal,
  owner,
  alterPermission,
  alterDatePermission,
  notificationId,
  handleClose,
  somenteVisualizacao,
  newModal,
}) {
  const subjectInput = useRef<any>(null)
  const [form] = Form.useForm()
  const [id, setId] = useState<number>(0)
  const [taskOwner, setTaskOwner] = useState<ITaskOwner>()
  const [canAlter, setCanAlter] = useState()
  const [canAlterDate, setCanAlterDate] = useState(false)
  const [key, setKey] = useState(0)

  const [alertMessages, setAlertMessages] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState<any>(true)
  const [loadingForm, setLoadingForm] = useState(true)
  const [loadingTaskTypes, setLoadingTaskTypes] = useState(true)
  const [loadingTask, setLoadingTask] = useState(true)
  const [taskTypes, setTaskTypes] = useState<ITaskTypesSaved[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [currentTaskType, setCurrentTaskType] = useState<ICurrentTaskType>()
  const [sellerSource, setSellerSource] = useState<ISellerSource[]>([])
  const [companySource, setCompanySource] = useState<any[]>([])
  const [franchiseeSource, setFranchiseeSource] = useState<any[]>([])
  const [franchiseeOwnerId, setFranchiseeOwnerId] = useState(null)
  const companyInput = useRef(null)
  const [proposalSource, setProposalSource] = useState<any[]>([])
  const [realizedDate, setRealizedDate] = useState<any>()
  const [editData, setEditData] = useState<IData>()

  const isAllDay = form.getFieldValue('isAllDay')
  const notificationOptions = [
    { description: 'Sem lembrete', time: 0, timeType: 1, isAllDay: true },
    { description: '0 minutos antes', time: 0, timeType: 2 },
    { description: '5 minutos antes', time: 5, timeType: 2 },
    { description: '15 minutos antes', time: 15, timeType: 2 },
    { description: '30 minutos antes', time: 30, timeType: 2 },
    { description: '1 hora antes', time: 1, timeType: 3 },
    { description: '2 horas antes', time: 2, timeType: 3 },
    { description: '12 horas antes', time: 12, timeType: 3 },
    { description: '1 dia antes', time: 1, timeType: 4, isAllDay: true },
    { description: '2 dias antes', time: 2, timeType: 4, isAllDay: true },
    { description: '1 semana antes', time: 7, timeType: 4, isAllDay: true },
    { description: 'Personalizado', time: 0, timeType: 0, isAllDay: true },
  ]
  const filteredNotificationOptions = isAllDay
    ? notificationOptions.filter(o => isAllDay && o.isAllDay)
    : notificationOptions

  const [notification, setNotification] = useState({
    time: 0,
    type: 1,
  })
  const [mailNotification, setMailNotification] = useState({
    time: 0,
    type: 1,
  })
  const [visibleCustomNotification, setVisibleCustomNotification] = useState(
    false,
  )
  const [customizeNotification, setCustomizeNotification] = useState({
    fieldName: '',
    setNotification: undefined,
    notification,
  })

  const systemNotificationInitial =
    editData &&
    notificationOptions.find(
      n => n.time === editData.time && n.timeType === editData.timeType,
    )?.description
  const mailNotificationInitial =
    editData &&
    notificationOptions.find(
      n => n.time === editData.timeMail && n.timeType === editData.timeTypeMail,
    )?.description

  async function getOwner() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })
      const { data } = response
      if (data.isOk) {
        setTaskOwner(data)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getDefaultNotification() {
    try {
      const response = await apiNotification.get(`/api/Configuracao`)
      const { data } = response
      if (data) {
        const systemInitialValue = notificationOptions.find(
          n =>
            n.time ===
              (isAllDay
                ? data.tempoTarefaDiaInteiro
                : data.tempoTarefaHoraMarcada) &&
            n.timeType ===
              (isAllDay ? data.padraoTarefaDia : data.padraoTarefaHora),
        )?.description
        const mailInitialValue = notificationOptions.find(
          n =>
            n.time ===
              (isAllDay
                ? data.tempoTarefaDiaInteiro
                : data.tempoTarefaHoraMarcada) &&
            n.timeType ===
              (isAllDay ? data.padraoTarefaDia : data.padraoTarefaHora),
        )?.description
        form.setFieldsValue({
          systemNotification: {
            label: systemInitialValue,
            value: systemInitialValue,
          },

          mailNotification: {
            label: mailInitialValue,
            value: mailInitialValue,
          },
        })
        if (isAllDay && (!editData || proposal)) {
          form.setFieldsValue({
            hourFullDay:
              data.horaTarefaDiaInteiro && moment(data.horaTarefaDiaInteiro),
            hourFullDayMail:
              data.horaTarefaDiaInteiro && moment(data.horaTarefaDiaInteiro),
          })
        }
        const defaultConfig = {
          time: isAllDay
            ? data.tempoTarefaDiaInteiro
            : data.tempoTarefaHoraMarcada,
          type: isAllDay ? data.padraoTarefaDia : data.padraoTarefaHora,
        }
        setNotification(defaultConfig)
        setMailNotification(defaultConfig)
      } else {
        const config = {
          label: notificationOptions[0].description,
          value: notificationOptions[0].description,
        }
        form.setFieldsValue({
          systemNotification: config,
          mailNotification: config,
        })
        const stateConfig = {
          time: notificationOptions[0].time,
          type: notificationOptions[0].timeType,
        }
        setNotification(stateConfig)
        setMailNotification(stateConfig)
      }
    } catch (error) {
      form.setFieldsValue({
        systemNotification: notificationOptions[1].description,
        mailNotification: notificationOptions[1].description,
      })
      const config = {
        time: notificationOptions[1].time,
        type: notificationOptions[1].timeType,
      }
      setNotification(config)
      setMailNotification(config)
      handleAuthError(error)
    }
  }

  useEffect(() => {
    !taskId && (!editData || proposal) && getDefaultNotification()
  }, [form.getFieldValue('isAllDay')])

  const handleSubmit = (e, isEndTask) => {
    e.preventDefault()

    setAlertMessages([])

    if (!canBeUpdated) {
      message.error('Você não pode atualizar a tarefa!')
      return
    }
    form
      .validateFields()
      .then(values => {
        if (notification.type === 0 || mailNotification.type === 0) {
          message.warning('Selecione um horário personalizado de notificação')
          return
        }
        const sellerId = form.getFieldValue('sellerId')
        if (mailNotification.type !== 1) {
          Promise.resolve(validateSeller(sellerId)).then(hasUser => {
            if (!hasUser) {
              Modal.confirm({
                content: (
                  <span>
                    <p className="mb-2">
                      Vendedor{' '}
                      <b>
                        {
                          sellerSource.find(seller => seller.value === sellerId)
                            ?.label
                        }
                      </b>{' '}
                      não está vinculado a um usuário. Desta forma, não receberá
                      notificação da tarefa agendada.
                    </p>
                    <p>Deseja continuar com o agendamento?</p>
                  </span>
                ),
                title: 'Atenção',
                okText: 'Continuar',
                cancelText: 'Cancelar',
                onOk: () => {
                  saveTask(isEndTask)
                },
              })
            } else {
              saveTask(isEndTask)
            }
          })
        } else {
          saveTask(isEndTask)
        }
      })
      .catch(err => message.warning('Há campos à serem preenchidos'))
  }

  const [postpone, setPostpone] = useState({ time: 5, type: 'minutes' })
  async function handlePostponeNotification() {
    const currentTime: any = moment()
    const newNotificationTime = currentTime.add(postpone.time, postpone.type)
    const notificationBody = {
      id: notificationId,
      dataHoraNotificarSistema: newNotificationTime.format(),
    }
    try {
      const result = await apiNotification({
        method: 'PUT',
        url: `/api/Notificacao/Adiar`,
        data: notificationBody,
      })
      if (result.data?.isOk) {
        message.success('Notificação adiada com sucesso!')
        handleCancel()
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  function handleCancel() {
    clearForm()
    handleClose()
  }

  async function handleDiscardNotification() {
    const notificationBody = {
      id: notificationId,
    }
    try {
      const result = await apiNotification({
        method: 'PUT',
        url: `/api/Notificacao/Descartar`,
        data: notificationBody,
      })
      if (result.data?.isOk) {
        message.success('Notificação descartada com sucesso!')
        handleCancel()
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  function clearForm(fillFromProposal?) {
    setAlertMessages([])
    setCanBeUpdated(true)
    setCanAlterDate(true)
    setRealizedDate(undefined)
    setSellerSource([])
    setCompanySource([])
    setFranchiseeSource([])
    setFranchiseeOwnerId(null)
    setProposalSource([])

    form.resetFields()

    if (proposal && (id === 0 || fillFromProposal)) {
      setFieldsFromProposal()
    }
  }

  function setFieldsFromProposal() {
    if (!proposal) {
      return
    }

    setFranchiseeOwnerId(
      proposal.isFranchisee ? null : proposal.franchiseeOwnerId,
    )
    setCompanySource([
      {
        label: proposal.companyShortName,
        value: proposal.companyId,
        isFranchisee: proposal.isFranchisee,
        franchiseeId: proposal.franchiseeId,
        franchiseeName: proposal.franchiseeName,
        franchiseeOwnerId: proposal.isFranchisee
          ? null
          : proposal.franchiseeOwnerId,
      },
    ])

    if (proposal.franchiseeId) {
      setFranchiseeSource([
        {
          value: proposal.franchiseeId,
          label: proposal.franchiseeName,
          ownerId: proposal.franchiseeOwnerId,
        },
      ])
    }

    setSellerSource([{ label: proposal.sellerName, value: proposal.sellerId }])

    setProposalSource([{ label: proposal.number, value: proposal.proposalId }])

    setEditData({
      franchiseeId: proposal.franchiseeId,
      companyId: proposal.companyId,
      sellerId: proposal.sellerId,
      proposalId: proposal.proposalId,
      isBatchGenerated: proposal?.isBatchGenerated,
      time: 0,
      timeType: 0,
      timeTypeMail: 0,
      timeMail: 0,
    })
  }

  async function getTask() {
    setLoadingTask(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/task`,
        params: { taskId: id },
      })

      const { data } = response

      if (data.isOk) {
        if (data.task.length === 0) {
          message.error('Tarefa não existe ou não há permissão para acesso')
          handleCancel()
        } else {
          const task: IData = data.task[0]
          let expectedDuration
          let durationDays

          if (!task.isAllDay) {
            if (task.expectedDuration > 1439) {
              expectedDuration = moment('23:59', 'HH:mm')
            } else {
              let minutes = task.expectedDuration
              const hours = Math.floor(minutes / 60)
              minutes -= hours * 60
              expectedDuration = moment(
                `${zeroesLeft(hours, 2)}:${zeroesLeft(minutes, 2)}`,
                'HH:mm',
              )
            }
          } else {
            durationDays = Math.round(task.expectedDuration / (24 * 60))
          }

          setCurrentTaskType({
            id: task.taskTypeId,
            name: task.taskTypeName,
            icon: task.taskTypeIcon,
          })

          task.expectedDuration = expectedDuration
          task.durationDays = durationDays
          setEditData(task)

          if (task.realizedDate) {
            setRealizedDate(moment(task.realizedDate))
          }

          setFranchiseeOwnerId(task.franchiseeOwnerId)
          setCompanySource([
            {
              label: task.companyShortName,
              value: task.companyId,
              isFranchisee: task.isFranchisee,
              franchiseeId: task.franchiseeId,
              franchiseeName: task.franchiseeName,
              franchiseeOwnerId: task.isFranchisee
                ? null
                : task.franchiseeOwnerId,
            },
          ])

          if (task.franchiseeId) {
            setFranchiseeSource([
              {
                value: task.franchiseeId,
                label: task.franchiseeName,
                ownerId: task.franchiseeOwnerId,
              },
            ])
          }

          setSellerSource([{ label: task.sellerName, value: task.sellerId }])

          if (task.proposalId) {
            setProposalSource([
              { label: task.proposalNumber, value: task.proposalId },
            ])
          }

          setCanBeUpdated(
            proposal
              ? task.canBeUpdated && canAlter && proposal.canBeUpdated
              : task.canBeUpdated && canAlter,
          )
        }
      } else {
        message.error(data.message)
        handleCancel()
      }
      setLoadingTask(false)
    } catch (error) {
      handleAuthError(error)
      handleCancel()
    }
  }

  function checkIfExistsTaskType(id, name, icon) {
    const record = taskTypesSaved.find(x => x.value === id)
    if (!record) {
      const taskTypesWork = taskTypesSaved
      taskTypesWork.push({
        value: id,
        label: name,
        render: renderTaskType(name, icon),
      })

      setTaskTypes(taskTypesWork)
    }
  }

  function renderTaskType(name, icon) {
    const render = (
      <div>
        <i className={`mr-4 fa ${icon} fa-fw ${styles.crmColorIconGrid}`} />
        <span>{name}</span>
      </div>
    )

    return render
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

  async function saveTask(isEndTask) {
    const expectedDateTime = buildDateTime(
      form.getFieldValue('expectedDate'),
      form.getFieldValue('expectedTime'),
      form.getFieldValue('isAllDay'),
    )
    let expectedDuration = 0

    if (!form.getFieldValue('isAllDay')) {
      if (form.getFieldValue('expectedDuration')) {
        expectedDuration =
          parseInt(form.getFieldValue('expectedDuration').format('HH'), 10) *
            60 +
          parseInt(form.getFieldValue('expectedDuration').format('mm'), 10)
      }
    } else {
      expectedDuration = form.getFieldValue('durationDays') * 24 * 60 // converte dias para minutos
    }

    let realizedDateWork = realizedDate
      ? realizedDate.format('YYYY-MM-DDTHH:mm:ss')
      : null

    if (isEndTask && !realizedDate) {
      realizedDateWork = moment().format('YYYY-MM-DDTHH:mm:ss')
    }

    const taskBody = {
      task: {
        taskId: id,
        taskTypeId: form.getFieldValue('taskTypeId'),
        subject: form.getFieldValue('subject'),
        expectedDateTime,
        expectedDuration,
        sellerId: form.getFieldValue('sellerId'),
        companyId: form.getFieldValue('companyId'),
        franchiseeId: form.getFieldValue('franchiseeId'),
        observation: form.getFieldValue('observation'),
        proposalId: form.getFieldValue('proposalId'),
        isAllDay: form.getFieldValue('isAllDay'),
        realizedDate: realizedDateWork,
        time: notification.time,
        timeType: notification.type,
        timeMail: mailNotification.time,
        timeTypeMail: mailNotification.type,
        hourFullDay:
          isAllDay && notification.type !== 1
            ? form.getFieldValue('hourFullDay').format()
            : null,
        hourFullDayMail:
          isAllDay && mailNotification.type !== 1
            ? form.getFieldValue('hourFullDayMail').format()
            : null,
      },
    }
    setIsSaving(true)
    try {
      const response = await sendDataToServer(
        apiCRM,
        'post',
        'api/crm/task',
        'Não foi possível salvar',
        taskBody,
      )

      setIsSaving(false)

      if (closeTaskForm !== undefined) {
        if (response) {
          if (!isEndTask) {
            closeTaskForm && closeTaskForm()
          } else {
            newTask()
            clearForm(true)

            if (subjectInput.current != null) {
              subjectInput.current.focus()
            }
          }
          refreshData()
        }
      } // if (data.isOk) {
      //   setId(editData ? editData.taskId : data.idGenerated)
      //   message.success('Salvo com sucesso!')
      //   refreshData && refreshData()

      //   if (!isEndTask) {
      //     closeTaskForm && closeTaskForm()
      //   } else {
      //     newTask()
      //     clearForm(true)

      //     if (subjectInput.current != null) {
      //       subjectInput.current.focus()
      //     }
      //   }
      // } else {
      //   if (data.validationMessageList.length > 0) {
      //     setAlertMessages(data.validationMessageList)
      //   }

      // }
    } catch (err) {
      setIsSaving(false)
      handleAuthError(err)
    }

    setId(0)
  }

  async function validateSeller(sellerId) {
    try {
      const result = await apiCRM({
        method: 'POST',
        url: `/api/crm/task/ValidateSeller/${sellerId}`,
      })
      return result.data
    } catch (error) {
      handleAuthError(error)
      return false
    }
  }

  async function getTaskTypes() {
    setLoadingTaskTypes(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/tasktype`,
      })

      // setLoadingForm(false) // esse set é feito no useEffect

      const { data } = response

      if (data.isOk) {
        if (data.taskType.length === 0) {
          message.error('Não existem tipos de tarefas!')
          setLoadingTaskTypes(false)
          closeTaskForm && closeTaskForm()
        } else {
          const taskTypesWork: ITaskTypesSaved[] = []

          data.taskType.map(taskType => {
            taskTypesWork.push({
              value: taskType.taskTypeId,
              label: taskType.name,
              render: renderTaskType(taskType.name, taskType.icon),
            })

            return true
          })

          taskTypesSaved = taskTypesWork
          setTaskTypes(taskTypesSaved)
          setLoadingTaskTypes(false)
        }
      } else {
        setLoadingTaskTypes(false)
        message.error(data.message)
        closeTaskForm && closeTaskForm()
      }
    } catch (error) {
      setLoadingTaskTypes(false)
      handleAuthError(error)
      closeTaskForm && closeTaskForm()
    }
  }

  // --- OUTRAS VALIDAÇÕES

  const expectedTimeValidate = (rule, value, callback) => {
    if (!value && !form.getFieldValue('isAllDay')) {
      callback('Informe a hora!')
    } else {
      callback()
    }
  }

  const durationDaysValidate = (rule, value, callback) => {
    if (!value && form.getFieldValue('isAllDay')) {
      callback('Informe o número de dias!')
    } else {
      callback()
    }
  }

  const expectedDurationValidate = (rule, value, callback) => {
    if (!value && !form.getFieldValue('isAllDay')) {
      callback('Informe a duração!')
    }
    if (
      value &&
      !form.getFieldValue('isAllDay') &&
      value.format('HH:mm') === '00:00'
    ) {
      callback('Informe a duração!')
    } else {
      callback()
    }
  }

  const onChangeCompany = selectedValue => {
    if (selectedValue) {
      let { franchiseeId } = selectedValue
      setFranchiseeOwnerId(selectedValue.franchiseeOwnerId)
      if (selectedValue.franchiseeId) {
        setFranchiseeSource([
          {
            value: selectedValue.franchiseeId,
            label: selectedValue.franchiseeName,
            ownerId: selectedValue.franchiseeOwnerId,
          },
        ])
      } else if (
        taskOwner?.franchiseeId &&
        taskOwner?.ownerProfile === 'Franchise'
      ) {
        franchiseeId = owner.franchiseeId
        setFranchiseeSource([
          {
            value: taskOwner.franchiseeId,
            label: taskOwner.ownerShortName,
            ownerId: taskOwner?.ownerId,
          },
        ])
      }
      form.setFieldsValue({ franchiseeId })
    }
  }

  const onChangeFranchisee = franchisee => {
    setFranchiseeOwnerId(franchisee?.ownerId || null)
  }

  function handleCustomNotification(fieldName, setNotification, notification) {
    setCustomizeNotification({ fieldName, setNotification, notification })
    setVisibleCustomNotification(true)
  }

  useEffect(() => {
    getAuthToken()
    !taskId && getDefaultNotification()
    const id =
      new URLSearchParams(window.location.search).get('taskId') || taskId
    setId(id)
    owner ? setTaskOwner(owner) : getOwner()
    const canAlter =
      new URLSearchParams(window.location.search).get('canAlter') ||
      alterPermission
    setCanAlter(canAlter)
    const canAlterDate =
      new URLSearchParams(window.location.search).get('canAlterDate') ||
      alterDatePermission
    setCanAlterDate(editData?.isBatchGenerated && !canAlterDate)
  }, [])

  useEffect(() => {
    if (!loadingForm && subjectInput.current != null) {
      try {
        subjectInput.current.focus()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingForm])

  useEffect(() => {
    if (show) {
      clearForm(false)

      setLoadingTask(false)
      setLoadingTaskTypes(false)
      setLoadingForm(true)

      getTaskTypes()

      if (id > 0) {
        getTask()
      } else {
        setLoadingTask(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, id])

  useEffect(() => {
    if (!loadingTaskTypes && !loadingTask) {
      setLoadingForm(false)
    }
  }, [loadingTaskTypes, loadingTask])

  useEffect(() => {
    if (!loadingTaskTypes && currentTaskType) {
      checkIfExistsTaskType(
        currentTaskType.id,
        currentTaskType.name,
        currentTaskType.icon,
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingTaskTypes, currentTaskType, taskTypes])

  useEffect(() => {
    form.resetFields()
    if (editData) {
      if (
        editData.time &&
        editData.time !== 0 &&
        editData.timeType !== 0 &&
        !systemNotificationInitial
      ) {
        form.setFieldsValue({
          systemNotification: {
            label: `${notificationOptions[11].description} - ${editData.time} ${
              timeTypes.find(t => t.id === editData.timeType)?.name
            } antes`,
            value: notificationOptions[11].description,
          },
        })
      }
      if (
        editData.timeMail &&
        editData.timeMail !== 0 &&
        editData.timeTypeMail !== 0 &&
        !mailNotificationInitial
      ) {
        form.setFieldsValue({
          mailNotification: {
            label: `${notificationOptions[11].description} - ${
              editData.timeMail
            } ${
              timeTypes.find(t => t.id === editData.timeTypeMail)?.name
            } antes`,
            value: notificationOptions[11].description,
          },
        })
      }

      if (editData.isAllDay) {
        form.setFieldsValue({
          hourFullDay: editData.hourFullDay && moment(editData.hourFullDay),
          hourFullDayMail:
            editData.hourFullDayMail && moment(editData.hourFullDayMail),
        })
      }

      setNotification({ time: editData.time, type: editData.timeType })
      setMailNotification({
        time: editData.timeMail,
        type: editData.timeTypeMail,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  return (
    <React.Fragment>
      <CustomNotificationModal
        fieldName={customizeNotification.fieldName}
        setNotification={customizeNotification.setNotification}
        notification={customizeNotification.notification}
        {...{
          visibleCustomNotification,
          setVisibleCustomNotification,
          form,
          notificationOptions,
        }}
      />
      <Skeleton loading={loadingForm} paragraph={{ rows: 10 }} active />

      <div
        style={{ display: loadingForm ? 'none' : 'block', overflowX: 'hidden' }}
      >
        <Form layout="vertical" form={form}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}

          <Row gutter={20}>
            <Col span={10}>
              <TaskFormInputTaskType
                editData={editData}
                taskTypes={taskTypes}
                canBeUpdated={canBeUpdated}
                onChange={() => {
                  if (subjectInput.current) {
                    subjectInput.current.focus()
                  }
                }}
              />
            </Col>

            <Col span={14}>
              <Form.Item
                label="Assunto"
                className="mb-1"
                name="subject"
                initialValue={editData ? editData?.subject : null}
                rules={[{ required: true, message: 'Informe o assunto!' }]}
              >
                <Input
                  placeholder="Informe o assunto"
                  disabled={!canBeUpdated}
                  autoFocus
                  ref={subjectInput}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={6}>
              <Form.Item
                label="Data"
                className="mb-1"
                name="expectedDate"
                initialValue={
                  editData && editData.expectedDateTime
                    ? moment(editData.expectedDateTime)
                    : null
                }
                rules={[{ required: true, message: 'Informe a data!' }]}
              >
                <DatePicker
                  placeholder="DD/MM/AAAA"
                  format="DD/MM/YYYY"
                  disabled={!canBeUpdated || !canAlterDate}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col
              span={6}
              style={{
                display: form.getFieldValue('isAllDay') ? 'none' : 'block',
              }}
            >
              <Form.Item
                label={
                  <React.Fragment>
                    <span style={{ color: 'red' }}>*&nbsp;</span>Hora
                  </React.Fragment>
                }
                name="expectedTime"
                initialValue={
                  editData && editData.expectedDateTime
                    ? moment(editData.expectedDateTime)
                    : null
                }
                rules={[
                  {
                    validator: expectedTimeValidate,
                  },
                ]}
                className="mb-1"
              >
                <TimePicker
                  className="w-full"
                  placeholder="HH:MM"
                  disabled={!canBeUpdated || !canAlterDate}
                  format="HH:mm"
                  defaultOpenValue={moment('08:00', 'HH:mm')}
                />
              </Form.Item>
            </Col>

            <Col
              span={6}
              style={{
                display: form.getFieldValue('isAllDay') ? 'none' : 'block',
              }}
            >
              <Form.Item
                label={
                  <React.Fragment>
                    <span style={{ color: 'red' }}>*&nbsp;</span>Duração
                  </React.Fragment>
                }
                name="expectedDuration"
                initialValue={editData ? editData?.expectedDuration : null}
                rules={[
                  {
                    validator: expectedDurationValidate,
                  },
                ]}
                className="mb-1"
              >
                <TimePicker
                  className="w-full"
                  placeholder="HH:MM"
                  disabled={!canBeUpdated || !canAlterDate}
                  minuteStep={5}
                  format="HH:mm"
                  defaultOpenValue={moment('00:00', 'HH:mm')}
                />
              </Form.Item>
            </Col>
            <Col
              span={6}
              style={{
                display: !form.getFieldValue('isAllDay') ? 'none' : 'block',
              }}
            >
              <Form.Item
                label={
                  <React.Fragment>
                    <span style={{ color: 'red' }}>*&nbsp;</span>Número de dias
                  </React.Fragment>
                }
                name="durationDays"
                initialValue={editData ? editData?.durationDays : null}
                rules={[
                  {
                    validator: durationDaysValidate,
                  },
                ]}
                className="mb-1"
              >
                <InputNumber
                  className="w-full"
                  min={1}
                  disabled={!canBeUpdated || !canAlterDate}
                />
              </Form.Item>
            </Col>

            <Col style={{ marginTop: '30px' }} span={6}>
              <Form.Item
                name="isAllDay"
                valuePropName="checked"
                initialValue={
                  editData &&
                  editData?.isAllDay !== null &&
                  editData?.isAllDay !== undefined
                    ? editData?.isAllDay
                    : false
                }
              >
                <Checkbox
                  disabled={!canBeUpdated || !canAlterDate}
                  onChange={e => setKey(key + 1)}
                >
                  Dia inteiro
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={isAllDay ? 6 : 12}>
              <Form.Item
                label="Notificação no sistema"
                name="systemNotification"
                className="mb-1"
                initialValue={
                  editData
                    ? {
                        label: systemNotificationInitial,
                        value: systemNotificationInitial,
                      }
                    : {
                        label: notificationOptions[0].description,
                        value: notificationOptions[0].description,
                      }
                }
              >
                <Select
                  disabled={!canBeUpdated || !canAlterDate}
                  labelInValue
                  onChange={register => {
                    const ntfSelected = filteredNotificationOptions.filter(
                      f => f.description === register.value,
                    )[0]

                    ntfSelected.timeType === 0
                      ? handleCustomNotification(
                          'systemNotification',
                          setNotification,
                          notification,
                        )
                      : setNotification({
                          time: ntfSelected.time,
                          type: ntfSelected.timeType,
                        })
                  }}
                >
                  {filteredNotificationOptions.map(ntf => (
                    <Select.Option value={ntf.description}>
                      {ntf.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {isAllDay && notification?.time !== 0 && (
              <Col span={6} className="flex">
                <div className="mt-10">às</div>
                <Form.Item
                  label="Horário"
                  name="hourFullDay"
                  initialValue={
                    editData?.hourFullDayMail
                      ? moment(editData.hourFullDayMail)
                      : null
                  }
                  rules={[
                    {
                      required: notification.type !== 1,
                      message: 'Informe o horário!',
                    },
                  ]}
                  className="mb-1 ml-3"
                >
                  <TimePicker
                    format="HH:mm"
                    disabled={!canBeUpdated || !canAlterDate}
                    onChange={e => setKey(key + 1)}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={isAllDay ? 6 : 12}>
              <Form.Item
                label="Notificação por email"
                name="mailNotification"
                initialValue={
                  editData
                    ? {
                        label: mailNotificationInitial,
                        value: mailNotificationInitial,
                      }
                    : {
                        label: notificationOptions[0].description,
                        value: notificationOptions[0].description,
                      }
                }
                className="mb-1"
              >
                <Select
                  disabled={!canBeUpdated || !canAlterDate}
                  labelInValue
                  onChange={register => {
                    const ntfSelected = filteredNotificationOptions.filter(
                      f => f.description === register.value,
                    )[0]

                    ntfSelected.timeType === 0
                      ? handleCustomNotification(
                          'mailNotification',
                          setMailNotification,
                          mailNotification,
                        )
                      : setMailNotification({
                          time: ntfSelected.time,
                          type: ntfSelected.timeType,
                        })
                  }}
                >
                  {filteredNotificationOptions.map(ntf => (
                    <Select.Option value={ntf.description}>
                      {ntf.description}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {isAllDay && mailNotification?.time !== 0 && (
              <Col span={6} className="flex">
                <div className="mt-10">às</div>
                <Form.Item
                  label="Horário"
                  name="hourFullDayMail"
                  initialValue={
                    editData?.hourFullDayMail
                      ? moment(editData.hourFullDayMail)
                      : null
                  }
                  rules={[
                    {
                      required: mailNotification.type !== 1,
                      message: 'Informe o horário!',
                    },
                  ]}
                  className="mb-1 ml-3"
                >
                  <TimePicker
                    format="HH:mm"
                    disabled={!canBeUpdated || !canAlterDate}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={20}>
            <Col span={14}>
              <TaskFormInputCompany
                form={form}
                canBeUpdated={canBeUpdated && !proposal}
                companySource={companySource}
                setCompanySource={setCompanySource}
                ref={companyInput}
                onChange={onChangeCompany}
                editData={editData}
                newModal={newModal}
              />
            </Col>

            <Col span={10}>
              <TaskFormInputSeller
                form={form}
                canBeUpdated={canBeUpdated}
                sellerSource={sellerSource}
                setSellerSource={setSellerSource}
                editData={editData}
                owner={taskOwner}
                franchiseeOwnerId={franchiseeOwnerId}
                newModal={newModal}
              />
            </Col>
          </Row>

          <Row gutter={20}>
            <Col
              span={14}
              style={{
                display:
                  (taskOwner?.ownerProfile === 'Franchisor' &&
                    !companyIsFranchisee(
                      form.getFieldValue('companyId'),
                      companySource,
                    )) ||
                  (taskOwner?.ownerProfile === 'Franchise' &&
                    !form.getFieldValue('franchiseeId') &&
                    form.getFieldValue('companyId'))
                    ? 'block'
                    : 'none',
              }}
            >
              <TaskFormInputFranchisee
                form={form}
                canBeUpdated={canBeUpdated && !proposal}
                franchiseeSource={franchiseeSource}
                setFranchiseeSource={setFranchiseeSource}
                onChange={onChangeFranchisee}
                editData={editData}
                ownerProfile={taskOwner?.ownerProfile}
                newModal={newModal}
              />
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={16}>
              <Form.Item
                label="Observações"
                name="observation"
                initialValue={editData ? editData?.observation : null}
              >
                <TextArea
                  placeholder="Inserir observações"
                  disabled={!canBeUpdated}
                  autoSize={{
                    minRows: 2,
                    maxRows: 3,
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <TaskFormInputProposal
                form={form}
                canBeUpdated={canBeUpdated && !proposal}
                proposalSource={proposalSource}
                setProposalSource={setProposalSource}
                editData={editData}
                newModal={newModal}
              />
            </Col>
          </Row>
          {realizedDate && (
            <Alert
              message={`Tarefa concluida em ${realizedDate.format(
                'DD/MM/YYYY HH:mm:ss',
              )}`}
              type="success"
              showIcon
            />
          )}

          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </div>
      <div className="ant-modal-footer sticky-footer">
        {notificationId && !somenteVisualizacao ? (
          <div className="flex">
            <Form.Item
              name="postpone"
              initialValue={1}
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Adiar notificação"
                style={{ width: '200px' }}
              >
                <Select.Option
                  value={1}
                  onClick={() => setPostpone({ time: 5, type: 'minutes' })}
                >
                  5 minutos
                </Select.Option>
                <Select.Option
                  value={2}
                  onClick={() => setPostpone({ time: 10, type: 'minutes' })}
                >
                  10 minutos
                </Select.Option>
                <Select.Option
                  value={3}
                  onClick={() => setPostpone({ time: 15, type: 'minutes' })}
                >
                  15 minutos
                </Select.Option>
                <Select.Option
                  value={4}
                  onClick={() => setPostpone({ time: 30, type: 'minutes' })}
                >
                  30 minutos
                </Select.Option>
                <Select.Option
                  value={5}
                  onClick={() => setPostpone({ time: 1, type: 'hours' })}
                >
                  1 hora
                </Select.Option>
                <Select.Option
                  value={6}
                  onClick={() => setPostpone({ time: 2, type: 'hours' })}
                >
                  2 horas
                </Select.Option>
                <Select.Option
                  value={7}
                  onClick={() => setPostpone({ time: 1, type: 'days' })}
                >
                  1 dia
                </Select.Option>
              </Select>
            </Form.Item>

            <Button
              className="ml-2 mr-auto"
              ghost
              style={{
                color: '#4CAF50',
                border: '1px solid #4CAF50',
              }}
              onClick={handlePostponeNotification}
            >
              Adiar
            </Button>
            <Button onClick={handleDiscardNotification}>Descartar</Button>
          </div>
        ) : (
          canBeUpdated && (
            <React.Fragment>
              <Button
                type="primary"
                className="formButton"
                loading={isSaving}
                disabled={loadingForm}
                onClick={e => handleSubmit(e, false)}
              >
                Agendar
              </Button>
              <Button
                type="primary"
                className="formOutlineButton"
                loading={isSaving}
                disabled={loadingForm}
                onClick={e => handleSubmit(e, true)}
              >
                Concluir e Agendar
              </Button>
            </React.Fragment>
          )
        )}
      </div>
    </React.Fragment>
  )
}

export default TaskFormImplement

TaskFormImplement.propTypes = {
  closeTaskForm: PropTypes.func,
  form: PropTypes.object,
  newTask: PropTypes.func,
  owner: PropTypes.any,
  proposal: PropTypes.object,
  refreshData: PropTypes.func,
  show: PropTypes.bool,
  taskId: PropTypes.number,
}
