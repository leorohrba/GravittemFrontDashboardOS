/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { showNotifications, hasPermission } from '@utils'
import { Form, message, Spin, Radio } from 'antd'
import draftToHtml from 'draftjs-to-html'
import PropTypes from 'prop-types'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, ContentState, EditorState } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import EmailFooter from './EmailFooter'
import WhatsAppForm from '../WhatsApp/WhatsAppForm'
import EmailForm from './EmailForm'
import { handleLogin } from '../../../../../../components/modals/WhatsAppModal/components/LoginUtils'
import { filePrintComponents } from '../../../print/print'
import QrCodeModal from '../WhatsApp/QrCodeModal'
import {
  getEmailSent,
  sendEmail,
  sendWhatsapp,
  generateEmail,
  downloadAttachment,
} from './emailServices'

function Email(props) {
  const {
    proposal,
    printLayouts,
    proposalId,
    defaultContacts,
    userPermissions,
    onChange,
    emailSentId,
    emailsFrom,
    allContacts,
    userContact,
    whatsappData,
  } = props
  const [canBeUpdated, setCanBeUpdated] = useState(true)
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrCode, setQrCode] = useState()
  const [qrCodeLoading, setQrCodeLoading] = useState(false) // Loading state for QR code  const [defaultTo, setDefaultTo] = useState(null)
  const [defaultTo, setDefaultTo] = useState(null)
  const [contacts, setContacts] = useState([])
  const [editData, setEditData] = useState(null)
  const [fileList, setFileList] = useState([])
  const [loading, setLoading] = useState(false)
  const [textContent, setTextContent] = useState(EditorState.createEmpty())
  const [textMessage, setTextMessage] = useState('')
  const [visibleMessageModelModal, setVisibleMessageModelModal] = useState(
    false,
  )
  const [messageModel, setMessageModel] = useState(null)
  const [form] = Form.useForm()
  const [selectedForm, setSelectedForm] = useState(
    whatsappData ? 'whatsapp' : 'email',
  ) // State for selected form

  let emailData

  useEffect(() => {
    if (emailSentId) {
      getEmailSent(emailSentId, setLoading, setEditData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailSentId])

  useEffect(() => {
    if (qrCode && !showQrCode) handleLogin(setQrCode, setShowQrCode)
  }, [qrCode])

  useEffect(() => {
    if (whatsappData) {
      setSelectedForm('whatsapp')
      setEditData(whatsappData)
    }
  }, [whatsappData])

  useEffect(() => {
    setCanBeUpdated(
      hasPermission(userPermissions, 'Include') &&
        !editData &&
        proposal?.actStatusCode !== 'LOST',
    )
  }, [userPermissions, editData])

  useEffect(() => {
    form.resetFields()
    if (editData?.body) {
      const contentBlock = htmlToDraft(editData?.body)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
        )
        const editorState = EditorState.createWithContent(contentState)
        setTextContent(editorState)
      } else {
        setTextContent(EditorState.createEmpty())
      }
    } else {
      setTextContent(EditorState.createEmpty())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    let emailContact = null
    if (!defaultContacts) {
      setContacts([])
    } else {
      const isEmail = selectedForm === 'email'
      const findContact = defaultContacts.find(
        x => x.isProposalContact && (isEmail ? x.email : x.cellPhone),
      )
      if (findContact) {
        emailContact = isEmail ? findContact.email : findContact.cellPhone
      }
      setContacts(
        defaultContacts
          .filter(x => (isEmail ? x.email : x.cellPhone) && x.isActive)
          .map(contact => ({
            key: contact.contactId,
            contactId: contact.contactId,
            email: contact.email,
            contactName: contact.contactName,
            type: contact.type,
          })),
      )
    }
    setDefaultTo(emailContact)
  }, [defaultContacts, selectedForm])

  async function handleSubmit() {
    await form
      .validateFields()
      .then(async data => {
        const isEmail = selectedForm === 'email'
        emailData = isEmail
          ? textContent
            ? draftToHtml(convertToRaw(textContent.getCurrentContent()))
            : ''
          : data.message
        if (!emailData && isEmail) {
          showNotifications(['Informe alguma coisa no corpo do e-mail'])
        } else if (data.addProposalPrint) {
          const layout = printLayouts.find(
            x => x.printLayoutDocumentId === data.printLayoutDocumentId,
          )
          if (!layout) {
            message.error(
              `Layout não encontrado!(${form.getFieldValue(
                'printLayoutDocumentId',
              )})`,
            )
          }
          const generateFile = filePrintComponents[layout.method]
          if (!generateFile) {
            message.error('Layout de impressão não encontrado!')
            return
          }
          setLoading(true)
          generateFile({
            proposalId,
            type: 'blob',
            callback: blob => {
              isEmail
                ? sendEmail(
                    form,
                    emailData,
                    proposalId,
                    messageModel,
                    fileList,
                    setLoading,
                    clearForm,
                    onChange,
                    blob,
                  )
                : sendWhatsapp(
                    form,
                    proposalId,
                    fileList,
                    setLoading,
                    clearForm,
                    onChange,
                    blob,
                  )
            },
            documentModelId: layout.documentModelId,
          })
        } else if (isEmail) {
          await sendEmail(
            form,
            emailData,
            proposalId,
            messageModel,
            fileList,
            setLoading,
            clearForm,
            onChange,
          )
        } else {
          setQrCodeLoading(true)
          await handleLogin(setQrCode, setShowQrCode)
          setQrCodeLoading(false)
          await sendWhatsapp(
            form,
            proposalId,
            fileList,
            setLoading,
            clearForm,
            onChange,
          )
        }
      })
      .catch(err =>
        message.error('Preencha os campos demarcados corretamente!'),
      )
  }

  const onSelectModel = model => {
    form.setFieldsValue({ addProposalPrint: !!model?.addProposalPrint })
    setVisibleMessageModelModal(false)
    setMessageModel(model)
    generateEmail(model.messageModelItemEmailId)
  }

  function clearForm() {
    setTextContent(EditorState.createEmpty())
    form.resetFields()
    setMessageModel(null)
    setFileList([])
  }

  return (
    <React.Fragment>
      {!whatsappData && !emailSentId && (
        <Radio.Group
          onChange={e => setSelectedForm(e.target.value)}
          value={selectedForm}
          style={{ marginBottom: 16 }}
        >
          <Radio value="email">E-mail</Radio>
          <Radio value="whatsapp">WhatsApp</Radio>
        </Radio.Group>
      )}
      <Spin size="large" spinning={loading || qrCodeLoading}>
        {selectedForm === 'email' ? (
          <EmailForm
            {...{
              textContent,
              setTextContent,
              form,
              contacts,
              onSelectModel,
              setVisibleMessageModelModal,
              visibleMessageModelModal,
              userPermissions,
              fileList,
              setFileList,
              editData,
              canBeUpdated,
              defaultTo,
              downloadAttachment,
              proposalId,
              printLayouts,
              emailsFrom,
            }}
          />
        ) : (
          <WhatsAppForm
            {...{
              textMessage,
              setTextMessage,
              form,
              contacts,
              onSelectModel,
              setVisibleMessageModelModal,
              visibleMessageModelModal,
              userPermissions,
              fileList,
              setFileList,
              editData,
              canBeUpdated,
              defaultTo,
              downloadAttachment,
              proposalId,
              printLayouts,
              allContacts,
              userContact,
              selectedForm,
            }}
          />
        )}
        <EmailFooter
          {...{ selectedForm, handleSubmit, editData, canBeUpdated, clearForm }}
        />
      </Spin>
      <QrCodeModal
        visible={showQrCode}
        {...{ setShowQrCode, setQrCode, qrCode }}
        onClose={() => setShowQrCode(false)}
      />
    </React.Fragment>
  )
}

Email.propTypes = {
  proposalId: PropTypes.number,
  defaultContacts: PropTypes.array,
  userPermissions: PropTypes.array,
  onChange: PropTypes.func,
  emailSentId: PropTypes.number,
  printLayouts: PropTypes.array,
  emailsFrom: PropTypes.array,
}

export default Email
