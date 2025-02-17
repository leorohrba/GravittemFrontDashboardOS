/* eslint-disable react/jsx-no-bind */
import { Form } from '@ant-design/compatible'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Button, Input, Modal , message, Alert, Spin, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

function QualificationEditModal(props) {

  const { form, 
          visible, 
          qualificationId, 
          key, 
          setVisible, 
          userPermissions, 
          refreshGrid 
        } = props
  
  const inputDescriptionRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [alertMessages, setAlertMessages] = useState([])
  const [editData, setEditData] = useState(null)

  const handleSubmit = e => {
    e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        saveQualification()
      }
    })
  }

  function handleCancel() {
    setVisible(false)
  }
  
  useEffect(() => {
    if (!loading && inputDescriptionRef.current != null) {
      try { inputDescriptionRef.current.focus() } catch {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[loading])
  
  useEffect(() => {
    form.resetFields()
  // eslint-disable-next-line react-hooks/exhaustive-deps    
  },[editData])

  useEffect(() => {
    if (visible) {
      setAlertMessages([])
      if (qualificationId) {
        getQualification()
      } else {
        if (editData === null) {
          form.resetFields()
        } else {
          setEditData(null)
        }
        setLoading(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, qualificationId])

  async function getQualification() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/Qualificacao`,
        params: { id: qualificationId },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        if (data.qualificacao.length === 0) {
          message.error('Qualificação não existe ou você não tem acesso a ela!')
          handleCancel()
        } else {
          setEditData(data.qualificacao[0])
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

  async function saveQualification() {
    setIsSaving(true)

    const body = {
      id: qualificationId,
      descricao: form.getFieldValue('description'),
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/CRM/Qualificacao`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        setVisible(false)
        refreshGrid()
      } else {
        setAlertMessages(data.validationMessageList)
        if (inputDescriptionRef.current != null) {
          inputDescriptionRef.current.focus()
        }
        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  const { getFieldDecorator } = form

  return (
    <Modal
      visible={visible}
      title={
        !qualificationId ? 
        'Adicionar qualificação' : 
        hasPermission(userPermissions,'Alter') ?
        'Alterar qualificação' : 'Consultar qualificação'
      }
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <React.Fragment>
          {hasPermission(userPermissions, 'Alter') && (
            <Button
              key="submit"
              type="primary"
              loading={isSaving}
              onClick={handleSubmit}
              className="formButton"
            >
              {!qualificationId ? 'Adicionar' : 'Salvar'}
            </Button>
          )}
        </React.Fragment>, 
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
      ]}
    >
      <Spin size="large" spinning={loading || isSaving}>      
      
        <Skeleton
          loading={loading}
          paragraph={{ rows: 3 }}
          active
        />
        
        <div style={{ display: loading ? 'none' : 'block'}}>
        
          {alertMessages.map((message, index) => (
             <Alert
               type="error"
               message={message}
               key={index}
               showIcon
               className="mb-2"
             />
          ))}        

          <Form layout="vertical" onSubmit={handleSubmit}>
            <Form.Item label="Descrição">
              {getFieldDecorator('description', {
                initialValue: editData?.descricao ? editData?.descricao : null,
                rules: [
                  {
                    required: true,
                    message: 'Campo obrigatório!',
                  },
                ],
              })(
                <Input
                  placeholder="Digite a descrição da qualificação"
                  key={key}
                  autoFocus
                  ref={inputDescriptionRef}
                />,
              )}
            </Form.Item>
            <input type="submit" id="submit-form" className="hidden" />
          </Form>

        </div>
        
      </Spin>
      
    </Modal>
  )
}

QualificationEditModal.propTypes = {
  setVisible: PropTypes.func,
  form: PropTypes.object,
  key: PropTypes.number,
  qualificationId: PropTypes.string,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  refreshGrid: PropTypes.func,
}

const WrappedQualificationEditModal = Form.create()(QualificationEditModal)

export default WrappedQualificationEditModal
