/* eslint-disable react/jsx-no-bind */
import { Form } from '@ant-design/compatible'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Button, Input, Modal , message, Alert, Spin, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

function BusinessAreaEditModal(props) {

  const { form, 
          visible, 
          businessAreaId, 
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
        saveBusinessArea()
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
      if (businessAreaId) {
        getBusinessArea()
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
  }, [visible, businessAreaId])

  async function getBusinessArea() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/AreaNegocio`,
        params: { id: businessAreaId },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        if (data.areaNegocio.length === 0) {
          message.error('Área de negócio não existe ou você não tem acesso a ela!')
          handleCancel()
        } else {
          setEditData(data.areaNegocio[0])
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

  async function saveBusinessArea() {
    setIsSaving(true)

    const body = {
      id: businessAreaId,
      descricao: form.getFieldValue('description'),
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/CRM/AreaNegocio`,
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
        !businessAreaId ? 
        'Adicionar área de negócio' : 
        hasPermission(userPermissions,'Alter') ?
        'Alterar área de negócio' : 'Consultar área de negócio'
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
              {!businessAreaId ? 'Adicionar' : 'Salvar'}
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
                  placeholder="Digite a área de negócio"
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

BusinessAreaEditModal.propTypes = {
  setVisible: PropTypes.func,
  form: PropTypes.object,
  key: PropTypes.number,
  businessAreaId: PropTypes.string,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  refreshGrid: PropTypes.func,
}

const WrappedBusinessAreaEditModal = Form.create()(BusinessAreaEditModal)

export default WrappedBusinessAreaEditModal
