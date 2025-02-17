/**
 * breadcrumb: Formulário do cadastro de contatos da pessoa
 */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
import { removeMask, validateByMask } from '@utils'
import {
  Form,
  Alert,
  Button,
  Col,
  Input,
  message,
  Modal,
  Radio,
  Row,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import InputMask from 'react-input-mask'

function PersonContactFormImplement(props) {
  const { personContact, canBeUpdated, isSaving, show } = props
  const [alertMessages, setAlertMessages] = useState([])

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()

    setAlertMessages([])

    if (!canBeUpdated) {
      message.error('Você não pode atualizar o contato!')
      return
    }

    form.validateFields().then(() => {
      handleFields()

      if (validateFieldsAndScroll()) {
        savePersonContact()
      }
    })
  }

  function handleFields() {
    if (
      personContact &&
      personContact.phoneId > 0 &&
      !form.getFieldValue('phone')
    ) {
      form.setFieldsValue({ phone: '' })
    }

    if (
      personContact &&
      personContact.cellPhoneId > 0 &&
      !form.getFieldValue('cellPhone')
    ) {
      form.setFieldsValue({ cellPhone: '' })
    }

    if (
      personContact &&
      personContact.emailId > 0 &&
      !form.getFieldValue('email')
    ) {
      form.setFieldsValue({ email: '' })
    }
  }

  function validateFieldsAndScroll() {
    let isValid = true

    if (
      !form.getFieldValue('email') &&
      !form.getFieldValue('phone') &&
      !form.getFieldValue('cellPhone')
    ) {
      setAlertMessages([
        'Você deve informar ao menos, o telefone, celular ou e-mail!',
      ])
      isValid = false
    }

    return isValid
  }

  function handleCancel() {
    props.closePersonContactForm()
  }

  useEffect(() => {
    if (props.show) {
      setAlertMessages([])
      form.resetFields()
      if (personContact !== null) {
        form.setFieldsValue({
          contactName: personContact.contactName,
          isActive: personContact.isActive,
          role: personContact.role,
          email: personContact.email,
          documentCPF: removeMask(personContact.documentCPF),
          phone: personContact.phone ? removeMask(personContact.phone) : '',
          cellPhone: personContact.cellPhone
            ? removeMask(personContact.cellPhone)
            : '',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function savePersonContact() {
    const contact = {
      contactName: form.getFieldValue('contactName'),
      isActive: form.getFieldValue('isActive'),
      role: form.getFieldValue('role'),
      emailId: personContact === null ? 0 : personContact.emailId,
      email: form.getFieldValue('email'),
      phoneId: personContact === null ? 0 : personContact.phoneId,
      phone: form.getFieldValue('phone'),
      cellPhoneId: personContact === null ? 0 : personContact.cellPhoneId,
      cellPhone: form.getFieldValue('cellPhone'),
      key: personContact === null ? -1 : personContact.key,
      documentCPF: removeMask(form.getFieldValue('documentCPF')),
    }

    props.savePersonContactForm(contact)
  }

  const phoneValidate = (rule, value, callback) => {
    if (!validateByMask(value)) {
      callback('Telefone incompleto!')
    } else {
      callback()
    }
  }

  const cellPhoneValidate = (rule, value, callback) => {
    if (!validateByMask(value)) {
      callback('Celular incompleto!')
    } else {
      callback()
    }
  }

  const documentCPFValidate = (rule, value, callback) => {
    if (removeMask(value) && !validateByMask(value)) {
      callback('CPF incompleto!')
    } else {
      callback()
    }
  }

  return (
    <Modal
      visible={show}
      title={
        personContact === null
          ? 'Novo contato'
          : canBeUpdated
          ? 'Alterar contato'
          : 'Consultar contato'
      }
      onOk={handleSubmit}
      onCancel={handleCancel}
      centered
      width="600"
      footer={[
        <React.Fragment>
          {canBeUpdated && (
            <Button
              type="primary"
              onClick={handleSubmit}
              htmlFor="submit-form"
              className="formButton"
              loading={isSaving}
            >
              {personContact === null ? 'Adicionar' : 'Confirmar'}
            </Button>
          )}

          <Button onClick={handleCancel}>
            {canBeUpdated ? 'Cancelar' : 'Retornar'}
          </Button>
        </React.Fragment>,
      ]}
    >
      <Form layout="vertical" form={form} onSubmit={handleSubmit}>
        {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
        ))}

        <Row type="flex" gutter={20}>
          <Col>
            <Form.Item
              label="Status"
              name="isActive"
              rules={[
                { required: true, message: 'Informe o status do contato!' },
              ]}
              initialValue
            >
              <Radio.Group buttonStyle="solid" disabled={!canBeUpdated}>
                <Radio.Button style={{ fontWeight: 'normal' }} value>
                  Ativo
                </Radio.Button>
                <Radio.Button style={{ fontWeight: 'normal' }} value={false}>
                  Inativo
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col style={{ width: '400px' }}>
            <Form.Item
              label="Nome"
              name="contactName"
              initialValue={null}
              rules={[
                { required: true, message: 'Informe o nome de contato!' },
              ]}
            >
              <Input
                placeholder="Digite o nome de contato"
                disabled={!canBeUpdated}
                autoFocus
              />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={20}>
          <Col style={{ width: '48%' }}>
            <Form.Item label="Cargo" name="role" initialValue={null}>
              <Input placeholder="Digite o cargo" disabled={!canBeUpdated} />
            </Form.Item>
          </Col>
          <Col style={{ width: '48%' }}>
            <Form.Item
              label="CPF"
              name="documentCPF"
              initialValue=""
              rules={[
                {
                  validator: documentCPFValidate,
                },
              ]}
            >
              <InputMask
                mask="999.999.999-99"
                maskChar="_"
                disabled={!canBeUpdated}
                className="ant-input"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={20}>
          <Col style={{ width: '96%' }}>
            <Form.Item
              label="E-mail"
              name="email"
              initialValue={null}
              rules={[{ type: 'email', message: 'E-mail inválido!' }]}
            >
              <Input placeholder="Digite o email" disabled={!canBeUpdated} />
            </Form.Item>
          </Col>
        </Row>

        <Row type="flex" gutter={20}>
          <Col style={{ width: '48%' }}>
            <Form.Item
              label="Telefone"
              name="phone"
              initialValue=""
              rules={[
                {
                  validator: phoneValidate,
                },
              ]}
            >
              <InputMask
                mask="(99) 9999-9999"
                maskChar="_"
                className="ant-input"
                disabled={!canBeUpdated}
              />
            </Form.Item>
          </Col>

          <Col style={{ width: '48%' }}>
            <Form.Item
              label="Celular"
              name="cellPhone"
              initialValue=""
              rules={[{ validator: cellPhoneValidate }]}
            >
              <InputMask
                mask="(99) 99999-9999"
                maskChar="_"
                className="ant-input"
                disabled={!canBeUpdated}
              />
            </Form.Item>
          </Col>
        </Row>

        <input type="submit" id="submit-form" className="hidden" />
      </Form>
    </Modal>
  )
}

PersonContactFormImplement.propTypes = {
  canBeUpdated: PropTypes.func,
  closePersonContactForm: PropTypes.func,
  isSaving: PropTypes.bool,
  personContact: PropTypes.any,
  savePersonContactForm: PropTypes.func,
  show: PropTypes.bool,
}

export default PersonContactFormImplement
