import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Alert, message, Modal, Row, Skeleton, Spin } from 'antd'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import MaterialsHeaderModalForm from './MaterialsHeaderModalForm'

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

function MaterialsHeaderModal({
  form,
  modalVisible,
  toogleModalVisible,
  libraryId,
  refreshCollapse,
  userPermissions,
  setLibraryId,
}) {
  const [textContent, setTextContent] = useState('')
  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingForAttachment, setIsSavingForAttachment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingAttachments, setLoadingAttachments] = useState(false)
  const [recipientSource, setRecipientSource] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [canBeSent, setCanBeSent] = useState(true)
  const [details, setDetails] = useState('')
  const [detailsHtml, setDetailsHtml] = useState('')
  const [attachments, setAttachments] = useState([])
  const [editData, setEditData] = useState(null)

  const homeRef = useRef(null)
  const executeScroll = () => scrollToRef(homeRef)

  useEffect(() => {
    form.resetFields()
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [editData])

  useEffect(() => {
    if (modalVisible) {
      clearForm()
      if (libraryId > 0) {
        getLibrary()
      } else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible])

  function clearForm() {
    setRecipientSource([])
    setAttachments([])
    setCanBeUpdated(hasPermission(userPermissions, 'Include'))
    setCanBeSent(hasPermission(userPermissions, 'Include'))
    setTextContent('')
    setDetailsHtml('')
    setDetails('')
    if (editData === null) {
      form.resetFields()
    } else {
      setEditData(null)
    }
    
  }

  const onEditorStateChange = editorState => {
    if (canBeUpdated) {
      setTextContent(editorState)
    }
  }

  const handleSubmit = (e, closeWindow) => {
    e.preventDefault()
    setAlertMessages([])

    if (!canBeSent) {
      message.error('Material não pode ser enviado!')
      return
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const textEditorData = !canBeUpdated
          ? detailsHtml
          : textContent
          ? draftToHtml(convertToRaw(textContent.getCurrentContent()))
          : ''

        const plainText = !canBeUpdated
          ? details
          : textContent
          ? textContent.getCurrentContent().getPlainText('\u0001')
          : ''

        if (!plainText || !textEditorData) {
          message.error('Digite o conteúdo do material!')
          setAlertMessages(['Digite o conteúdo do material!'])
        } else {
          const formValues = { ...values, textEditorData, plainText }
          saveLibrary(formValues, closeWindow)
        }
      }
    })
  }

  async function saveLibrary(formValues, closeWindow) {
    if (closeWindow) {
      setIsSaving(true)
    } else {
      setIsSavingForAttachment(true)
    }
    const franchiseIds = []
    const franchiseListIds = []

    formValues.recipient.map(record => {
      if (record.substr(0, 1) === 'f') {
        franchiseIds.push(parseInt(record.substr(1), 10))
      } else {
        franchiseListIds.push(parseInt(record.substr(1), 10))
      }
      return true
    })

    const libraryBody = {
      library: {
        libraryId,
        title: formValues.title,
        type: formValues.type,
        details: formValues.plainText,
        detailsHtml: formValues.textEditorData,
        franchiseIds,
        franchiseListIds,
      },
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/library`,
        data: libraryBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)
      setIsSavingForAttachment(false)

      const { data } = response

      if (data.isOk) {
        refreshCollapse()
        if (closeWindow) {
          toogleModalVisible()
        } else {
          if (libraryId === 0) {
            setLibraryId(parseInt(data.idGenerated, 10))
          }
          setDetailsHtml(formValues.textEditorData)
          setDetails(formValues.plainText)
        }
      } else if (data.validationMessageList.length > 0) {
        setAlertMessages(data.validationMessageList)
        message.error(
          data.validationMessageList.length === 1
            ? 'Foi encontrado um problema no material. Verifique a mensagem no topo da tela.'
            : `Foram encontrados ${data.validationMessageList.length} problemas no material. Verifique as mensagens no topo da tela.`,
        )
        executeScroll()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      setIsSavingForAttachment(false)
      handleAuthError(error)
    }
  }

  async function getLibrary() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/library`,
        params: { libraryId, getLibraryDetails: true },
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        const libraries = data.library
        if (libraries.length === 0) {
          message.error('Erro ao buscar material!')
          toogleModalVisible()
          return
        }

        const library = libraries[0]

        setAttachments(library.attaches)
        setDetails(library.details)
        setDetailsHtml(library.detailsHtml)

        const contentBlock = htmlToDraft(library.detailsHtml)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
          )
          const editorState = EditorState.createWithContent(contentState)
          setTextContent(editorState)
        }

        setCanBeUpdated(
          hasPermission(userPermissions, 'Alter') && library.readCount === 0,
        )
        setCanBeSent(hasPermission(userPermissions, 'Alter'))

        const source = []
        const recipient = []

        library.franchiseLists.map(record => {
          recipient.push(`l${record.franchiseListId}`)
          source.push({
            label: record.franchiseListName,
            value: `l${record.franchiseListId}`,
            recipientId: record.franchiseListId,
            recipientType: 'FranchiseList',
          })
          return true
        })

        library.franchises.map(record => {
          if (!record.isFranchiseList) {
            recipient.push(`f${record.franchiseId}`)
            source.push({
              label: record.franchiseShortName,
              value: `f${record.franchiseId}`,
              recipientId: record.franchiseId,
              recipientType: 'Franchise',
            })
          }
          return true
        })

        setRecipientSource(source)
        library.recipient = recipient
        setEditData(library)
        
      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  async function getLibraryAttachments() {
    setLoadingAttachments(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/libraryAttaches`,
        params: { libraryId },
      })

      const { data } = response
      setLoadingAttachments(false)

      if (data.isOk) {
        setAttachments(data.attaches)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoadingAttachments(false)
      handleAuthError(error)
    }
  }

  const onChangeAttachments = () => {
    getLibraryAttachments()
    refreshCollapse()
  }

  return (
    <Modal
      onCancel={toogleModalVisible}
      visible={modalVisible}
      width="800px"
      style={{ top: '10px' }}
      title={libraryId === 0 ? 'Novo material' : `Material ${libraryId}`}
      footer={
        <Row type="flex">
          {!loading && (
            <Button
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              htmlType="submit"
              onClick={e => handleSubmit(e, true)}
              loading={isSaving}
              disabled={!canBeSent}
            >
              Enviar
            </Button>
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
      {!canBeUpdated && (
        <Alert
          type="warning"
          message="Material não pode ser alterado."
          showIcon
          className="mb-2"
        />
      )}
      <div id="alertLibrary" ref={homeRef}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}
      </div>
      <Spin size="large" spinning={loading}>
        <Skeleton loading={loading} paragraph={{ rows: 15 }} active />
        <div style={{ display: loading ? 'none' : 'block' }}>
          <MaterialsHeaderModalForm
            {...{
              handleSubmit,
              form,
              textContent,
              onEditorStateChange,
              recipientSource,
              setRecipientSource,
              editData,
              canBeUpdated,
              canBeSent,
              onChangeAttachments,
              attachments,
              loadingAttachments,
              libraryId,
              isSavingForAttachment,
            }}
          />
        </div>
      </Spin>
    </Modal>
  )
}

MaterialsHeaderModal.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  libraryId: PropTypes.number,
  refreshCollapse: PropTypes.func,
  userPermissions: PropTypes.array,
  setLibraryId: PropTypes.func,
}

const WrappedMaterialsHeaderModal = Form.create({
  name: 'normal_login',
})(MaterialsHeaderModal)
export default WrappedMaterialsHeaderModal
