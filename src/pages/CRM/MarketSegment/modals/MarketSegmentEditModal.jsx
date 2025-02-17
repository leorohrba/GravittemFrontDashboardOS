/* eslint-disable react/jsx-no-bind */
import { Form } from '@ant-design/compatible'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Button, Input, Modal , message, Alert, Spin, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

function MarketSegmentEditModal(props) {

  const { form, 
          visible, 
          marketSegmentId, 
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
        saveMarketSegment()
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
      if (marketSegmentId) {
        getMarketSegment()
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
  }, [visible, marketSegmentId])

  async function getMarketSegment() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/CRM/SegmentoMercado`,
        params: { id: marketSegmentId },
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        if (data.segmentoMercado.length === 0) {
          message.error('Segmento de mercado não existe ou você não tem acesso a ela!')
          handleCancel()
        } else {
          setEditData(data.segmentoMercado[0])
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

  async function saveMarketSegment() {
    setIsSaving(true)

    const body = {
      id: marketSegmentId,
      descricao: form.getFieldValue('description'),
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/CRM/SegmentoMercado`,
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
        !marketSegmentId ? 
        'Adicionar segmento de mercado' : 
        hasPermission(userPermissions,'Alter') ?
        'Alterar segmento de mercado' : 'Consultar segmento de mercado'
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
              {!marketSegmentId ? 'Adicionar' : 'Salvar'}
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
                  placeholder="Digite o segmento de mercado"
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

MarketSegmentEditModal.propTypes = {
  setVisible: PropTypes.func,
  form: PropTypes.object,
  key: PropTypes.number,
  marketSegmentId: PropTypes.string,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  refreshGrid: PropTypes.func,
}

const WrappedMarketSegmentEditModal = Form.create()(MarketSegmentEditModal)

export default WrappedMarketSegmentEditModal
