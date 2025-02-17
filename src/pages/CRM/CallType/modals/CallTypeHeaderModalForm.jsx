import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Input, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

function CallTypeHeaderModalForm({
  form,
  modalVisible,
  toogleModalVisible,
  callTypeId,
  refreshGrid,
  addOtherCallType,
}) {
  const { getFieldDecorator } = form
  const callTypeNameInput = useRef(null)
  const [loadingForm, setLoadingForm] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = (e, addOther) => {
    e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveCallType(addOther)
      }
    })
  }

  function handleCancel() {
    toogleModalVisible()
  }

  useEffect(() => {
    if (modalVisible) {
      form.resetFields()

      if (callTypeId > 0) {
        getCallType()
      } else {
        setLoadingForm(false)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, callTypeId])

  async function getCallType() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/CallType`,
        params: { callTypeId },
      })

      setLoadingForm(false)
      const { data } = response

      if (data.isOk) {
        if (data.callType.length === 0) {
          message.error(
            'Tipo de chamado não existe ou você não tem acesso a ela!',
          )
          handleCancel()
        } else if (data.callType.length > 0 && !data.callType[0].canBeUpdated) {
          message.error('Você não pode alterar o tipo de chamado!')
          handleCancel()
        } else {
          form.setFieldsValue({
            name: data.callType[0].name,
          })
        }
      } else {
        message.error(data.message)
        handleCancel()
      }
    } catch (error) {
      handleAuthError(error)
      handleCancel()
    }
  }

  async function saveCallType(addOther) {
    setIsSaving(true)

    const callTypeBody = {
      callType: {
        callTypeId,
        name: form.getFieldValue('name'),
      },
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/callType`,
        data: callTypeBody,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        refreshGrid()
        if (addOther) {
          form.resetFields()
          addOtherCallType()
          if (callTypeNameInput.current != null) {
            callTypeNameInput.current.focus()
          }
        } else {
          toogleModalVisible()
        }
      } else {
        if (callTypeNameInput.current != null) {
          callTypeNameInput.current.focus()
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)

      handleAuthError(error)
    }
  }

  return (
    <Modal
      onCancel={toogleModalVisible}
      visible={modalVisible}
      title={
        callTypeId > 0 ? 'Alterar tipo de chamado' : 'Cadastrar tipo de chamado'
      }
      footer={
        <Row type="flex">
          <Button
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            htmlType="submit"
            loading={isSaving}
            onClick={e => handleSubmit(e, false)}
          >
            {callTypeId === 0 ? 'Adicionar' : 'Salvar'}
          </Button>
          <Button
            ghost
            loading={isSaving}
            onClick={e => handleSubmit(e, true)}
            style={{
              color: '#4CAF50',
              border: '1px solid #4CAF50',
            }}
          >
            Salvar e adicionar outro
          </Button>
          <Button
            type="secondary"
            style={{ marginLeft: 'auto' }}
            onClick={() => toogleModalVisible()}
          >
            Cancelar
          </Button>
        </Row>
      }
    >
      <Spin spinning={loadingForm}>
        <Skeleton loading={loadingForm} paragraph={{ rows: 1 }} active>
          <Form layout="vertical" onSubmit={e => handleSubmit(e, false)} className="login-form">
            <Form.Item label="Tipo de chamado">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: 'Campo obrigatório!' }],
              })(
                <Input
                  placeholder="Digite o tipo de chamado"
                  ref={callTypeNameInput}
                  autoFocus
                />,
              )}
            </Form.Item>
            <input type="submit" id="submit-form" className="hidden" />
          </Form>
        </Skeleton>
      </Spin>
    </Modal>
  )
}

CallTypeHeaderModalForm.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  callTypeId: PropTypes.number,
  refreshGrid: PropTypes.func,
  addOtherCallType: PropTypes.func,
}

const WrappedCallTypeHeaderModalForm = Form.create({ name: 'normal_login' })(
  CallTypeHeaderModalForm,
)
export default WrappedCallTypeHeaderModalForm
