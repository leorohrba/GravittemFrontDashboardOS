import { apiCRM } from '@services/api'
import { Form, Button, Modal, Row, message, Spin } from 'antd'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import TaskGenerateModalForm from './TaskGenerateModalForm'
import {
  handleAuthError,
} from '@utils'

function TaskGenerateModal({
  visibleModal,
  setVisibleModal,
  companies,
  refreshGrid,
}) {
  
  const [loading, setLoading] = useState(true)
  const [loadingSalesFunnel, setLoadingSalesFunnel] = useState(true)
  const [loadingTaskType, setLoadingTaskType] = useState(true)
  const [sellerSource, setSellerSource]  = useState([])
  const [salesFunnels, setSalesFunnels] = useState([])
  const [taskTypes, setTaskTypes] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])

  const [form] = Form.useForm()
  
  useEffect(() => {
    if (!loadingSalesFunnel && !loadingTaskType) {
      setLoading(false)
    }
  },[loadingSalesFunnel, loadingTaskType])
  
  useEffect(() => {
    if (visibleModal) {
      if (companies?.length === 0) {
        message.error('Não há clientes informados!')
        setVisibleModal(false)
        return
      }
      getSalesFunnels()
      getTaskTypes() 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps   
  }, [visibleModal])
  
  async function getSalesFunnels(includeSalesFunnelId) {
    setLoadingSalesFunnel(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesFunnel`,
        params: { useFilterType: true, includeSalesFunnelId },
      })

      setLoadingSalesFunnel(false)

      const { data } = response

      if (data.isOk) {
        if (data.salesFunnel.length === 0) {
          message.error('Não existe funil cadastrado!')
          setVisibleModal(false)
        } else {
          setSalesFunnels(data.salesFunnel)
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }  

  async function getTaskTypes() {
    setLoadingTaskType(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/taskType`,
      })
      setLoadingTaskType(false)
      const { data } = response
      if (data.isOk) {
        if (data.taskType.length === 0) {
          message.error('Não existe tipo de tarefa cadastrado!')
          setVisibleModal(false)
        } else {
          setTaskTypes(data.taskType)
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }  
  
  const handleSubmit = e => {
    e && e.preventDefault()

    setAlertMessages([])

    form.validateFields().then(values => {
      taskGenerate()
    }).catch(err => {
      if (Object.keys(err).length === 1) {
        message.error('Preencha o campo demarcado corretamente!')
      } else {
        message.error('Preencha os campos demarcados corretamente!')
      }
    })
  }
  
  async function taskGenerate() {

    setIsSaving(true)
    
    const body = {
      sellerId: form.getFieldValue('sellerId'),
      expectedDateTime: moment(form.getFieldValue('expectedDate')).format('YYYY-MM-DD'),
      expectedDuration: 1 * 24 * 60 ,
      isAllDay: true,
      taskTypeId: form.getFieldValue('taskTypeId'),
      subject: form.getFieldValue('subject'),
      funnelStageId: form.getFieldValue('funnelStageId'),
      companies,
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/TaskProposalBatch`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        message.success('Salvo com sucesso!')
        if (refreshGrid !== undefined) {
          refreshGrid()
        }
        setVisibleModal(false)
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
  
  return (
  <React.Fragment>  
    <Modal
      visible={visibleModal}
      title={`Agendar tarefa (${companies.length})`}
      onCancel={() => setVisibleModal(false)}
      onOk={e => handleSubmit(e)}
      centered
      width="700px"
      footer={
        <Row type="flex">
          <Button
            className="formButton"
            type="secondary"
            loading={isSaving}
            onClick={(e) => handleSubmit(e)}
          >
              Atualizar
          </Button>
          <Button
            type="secondary"
            onClick={() => setVisibleModal(false)}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Spin size="large" spinning={loading}>
        <TaskGenerateModalForm
          {...{
            handleSubmit,
            form,
            alertMessages,
            sellerSource,
            setSellerSource,
            taskTypes,
            salesFunnels,
         }}
        />
      </Spin>     
    </Modal>
  </React.Fragment>  
  )
}

TaskGenerateModal.propTypes = {
  visibleModal: PropTypes.bool,
  setVisibleModal: PropTypes.func,
  companies: PropTypes.array,
  refreshGrid: PropTypes.func,
}

export default TaskGenerateModal



