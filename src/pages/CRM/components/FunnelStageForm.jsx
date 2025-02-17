/**
 * breadcrumb: Formulário do Cadastro de Etapas do Funil
 */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useRef, useState } from 'react'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, Button, Input, Modal, Radio, message } from 'antd'
import PropTypes from 'prop-types'

function FunnelStageFormImplement(props) {
  const icons = [
    'fa-clock-o',
    'fa-paper-plane',
    'fa-flag',
    'fa-phone',
    'fa-cutlery',
    'fa-calendar',
    'fa-mobile',
    'fa-camera',
    'fa-comments',
    'fa-address-book',
    'fa-image',
    'fa-lock',
    'fa-tag',
    'fa-briefcase',
    'fa-trophy',
    'fa-shopping-cart',
    'fa-bell',
    'fa-video-camera',
    'fa-user',
    'fa-thumbs-o-up',
  ]

  const funnelStageNameInput = useRef(null)
  const [loadingForm, setLoadingForm] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [funnelStageOrder, setFunnelStageOrder] = useState(0)
  const { salesFunnelId, funnelStageId, key, show } = props

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()
    form
      .validateFields()
      .then(values => saveFunnelStage())
      .catch(() => message.warning('Há campos à serem preenchidos.'))
  }

  function handleCancel() {
    props.closeFunnelStageForm(false)
  }

  useEffect(() => {
    if (show) {
      setFunnelStageOrder(0)
      form.setFieldsValue({ funnelStageName: '', funnelStageIcon: '' })

      if (funnelStageId > 0) {
        getFunnelStage(funnelStageId)
      } else {
        setLoadingForm(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, funnelStageId])

  async function getFunnelStage(funnelStageId) {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/funnelstage`,
        params: { salesFunnelId, funnelStageId },
      })
      setLoadingForm(false)
      const { data } = response

      if (data.isOk) {
        if (data.funnelStage.length === 0) {
          message.error(
            'Etapa do funil não existe ou você não tem acesso a ela!',
          )
          handleCancel()
        } else {
          setFunnelStageOrder(data.funnelStage[0].order)
          form.setFieldsValue({
            funnelStageName: data.funnelStage[0].name,
            funnelStageIcon: data.funnelStage[0].icon,
          })
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

  async function saveFunnelStage() {
    setIsSaving(true)

    const funnelStageBody = {
      funnelStage: [
        {
          salesFunnelId,
          funnelStageId,
          name: form.getFieldValue('funnelStageName'),
          icon: form.getFieldValue('funnelStageIcon'),
          order: funnelStageOrder,
        },
      ],
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/funnelstage`,
        data: funnelStageBody,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        props.closeFunnelStageForm(true)
      } else {
        if (funnelStageNameInput.current != null) {
          funnelStageNameInput.current.focus()
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  const setFocusFunnelStageName = e => {
    e.preventDefault()
    if (funnelStageNameInput.current != null) {
      funnelStageNameInput.current.focus()
    }
  }

  // const { getFieldDecorator } = form

  return (
    <Modal
      width="570px"
      visible={show && !loadingForm}
      title={funnelStageId === 0 ? 'Adicionar etapa' : 'Alterar etapa'}
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
          {funnelStageId === 0 ? 'Adicionar' : 'Salvar'}
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onSubmit={handleSubmit}>
        <Form.Item
          name="funnelStageIcon"
          rules={[
            {
              required: true,
              message: 'Escolha um ícone para a etapa do funil!',
            },
          ]}
        >
          <Radio.Group buttonStyle="outline" onChange={setFocusFunnelStageName}>
            {icons.map((icon, index) => (
              <Radio.Button
                style={{ width: '51px', borderRadius: '0px' }}
                key={index}
                value={icon}
              >
                <i className={`fa ${icon} fa-fw ${styles.crmColorIconForm}`} />
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Nome da etapa"
          name="funnelStageName"
          rules={[
            {
              required: true,
              message: 'A descrição da etapa é obrigatória!',
            },
          ]}
        >
          <Input
            placeholder="Digite o nome da etapa"
            key={key}
            autoFocus
            ref={funnelStageNameInput}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

FunnelStageFormImplement.propTypes = {
  closeFunnelStageForm: PropTypes.func,
  funnelStageId: PropTypes.number,
  key: PropTypes.number,
  salesFunnelId: PropTypes.number,
  show: PropTypes.bool,
}

export default FunnelStageFormImplement
