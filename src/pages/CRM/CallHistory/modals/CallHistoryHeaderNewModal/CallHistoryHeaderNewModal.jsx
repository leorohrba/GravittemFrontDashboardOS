import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Alert, Col, message, Modal, Row, Spin, Tabs } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import CallHistoryHeaderNewModalForm from './CallHistoryHeaderNewModalForm'
import CallHistoryHeaderNewModalHistory from './CallHistoryHeaderNewModalHistory'

const { TabPane } = Tabs
let callTypesSaved = []
let callStatusSaved = []

function CallHistoryHeaderNewModal({
  form,
  modalVisible,
  toogleModalVisible,
  callId,
  setCallId,
  refreshGrid,
  addOtherCall,
  userPermissions,
  ownerProfile,
  ownerShortName,
  franchiseeId,
}) {
  const [currentCallType, setCurrentCallType] = useState()
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [canUpdateHistory, setCanUpdateHistory] = useState(true)
  const [callTypes, setCallTypes] = useState([])
  const [callHistory, setCallHistory] = useState([])
  const [loadingCallTypes, setLoadingCallTypes] = useState(true)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [callStatus, setCallStatus] = useState([])
  const [loadingCallStatus, setLoadingCallStatus] = useState(true)
  const [alertMessages, setAlertMessages] = useState([])
  const [closedDate, setClosedDate] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [loadingCall, setLoadingCall] = useState(false)
  const inputRef = useRef(null)
  const [franchiseeSource, setFranchiseeSource] = useState([])
  const [requesterSource, setRequesterSource] = useState([])
  const [responsibleSource, setResponsibleSource] = useState([])
  const [currentStatusCode, setCurrentStatusCode] = useState(null)
  const [editData, setEditData] = useState(null)

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])
  
  useEffect(() => {
    if (!loadingCall &&
        !loadingCallTypes &&
        !loadingCallStatus
        && inputRef.current != null) {
      try { inputRef.current.focus() } catch {}
    }
  },[loadingCall, loadingCallTypes, loadingCallStatus])
  
  useEffect(() => {
    if (modalVisible) {
      clearForm()
      getCallTypes()
      getCallStatus()
      if (callId > 0) {
        getCall()
        getCallHistory()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible])

  useEffect(() => {
    if (!loadingCallTypes && currentCallType) {
      checkIfExistsCallType(currentCallType.callTypeId, currentCallType.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingCallTypes, currentCallType, callTypes])

  function checkIfExistsCallType(id, name) {
    const index = callTypesSaved.findIndex(x => x.callTypeId === id)

    if (index < 0) {
      const callTypesWork = callTypesSaved
      callTypesWork.push({ callTypeId: id, name })
      setCallTypes(callTypesWork)
    }
  }

  function clearForm() {
    setClosedDate(null)
    setCurrentCallType(null)
    setCanBeUpdated(hasPermission(userPermissions, 'Include'))
    setCanUpdateHistory(hasPermission(userPermissions, 'Include'))
    let newData = null
    if (ownerProfile === 'Franchise') {
      setFranchiseeSource([{ label: ownerShortName, value: franchiseeId }])
      newData = { franchiseeId }
    } else {
      setFranchiseeSource([])
    }
    setResponsibleSource([])
    setRequesterSource([])
    setCurrentStatusCode(null)
    setCallHistory([])
    if (editData === newData) {
      form.resetFields() 
    } else {
      setEditData(newData)
    }
  }

  useEffect(() => {
    if (!form.getFieldValue('status')) {
      const index = callStatus.findIndex(x => x.code === 'ABRT')
      if (index >= 0) {
        form.setFieldsValue({ status: callStatus[index].statusId })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callStatus, form.getFieldValue('status')])

  async function getCallHistory() {
    setLoadingHistory(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/callHistory`,
        params: { callId },
      })

      const { data } = response

      if (data.isOk) {
        setCallHistory(data.callHistories)
        setLoadingHistory(false)
      } else {
        message.error(data.message)
        setLoadingHistory(false)
      }
    } catch (error) {
      setLoadingHistory(false)
      handleAuthError(error)
    }
  }

  async function getCall() {
    setLoadingCall(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/call`,
        params: { callId },
      })

      setLoadingCall(false)

      const { data } = response

      if (data.isOk) {
        if (data.call.length === 0) {
          message.error('Chamado não existe ou proibido o acesso!')
          toogleModalVisible()
        } else {
          const call = data.call[0]

          setClosedDate(call.closedDate ? moment(call.closedDate) : null)

          setCurrentStatusCode(call.actStatusCode)
          setCurrentCallType({
            callTypeId: call.callTypeId,
            name: call.callTypeName,
          })

          setFranchiseeSource([
            { label: call.franchiseeName, value: call.franchiseeId },
          ])

          setRequesterSource([
            { label: call.requesterName, value: call.requesterUserId },
          ])

          if (call.responsibleUserId) {
            setResponsibleSource([
              { label: call.responsibleName, value: call.responsibleUserId },
            ])
          }

          setCanBeUpdated(
            call.canBeUpdated && hasPermission(userPermissions, 'Alter'),
          )

          setCanUpdateHistory(
            (call.canBeUpdated ||
              (call.franchiseeId === franchiseeId &&
                call.actStatusCode !== 'CONC')) &&
              hasPermission(userPermissions, 'Alter'),
          )
          
          setEditData(call)
          
        }
      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  async function getCallTypes() {
    setLoadingCallTypes(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/callType`,
      })

      const { data } = response

      if (data.isOk) {
        if (data.callType.length === 0) {
          message.error('Não existem tipos de chamados!')
          setLoadingCallTypes(false)
          toogleModalVisible()
        } else {
          callTypesSaved = data.callType
          setCallTypes(callTypesSaved)
          setLoadingCallTypes(false)
        }
      } else {
        setLoadingCallTypes(false)
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      setLoadingCallTypes(false)
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  async function getCallStatus() {
    setLoadingCallStatus(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/callStatus`,
      })

      const { data } = response

      if (data.isOk) {
        if (data.callStatus.length === 0) {
          message.error('Não existem status de chamados!')
          setLoadingCallStatus(false)
          toogleModalVisible()
        } else {
          callStatusSaved = data.callStatus
          setCallStatus(callStatusSaved)
          setLoadingCallStatus(false)
        }
      } else {
        setLoadingCallStatus(false)
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      setLoadingCallStatus(false)
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  const handleSubmit = (e, addOther) => {
    e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveCall(addOther)
      }
    })
  }

  async function saveCall(addOther) {
    const callDate =
      form.getFieldValue('callDate') && form.getFieldValue('callTime')
        ? `${form
            .getFieldValue('callDate')
            .format('YYYY-MM-DD')}T${form
            .getFieldValue('callTime')
            .format('HH:mm')}`
        : null

    const callStatusSelected = callStatus.find(
      x => x.statusId === form.getFieldValue('status'),
    )

    let closedDateWork = closedDate

    if (callStatusSelected) {
      if (
        callStatusSelected.code !== 'ABRT' &&
        callStatusSelected.code !== 'EAND'
      ) {
        if (!closedDateWork || callStatusSelected.code !== currentStatusCode) {
          closedDateWork = moment()
        }
      } else {
        closedDateWork = null
      }
    }

    const callBody = {
      call: {
        callId,
        callDate,
        callTypeId: form.getFieldValue('callTypeId'),
        franchiseeId: form.getFieldValue('franchiseeId'),
        requesterUserId: form.getFieldValue('requesterId'),
        responsibleUserId: form.getFieldValue('responsibleId'),
        actStatusId: form.getFieldValue('status'),
        title: form.getFieldValue('title'),
        description: form.getFieldValue('description'),
        priority: form.getFieldValue('priority'),
        closedDate: closedDateWork
          ? closedDateWork.format('YYYY-MM-DDTHH:mm:ss')
          : null,
      },
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/call`,
        data: callBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        refreshGrid()

        if (callId === 0) {
          setCallId(parseInt(data.idGenerated,10))
          if (inputRef.current != null) {
            inputRef.current.focus()
          }
          Modal.info({
            title: 'Novo chamado gerado',
            content: `O número do chamado gerado foi => ${data.numberGenerated}`,
            okText: 'Ok',
            onOk: () => {
              handlePostSaved(addOther)
            },
          })
        } else {
          handlePostSaved(addOther)
        }
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

  const handlePostSaved = addOther => {
    if (!addOther) {
      toogleModalVisible()
    } else {
      addOtherCall()
      clearForm()
      setCallId(0)
      if (inputRef.current != null) {
        inputRef.current.focus()
      }
    }
  }

  const handleChangeHistory = () => {
    getCallHistory()
  }

  return (
    <Modal
      onCancel={toogleModalVisible}
      visible={modalVisible}
      style={{ top: '10px' }}
      width="730px"
      title={
        <Row align="middle" type="flex">
          <Col>
            {loadingCall || loadingCallTypes || loadingCallStatus
              ? 'Carregando...'
              : !canBeUpdated
              ? `Consultar chamado ${editData?.number || '...'}`
              : callId > 0
              ? `Editar chamado ${editData?.number || '...'}`
              : 'Novo chamado'}
          </Col>
          <Col
            style={{
              display:
                loadingCall || loadingCallTypes || loadingCallStatus || isSaving
                  ? 'block'
                  : 'none',
            }}
          >
            <div style={{ marginLeft: '10px', marginTop: '5px' }}>
              <Spin size="small" />
            </div>
          </Col>
        </Row>
      }
      footer={
        <Row type="flex">
          {canBeUpdated &&
            !loadingCall &&
            !loadingCallTypes &&
            !loadingCallStatus && (
              <React.Fragment>
                <Button
                  style={{ backgroundColor: '#4CAF50', color: 'white' }}
                  htmlType="submit"
                  loading={isSaving}
                  onClick={e => handleSubmit(e, false)}
                >
                  {callId === 0 ? 'Adicionar' : 'Salvar'}
                </Button>
                <Button
                  ghost
                  onClick={e => handleSubmit(e, true)}
                  loading={isSaving}
                  style={{
                    color: '#4CAF50',
                    border: '1px solid #4CAF50',
                  }}
                >
                  Salvar e adicionar outro
                </Button>
              </React.Fragment>
            )}
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={toogleModalVisible}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Tabs
        type="card"
        tabBarExtraContent={
          <React.Fragment>
            {closedDate && (
              <Alert
                style={{ backgroundColor: 'white' }}
                banner
                message={`${
                  currentStatusCode === 'CANC' ? 'Cancelado' : 'Concluido'
                } em ${closedDate.format('DD/MM/YYYY')}`}
                type={currentStatusCode === 'CANC' ? 'error' : 'success'}
                showIcon
              />
            )}
          </React.Fragment>
        }
      >
        <TabPane
          tab={callId === 0 ? 'Novo' : canBeUpdated ? 'Alteração' : 'Consulta'}
          key="1"
        >
          <CallHistoryHeaderNewModalForm
            handleSubmit={handleSubmit}
            form={form}
            callId={callId}
            callTypes={callTypes}
            callStatus={callStatus}
            alertMessages={alertMessages}
            ref={inputRef}
            canBeUpdated={canBeUpdated}
            franchiseeSource={franchiseeSource}
            setFranchiseeSource={setFranchiseeSource}
            requesterSource={requesterSource}
            setRequesterSource={setRequesterSource}
            responsibleSource={responsibleSource}
            setResponsibleSource={setResponsibleSource}
            loading={loadingCall || loadingCallTypes || loadingCallStatus}
            ownerProfile={ownerProfile}
            editData={editData}
          />
        </TabPane>
        <TabPane tab="Histórico" key="2">
          <CallHistoryHeaderNewModalHistory
            loading={loadingHistory}
            history={callHistory}
            callId={callId}
            canBeUpdated={canUpdateHistory}
            onChange={handleChangeHistory}
          />
        </TabPane>
      </Tabs>
    </Modal>
  )
}

CallHistoryHeaderNewModal.propTypes = {
  addOtherCall: PropTypes.func,
  callId: PropTypes.number,
  form: PropTypes.object,
  franchiseeId: PropTypes.number,
  modalVisible: PropTypes.bool,
  ownerProfile: PropTypes.string,
  ownerShortName: PropTypes.string,
  refreshGrid: PropTypes.func,
  setCallId: PropTypes.func,
  toogleModalVisible: PropTypes.func,
  userPermissions: PropTypes.array,
}

const WrappedCallHistoryHeaderNewModal = Form.create({
  name: 'normal_login',
})(CallHistoryHeaderNewModal)

export default WrappedCallHistoryHeaderNewModal
