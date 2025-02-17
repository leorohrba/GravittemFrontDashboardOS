/**
 * breadcrumb: Formulário do Cadastro de Motivos de Perda
 */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
// import { Form } from '@ant-design/compatible'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, Button, Input, Modal, message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

function LossReasonFormImplement(props) {
  const lossReasonNameInput = useRef(null)
  const [loadingForm, setLoadingForm] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { show, lossReasonId, key } = props

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()
    setIsSaving(true)
    form
      .validateFields()
      .then(async values => {
        const body = {
          lossReason: {
            lossReasonId: props.lossReasonId,
            name: values.name,
          },
        }
        try {
          const response = await apiCRM({
            method: 'POST',
            url: `/api/crm/lossreason`,
            data: body,
            headers: { 'Content-Type': 'application/json' },
          })
          setIsSaving(false)

          const { data } = response

          if (data.isOk) {
            props.closeLossReasonForm(true)
          } else {
            if (lossReasonNameInput.current != null) {
              lossReasonNameInput.current.focus()
            }

            message.error(data.message)
          }
        } catch (error) {
          setIsSaving(false)
          handleAuthError(error)
        }

        setIsSaving(false)
      })
      .catch(err => handleAuthError(err))
  }

  function handleCancel() {
    props.closeLossReasonForm(false)
  }

  useEffect(() => {
    if (show) {
      form.setFieldsValue({ name: '' })

      if (props.lossReasonId > 0) {
        getLossReason(props.lossReasonId)
      } else {
        setLoadingForm(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, lossReasonId])

  async function getLossReason(lossReasonId) {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/lossreason`,
        params: { lossReasonId },
      })
      setLoadingForm(false)
      const { data } = response

      if (data.isOk) {
        if (data.lossReason.length === 0) {
          message.error(
            'Motivo de perda não existe ou você não tem acesso a ela!',
          )
          handleCancel()
        } else {
          form.setFieldsValue({ name: data.lossReason[0].name })
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

  return (
    <Modal
      visible={show && !loadingForm}
      title={
        lossReasonId === 0 ? 'Novo motivo de perda' : 'Alterar motivo de perda'
      }
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={isSaving}
          onClick={handleSubmit}
          className="formButton"
        >
          {lossReasonId === 0 ? 'Adicionar' : 'Salvar'}
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onSubmit={handleSubmit}>
        <Form.Item
          label="Motivo da Perda"
          name="name"
          rules={[
            {
              required: true,
              message: 'A descrição do motivo da perda é obrigatória!',
            },
          ]}
        >
          <Input
            placeholder="Digite o motivo da perda"
            key={key}
            autoFocus
            ref={lossReasonNameInput}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

LossReasonFormImplement.propTypes = {
  closeLossReasonForm: PropTypes.func,
  key: PropTypes.number,
  lossReasonId: PropTypes.number,
  show: PropTypes.bool,
}

export default LossReasonFormImplement
