import React, { useState, useEffect } from 'react'
import {
  downloadAttachment,
  getPhone,
  getWhatsappAccount,
} from './whatsappService'
import {
  Form,
  Button,
  Input,
  Row,
  Col,
  Upload,
  Icon,
  Checkbox,
  Select,
  Card,
} from 'antd'
import PropTypes from 'prop-types'
import { formatCellPhone, handleAuthError, isPhoneNumber } from '@utils'
import MessageModelModal from '../../../../MessageModel/modals/MessageModelModal'
import PrintProposalModal from '../../../print/modals/PrintProposalModal'

import moment from 'moment'

const { Option } = Select
const fileLimitSizeForUpload = 28 // (em MB)

export default function WhatsAppForm(props) {
  const {
    form,
    onSelectModel,
    visibleMessageModelModal,
    setVisibleMessageModelModal,
    userPermissions,
    fileList,
    setFileList,
    editData,
    defaultTo,
    canBeUpdated,
    proposalId,
    allContacts,
    printLayouts,
    userContact,
  } = props

  // const { getFieldDecorator } = form

  const [visiblePrintProposalModal, setVisiblePrintProposalModal] = useState(
    false,
  )
  const [phoneNumber, setPhoneNumber] = useState()

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
        handleAuthError(
          `Arquivo deve ser menor que ${fileLimitSizeForUpload}MB!`,
        )
        return false
      }
      const totalSize =
        fileList.reduce((sum, { size }) => sum + size, 0) + file.size

      isBig = totalSize / 1024 / 1024 > fileLimitSizeForUpload
      if (isBig) {
        handleAuthError(
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

  const getLoggedNumber = async () => {
    try {
      const response = await getWhatsappAccount()
      const phoneNumber = await getPhone(response.nomeSessao, response.token)
      if (phoneNumber) {
        setPhoneNumber(
          formatCellPhone(phoneNumber.replace('55', '').replace('@c.us', '')),
        )
      }
      form.resetFields(['to'])
    } catch (error) {
      handleAuthError(error)
    }
  }
  useEffect(() => {
    getLoggedNumber()
  }, [])

  useEffect(() => {
    form.resetFields(['to'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allContacts])

  useEffect(() => {
    form.resetFields(['from'])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContact])

  useEffect(() => {
    form.setFieldsValue({ to: defaultTo })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTo])

  const phoneListValidate = (rule, value, callback) => {
    if (value) {
      const phones = value.split(';')
      let isOk = true
      phones.map(phone => {
        if (!phone.trim() || !isPhoneNumber(phone.trim())) {
          isOk = false
        }
        return true
      })
      if (!isOk && phones.length === 1) {
        callback('Número de telefone inválido!')
      } else if (!isOk && phones.length > 1) {
        callback('Números de telefone inválidos!')
      } else {
        callback()
      }
    } else {
      callback()
    }
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
          <span
            style={{
              marginLeft: '0.875rem',
            }}
            className="font-bold mr-1"
          >
            De:
          </span>
          <span>
            {formatCellPhone(phoneNumber) ?? 'Nenhum WhatsApp conectado.'}
          </span>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={14}>
          <Form.Item
            label={labelTo}
            className="mb-0"
            name="to"
            initialValue={editData ? editData.to : defaultTo}
            rules={[
              { required: true, message: 'Campo obrigatório!' },
              { validator: phoneListValidate },
            ]}
          >
            <Select optionLabelProp="label">
              {allContacts
                .filter(d => d.cellPhone)
                .map(d => (
                  <Option
                    value={d.cellPhone}
                    label={formatCellPhone(d.cellPhone)}
                  >
                    <Row className="w-full">
                      <Col span={17}>{formatCellPhone(d.cellPhone)}</Col>
                      <Col span={7}>
                        <small style={{ color: 'gray' }}>
                          <i>{d.contactName}</i>
                        </small>
                      </Col>
                    </Row>
                  </Option>
                ))}
            </Select>
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
                  onClick={() => downloadAttachment(attachment)}
                >
                  {attachment.fileName}
                </span>
              </Row>
            ))}
          </Card>
        </React.Fragment>
      )}
      {editData && (
        <h4>{`Mensagem enviada por ${editData.emailSetUserName} em ${moment(
          editData.emailSentDateTime,
        ).format('DD/MM/YYYY HH:mm')}`}</h4>
      )}
      <Form.Item name="message" label="Mensagem" initialValue={editData?.body}>
        <Input placeholder="Digite a mensagem que irá junto com o arquivo" />
      </Form.Item>
    </Form>
  )
}

WhatsAppForm.propTypes = {
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
