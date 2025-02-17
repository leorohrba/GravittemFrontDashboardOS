import { Form } from '@ant-design/compatible'
import { apiCRM } from '@services/api'
import { handleAuthError, fieldsValidationToast, hasPermission, showNotifications } from '@utils'
import { Button, message, Modal, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import AddFolderModalForm from './AddFolderModalForm'

function AddFolderModal({
  form,
  visibleFolderModal,
  setVisibleFolderModal,
  editData,
  getData,
  userPermissions,
}) {
  
  const [isSaving, setIsSaving] = useState(false)
  
  function handleSubmit(e) {
    e && e.preventDefault()
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        saveFolder()
      }
    })
  }
  async function saveFolder() {
    setIsSaving(true)
    const body = 
    {
      messageModelFolderEmailId: editData?.messageModelFolderEmailId || 0,
      name: form.getFieldValue('name'),
    }
    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/messageModelFolderEmail`,
        data: body,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)
      const { data } = response

      if (data.isOk) {
        message.success(
          formatMessage({
            id: 'successSave',
          }))
        setVisibleFolderModal(false)
        getData()
      } else if (data.validationMessageList.length > 0) {
          showNotifications(data.validationMessageList)
        }
        else 
        {
           data.validationMessageList([data.message])
        }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <Modal
      title={!editData ? 'Adicionar nova pasta' : hasPermission(userPermissions,'Alter') ? 'Editar pasta' : 'Consultar pasta'}
      visible={visibleFolderModal}
      destroyOnClose
      centered
      onCancel={() => setVisibleFolderModal(false)}
      onOk={handleSubmit}
      footer={
        <Row type="flex">
          <Col>
            {hasPermission(userPermissions, 'Alter') && (
              <Button
                key="submit"
                loading={isSaving}
                style={{ backgroundColor: '#4CAF50', color: 'white' }}
                onClick={handleSubmit}
              >
                Salvar
              </Button>
            )}
          </Col>
          <Col className="ml-auto">
            <Button key="back" type="secondary" onClick={() => setVisibleFolderModal(false)}>
              Cancelar
            </Button>
          </Col>
        </Row>
      }
    >
      <AddFolderModalForm {...{ form, visibleFolderModal, editData, userPermissions, handleSubmit }} />
      
      <input type="submit" id="submit-form" className="hidden" />
    </Modal>
  )
}

AddFolderModal.propTypes = {
  form: PropTypes.any,
  editData: PropTypes.any,
  getData: PropTypes.func,
  setVisibleFolderModal: PropTypes.any,
  visibleFolderModal: PropTypes.bool,
  userPermissions: PropTypes.array,
}

const WrappedAddFolderModal = Form.create()(AddFolderModal)
export default WrappedAddFolderModal
