import React, { useState, useEffect } from 'react'
import TextEditor from '@components/TextEditor'
import {
  Form,
  Button,
  Input,
  Row,
  Col,
  Upload,
  message,
  Icon,
  Checkbox,
  Select,
  Card,
} from 'antd'
import PropTypes from 'prop-types'
import { isEmail } from '@utils'
import MessageModelModal from '../../../../MessageModel/modals/MessageModelModal'
import PrintProposalModal from '../../../print/modals/PrintProposalModal'

import moment from 'moment'

const { Option, OptGroup } = Select
const fileLimitSizeForUpload = 28 // (em MB)

export default function EmailForm(props) {
  const {
    form,
    contacts,
    onSelectModel,
    visibleMessageModelModal,
    setVisibleMessageModelModal,
    userPermissions,
    fileList,
    setFileList,
    editData,
    defaultTo,
    downloadAttachment,
    canBeUpdated,
    proposalId,
    emailsFrom,
    printLayouts,
    textContent,
    setTextContent,
  } = props

  // const { getFieldDecorator } = form

  const [visiblePrintProposalModal, setVisiblePrintProposalModal] = useState(
    false,
  )

  const onEditorStateChange = editorState => {
    if (canBeUpdated) {
      setTextContent(editorState)
    }
  }

  const uploadProps = {
    accept: '.xls,.xlsx,.csv,.pdf,.jpg,.png,.gif,.bmp,.doc,.docx,.txt',
    onRemove(file) {
      const index = fileList.findIndex(x => x === file)
      if (index > -1) {
        fileList.splice(index, 1)
        setFileList([...fileList])
      }
    },
    beforeUpload(file, list) {
      let isBig = file.size / 1024 / 1024 > fileLimitSizeForUpload
      if (isBig) {
        message.error(`Arquivo deve ser menor que ${fileLimitSizeForUpload}MB!`)
        return false
      }
      const totalSize =
        fileList.reduce((sum, { size }) => sum + size, 0) + file.size

      isBig = totalSize / 1024 / 1024 > fileLimitSizeForUpload
      if (isBig) {
        message.error(
          `Tamanho total dos arquivos anexados deve ser menor que ${fileLimitSizeForUpload}MB!`,
        )
        return false
      }

      fileList.push(file)
      setFileList([...fileList])
      return false // upload será feito somente quando enviar o e-mail...
    },
    fileList,
  }

  useEffect(() => {
    form.resetFields(['from'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailsFrom])

  const handleCc = e => {
    if (!e.target.checked) {
      form.resetFields(['cc'])
    }
  }

  const handleCco = e => {
    if (!e.target.checked) {
      form.resetFields(['cco'])
    }
  }

  useEffect(() => {
    form.setFieldsValue({ to: defaultTo })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTo])

  const emailListValidate = (rule, value, callback) => {
    if (value) {
      const emails = value.split(';')
      let isOk = true
      emails.map(email => {
        if (!email.trim() || !isEmail(email.trim())) {
          isOk = false
        }
        return true
      })
      if (!isOk && emails.length === 1) {
        callback('E-mail inválido!')
      } else if (!isOk && emails.length > 1) {
        callback('E-mails inválidos!')
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  const handleSelectContact = (value, field) => {
    const currentValue = form.getFieldValue(field)
    if (currentValue && currentValue.indexOf(value) >= 0) {
      message.warning('Esse e-mail já foi informado!')
      return
    }
    const newValue = currentValue ? `${currentValue}; ${value}` : value
    form.setFieldsValue({ [field]: newValue })
  }

  function renderOption(r) {
    return (
      <Row style={{ width: '400px' }} type="flex">
        <Col className="truncate" style={{ width: '250px' }}>
          {r.email}
        </Col>
        <Col className="truncate" style={{ width: '150px' }}>
          {r.contactName ? r.contactName : 'Padrão'}
        </Col>
      </Row>
    )
  }

  function selectContacts(field) {
    return (
      <Select
        disabled={!canBeUpdated}
        optionLabelProp="label"
        style={{ width: 35 }}
        value={null}
        dropdownMatchSelectWidth={false}
        onChange={value => {
          handleSelectContact(value, field)
        }}
      >
        {contacts.find(x => x.type === 'Customer') && (
          <OptGroup label="Organização">
            {contacts
              .filter(x => x.type === 'Customer')
              .map(r => (
                <Option key={r.contactId} value={r.email} label={r.email}>
                  {renderOption(r)}
                </Option>
              ))}
          </OptGroup>
        )}

        {contacts.find(x => x.type === 'Seller') && (
          <OptGroup label="Vendedor">
            {contacts
              .filter(x => x.type === 'Seller')
              .map(r => (
                <Option key={r.contactId} value={r.email} label={r.email}>
                  {renderOption(r)}
                </Option>
              ))}
          </OptGroup>
        )}

        {contacts.find(x => x.type === 'Franchisee') && (
          <OptGroup label="Franquia">
            {contacts
              .filter(x => x.type === 'Franchisee')
              .map(r => (
                <Option key={r.contactId} value={r.email} label={r.email}>
                  {renderOption(r)}
                </Option>
              ))}
          </OptGroup>
        )}

        {contacts.find(x => x.type === 'Franchisor') && (
          <OptGroup label="Franqueador">
            {contacts
              .filter(x => x.type === 'Franchisor')
              .map(r => (
                <Option key={r.contactId} value={r.email} label={r.email}>
                  {renderOption(r)}
                </Option>
              ))}
          </OptGroup>
        )}

        {contacts.find(x => x.type === 'Standard') && (
          <OptGroup label="Empresa">
            {contacts
              .filter(x => x.type === 'Standard')
              .map(r => (
                <Option key={r.contactId} value={r.email} label={r.email}>
                  {renderOption(r)}
                </Option>
              ))}
          </OptGroup>
        )}
      </Select>
    )
  }

  const labelTo = (
    <React.Fragment>
      <Row type="flex">
        <Col>
          <span className="ml-1 mr-1" style={{ color: 'red' }}>
            *
          </span>
          Para:
        </Col>
      </Row>
    </React.Fragment>
  )
  const labelSubject = (
    <span>
      <span className="ml-1 mr-1" style={{ color: 'red' }}>
        *
      </span>
      Assunto:
    </span>
  )

  const placeholderAddress =
    "Digite ou selecione os e-mails. Faça a separação com ';'"

  return (
    <Form layout="vertical" form={form} hideRequiredMark>
      <MessageModelModal
        visibleMessageModelModal={visibleMessageModelModal}
        setVisibleMessageModelModal={setVisibleMessageModelModal}
        onSelectModel={onSelectModel}
        userPermissions={userPermissions}
      />

      <PrintProposalModal
        visiblePrintProposalModal={visiblePrintProposalModal}
        setVisiblePrintProposalModal={setVisiblePrintProposalModal}
        proposalId={proposalId}
        method={printLayouts.find(
          x =>
            x.printLayoutDocumentId ===
            form.getFieldValue('printLayoutDocumentId'),
        )}
      />
      <Row gutter={16}>
        <Col span={14}>
          <Form.Item
            name="from"
            initialValue={
              editData?.from
                ? editData?.from
                : emailsFrom?.length > 0
                ? emailsFrom[0].email
                : null
            }
            rules={[{ required: true, message: 'Campo obrigatório!' }]}
            label={
              <span>
                <span className="ml-1 mr-1" style={{ color: 'red' }}>
                  *
                </span>
                De:
              </span>
            }
            className="mb-0"
          >
            <Select optionLabelProp="label">
              {emailsFrom.map(d => (
                <Option value={d.email} label={d.email}>
                  <Row className="w-full">
                    <Col span={17}>{d.email}</Col>
                    <Col span={7}>
                      <small style={{ color: 'gray' }}>
                        <i>{d.name}</i>
                      </small>
                    </Col>
                  </Row>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {editData && (
        <Row gutter={16}>
          <Col span={14}>
            <Row justify="end" style={{ marginBottom: -50 }}>
              <Form.Item
                name="showCc"
                initialValue={!!(editData && editData?.cc)}
                valuePropName="checked"
              >
                <Checkbox disabled={!canBeUpdated} onChange={e => handleCc(e)}>
                  <span style={{ fontWeight: 'normal' }}>Cc</span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="showCco"
                valuePropName="checked"
                initialValue={!!(editData && editData?.cco)}
              >
                <Checkbox disabled={!canBeUpdated} onChange={e => handleCco(e)}>
                  <span style={{ fontWeight: 'normal' }}>Cco</span>
                </Checkbox>
              </Form.Item>
            </Row>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={14}>
          <Form.Item
            label={labelTo}
            className="mb-0"
            name="to"
            initialValue={editData ? editData.to : defaultTo}
            rules={[
              { required: true, message: 'Campo obrigatório!' },
              { validator: emailListValidate },
            ]}
          >
            <Input
              readOnly={!canBeUpdated}
              allowClear={canBeUpdated}
              placeholder={placeholderAddress}
              addonAfter={canBeUpdated ? selectContacts('to') : undefined}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={14}>
          <Form.Item
            label={labelSubject}
            name="subject"
            initialValue={editData?.subject}
            rules={[{ required: true, message: 'Campo obrigatório!' }]}
            className="mb-0"
          >
            <Input readOnly={!canBeUpdated} placeholder="Assunto do e-mail" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: -25 }}>
        <Col span={8}>
          <Form.Item
            valuePropName="checked"
            name="addProposalPrint"
            initialValue={false}
          >
            <Checkbox disabled={!canBeUpdated}>
              Incluir como anexo a impressão do negócio
            </Checkbox>
          </Form.Item>
        </Col>
        <Col>
          <i
            className="mt-3 fa fa-search ml-1 cursor-pointer"
            style={{ color: 'gray' }}
            role="button"
            onClick={() => setVisiblePrintProposalModal(true)}
          />
        </Col>
      </Row>

      <Row>
        <Col span={9}>
          <div
            style={{
              display: printLayouts.length === 1 ? 'none' : 'block',
              // width: '325px',
            }}
          >
            <Form.Item
              name="printLayoutDocumentId"
              initialValue={
                printLayouts.length > 0
                  ? printLayouts[0].printLayoutDocumentId
                  : null
              }
            >
              <Select size="small" className="mt-1 w-full">
                {printLayouts.map(d => (
                  <Option value={d.printLayoutDocumentId}>
                    {d.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col colspan={12}>
          <Button
            disabled={!canBeUpdated}
            onClick={() => setVisibleMessageModelModal(true)}
          >
            <i className="mr-3 fa fa-folder-open-o" style={{ color: 'gray' }} />
            Modelos
          </Button>
        </Col>
        <Col className="mb-2" colspan={12}>
          <Upload {...uploadProps}>
            <Button disabled={!canBeUpdated}>
              <Icon type="upload" /> Anexar arquivos
            </Button>
          </Upload>
        </Col>
      </Row>

      {editData && editData.attachments && editData.attachments.length > 0 && (
        <React.Fragment>
          <Card title="Anexos" size="small" className="mb-1">
            {editData.attachments.map(attachment => (
              <Row type="flex" className="mb-1">
                <i
                  className="fa fa-paperclip mr-2"
                  style={{ color: 'gray' }}
                  aria-hidden="true"
                />
                <span
                  role="button"
                  className="primary-color cursor-pointer mr-2"
                  onClick={() =>
                    downloadAttachment(
                      attachment.emailAttachmentSentId,
                      attachment.fileName,
                    )
                  }
                >
                  {attachment.fileName}
                </span>
              </Row>
            ))}
          </Card>
        </React.Fragment>
      )}
      {editData && (
        <h4>{`Email enviado por ${editData.emailSetUserName} em ${moment(
          editData.emailSentDateTime,
        ).format('DD/MM/YYYY HH:mm')}`}</h4>
      )}

      <TextEditor
        textContent={textContent}
        onEditorStateChange={onEditorStateChange}
      />
    </Form>
  )
}

EmailForm.propTypes = {
  form: PropTypes.object,
  contacts: PropTypes.array,
  visibleMessageModelModal: PropTypes.array,
  setVisibleMessageModelModal: PropTypes.func,
  onSelectModel: PropTypes.func,
  userPermissions: PropTypes.array,
  fileList: PropTypes.array,
  setFileList: PropTypes.func,
  editData: PropTypes.func,
  defaultTo: PropTypes.string,
  downloadAttachment: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  proposalId: PropTypes.number,
  emailsFrom: PropTypes.array,
  printLayouts: PropTypes.array,
}
