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
import CommunicationHeaderModalForm from './CommunicationHeaderModalForm'

const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop)

function CommunicationHeaderModal({
  form,
  modalVisible,
  toogleModalVisible,
  communicationId,
  refreshCollapse,
  userPermissions,
}) {
  const [textContent, setTextContent] = useState('')
  const [alertMessages, setAlertMessages] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [recipientSource, setRecipientSource] = useState([])
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [canBeSent, setCanBeSent] = useState(true)
  const [details, setDetails] = useState('')
  const [detailsHtml, setDetailsHtml] = useState('')
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
      if (communicationId > 0) {
        getCommunication()
      } else {
        setLoading(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible])

  function clearForm() {
    setRecipientSource([])
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

  const handleSubmit = e => {
    e.preventDefault()
    setAlertMessages([])

    if (!canBeSent) {
      message.error('Comunicado não pode ser enviado!')
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
          message.error('Digite o conteúdo do comunicado!')
          setAlertMessages(['Digite o conteúdo do comunicado!'])
        } else {
          const formValues = { ...values, textEditorData, plainText }
          saveCommunication(formValues)
        }
      }
    })
  }

  async function saveCommunication(formValues) {
    setIsSaving(true)

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

    const communicationBody = {
      communication: {
        communicationId,
        title: formValues.title,
        details: formValues.plainText,
        detailsHtml: formValues.textEditorData,
        franchiseIds,
        franchiseListIds,
      },
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/communication`,
        data: communicationBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        refreshCollapse()
        toogleModalVisible()
      } else if (data.validationMessageList.length > 0) {
        setAlertMessages(data.validationMessageList)
        message.error(
          data.validationMessageList.length === 1
            ? 'Foi encontrado um problema no comunicado. Verifique a mensagem no topo da tela.'
            : `Foram encontrados ${data.validationMessageList.length} problemas no comunicado. Verifique as mensagens no topo da tela.`,
        )
        executeScroll()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  async function getCommunication() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/communication`,
        params: { communicationId, getCommunicationDetails: true },
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        const communications = data.communication
        if (communications.length === 0) {
          message.error('Erro ao buscar comunicado!')
          toogleModalVisible()
          return
        }

        const communication = communications[0]

        
        setDetails(communication.details)
        setDetailsHtml(communication.detailsHtml)

        const contentBlock = htmlToDraft(communication.detailsHtml)
        if (contentBlock) {
          const contentState = ContentState.createFromBlockArray(
            contentBlock.contentBlocks,
          )
          const editorState = EditorState.createWithContent(contentState)
          setTextContent(editorState)
        }

        setCanBeUpdated(
          hasPermission(userPermissions, 'Alter') &&
            communication.readCount === 0,
        )
        setCanBeSent(hasPermission(userPermissions, 'Alter'))

        const source = []
        const recipient = []

        communication.franchiseLists.map(record => {
          recipient.push(`l${record.franchiseListId}`)
          source.push({
            label: record.franchiseListName,
            value: `l${record.franchiseListId}`,
            recipientId: record.franchiseListId,
            recipientType: 'FranchiseList',
          })
          return true
        })

        communication.franchises.map(record => {
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
        communication.recipient = recipient
        setEditData(communication)
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

  return (
    <Modal
      onCancel={toogleModalVisible}
      visible={modalVisible}
      width="800px"
      style={{ top: '10px' }}
      title={
        communicationId === 0
          ? 'Novo comunicado'
          : `Comunicado ${communicationId}`
      }
      footer={
        <Row type="flex">
          {!loading && (
            <Button
              style={{ backgroundColor: '#4CAF50', color: 'white' }}
              htmlType="submit"
              onClick={handleSubmit}
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
          message="Comunicado não pode ser alterado."
          showIcon
          className="mb-2"
        />
      )}
      <div id="alertCommunication" ref={homeRef}>
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
        <div style={{ display: loading ? 'none' : 'block'}}>
          <CommunicationHeaderModalForm
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
            }}
          />
        </div>
      </Spin>
    </Modal>
  )
}

CommunicationHeaderModal.propTypes = {
  form: PropTypes.object,
  modalVisible: PropTypes.bool,
  toogleModalVisible: PropTypes.func,
  communicationId: PropTypes.number,
  refreshCollapse: PropTypes.func,
  userPermissions: PropTypes.array,
}

const WrappedCommunicationHeaderModal = Form.create({
  name: 'normal_login',
})(CommunicationHeaderModal)
export default WrappedCommunicationHeaderModal
