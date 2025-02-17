import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Alert, message, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import CallHistoryInputResponsible from '../components/CallHistoryInputResponsible'

function CallHistoryHeaderEditModalForm({
  form,
  modalVisible,
  toogleModalVisible,
  selectedRowKeys,
  onChange,
}) {
  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [responsibleSource, setResponsibleSource] = useState([])
  
  async function saveCalls() {
    setAlertMessages([])

    const updateBody = {
      callUpdate: {
        responsibleUserId: form.getFieldValue('responsibleId'),
        callId: selectedRowKeys,
      },
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/CallUpdateBatch`,
        data: updateBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        onChange()
        toogleModalVisible()
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

  const handleSubmit = e => {
    e.preventDefault()

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!form.getFieldValue('responsibleId')) {
          message.error('Informe o responsável para poder fazer a atualização!')
        } else {
          saveCalls()
        }
      }
    })
  }

  return (
    <Modal
      onCancel={toogleModalVisible}
      visible={modalVisible}
      width="450px"
      title={`Editar em lote (${selectedRowKeys.length})`}
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            htmlType="submit"
            onClick={handleSubmit}
            loading={isSaving}
          >
            Atualizar
          </Button>
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
      <Form layout="vertical" onSubmit={handleSubmit} className="login-form">
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}

        <CallHistoryInputResponsible 
          canBeUpdated 
          autoFocus 
          form={form} 
          responsibleSource={responsibleSource}
          setResponsibleSource={setResponsibleSource}
        />

        <input type="submit" id="submit-form" className="hidden" />
      </Form>
    </Modal>
  )
}

CallHistoryHeaderEditModalForm.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  selectedRowKeys: PropTypes.number,
  toogleModalVisible: PropTypes.func,
  onChange: PropTypes.func,
}

const WrappedCallHistoryHeaderEditModalForm = Form.create({
  name: 'normal_login',
})(CallHistoryHeaderEditModalForm)
export default WrappedCallHistoryHeaderEditModalForm
