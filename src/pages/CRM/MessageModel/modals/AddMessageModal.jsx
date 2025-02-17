import { Form } from '@ant-design/compatible'
import { apiCRM } from '@services/api'
import { handleAuthError, fieldsValidationToast, hasPermission} from '@utils'
import { Button, message, Modal, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import draftToHtml from 'draftjs-to-html'
import { formatMessage } from 'umi-plugin-react/locale'
import AddMessageModalForm from './AddMessageModalForm'
import { convertToRaw, EditorState } from 'draft-js'


function AddMessageModal({
  form,
  visibleMessageModal,
  setVisibleMessageModal,
  editData,
  getData,
  folders,
  userPermissions,
  modelObjects,
  ownerProfile,
}) {
  const [textContent, setTextContent] = useState(EditorState.createEmpty())
  const [alertMessages, setAlertMessages] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    setCanBeUpdated(
         (!editData?.messageModelItemEmailId && hasPermission(userPermissions, 'Include')) ||
         (editData?.messageModelItemEmailId && editData.canBeUpdated && hasPermission(userPermissions, 'Alter'))
         )
  },[editData, userPermissions])
  
  const onEditorStateChange = editorState => {
    if (canBeUpdated) {
      setTextContent(editorState)
    }
  }

  function handleSubmit(e) {
    e && e.preventDefault()
    setAlertMessages([])
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        fieldsValidationToast(err)
      } else {
        
        const textEditorData = !canBeUpdated
          ? editData?.body || null
          : textContent
          ? draftToHtml(convertToRaw(textContent.getCurrentContent()))
          : ''

        const plainText = !canBeUpdated
          ? editData?.body || null
          : textContent
          ? textContent.getCurrentContent().getPlainText('\u0001')
          : ''

        if (!textEditorData || !plainText) {
          message.error('Informe o conteúdo do modelo!')
          setAlertMessages(['Informe o conteúdo do modelo!'])
        } else {
          saveModel(textEditorData)
        }
      }  
    })
  }
  
  async function saveModel(textEditorData) {
    setIsSaving(true)
    const body = 
    {
      messageModelItemEmailId: editData?.messageModelItemEmailId || 0,
      messageModelFolderEmailId: form.getFieldValue('folder'),
      name: form.getFieldValue('name'),
      subject: form.getFieldValue('subject'),
      body: textEditorData,
      addProposalPrint: form.getFieldValue('addProposalPrint'),
    }
    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/messageModelItemEmail`,
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
        setVisibleMessageModal(false)
        getData()
      } else if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
          message.error('Existem erros de validação no modelo!')
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
      title={!editData ? 'Adicionar novo modelo de mensagem' : canBeUpdated ? 'Editar modelo de mensagem' : 'Consultar modelo de mensagem'}
      visible={visibleMessageModal}
      width="87%"
      centered
      destroyOnClose
      onOk={handleSubmit}
      onCancel={() => setVisibleMessageModal(false)}
      footer={
        <Row type="flex">
          <Col>
            {canBeUpdated && (
              <Button
                key="submit"
                loading={isSaving}
                onClick={handleSubmit}
                style={{ backgroundColor: '#4CAF50', color: 'white' }}
              >
                Salvar
              </Button>
            )}
          </Col>
          <Col className="ml-auto">
            <Button
              type="secondary"
              key="back"
              onClick={() => setVisibleMessageModal(false)}
            >
              Cancelar
            </Button>
          </Col>
        </Row>
      }
    >
      <AddMessageModalForm
        {...
           { form, 
             folders, 
             textContent, 
             onEditorStateChange, 
             alertMessages, 
             editData, 
             visibleMessageModal, 
             setTextContent, 
             handleSubmit, 
             canBeUpdated,
             modelObjects,
             ownerProfile,
           }
        }
      />
      <input type="submit" id="submit-form" className="hidden" />
    </Modal>
  )
}

AddMessageModal.propTypes = {
  form: PropTypes.any,
  setVisibleMessageModal: PropTypes.any,
  visibleMessageModal: PropTypes.bool,
  editData: PropTypes.any,
  getData: PropTypes.func,
  folders: PropTypes.array,
  userPermissions: PropTypes.array,
  modelObjects: PropTypes.array,
  ownerProfile: PropTypes.string,
}

const WrappedAddMessageModal = Form.create()(AddMessageModal)
export default WrappedAddMessageModal
