/**
 * breadcrumb: Formulário do cadastro de funil
 */
/* eslint-disable react/jsx-no-bind */
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, Button, Input, Modal, Radio, Spin, message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

function SalesFunnelFormImplement(props) {
  const salesFunnelTitleInput = useRef(null)
  const [loadingForm, setLoadingForm] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editData, setEditData] = useState(null)

  const {
    // form,
    salesFunnelId,
    show,
    key,
    closeSalesFunnelForm,
    ownerProfile,
  } = props

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields().then(values => saveSalesFunnel())
  }

  function handleCancel() {
    closeSalesFunnelForm(false)
  }

  useEffect(() => {
    form.resetFields()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  useEffect(() => {
    if (show) {
      if (editData == null) {
        form.resetFields()
      } else {
        setEditData(null)
      }
      if (salesFunnelId > 0) {
        getSalesFunnel()
      } else {
        setLoadingForm(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  async function getSalesFunnel() {
    setLoadingForm(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesFunnel`,
        params: { salesFunnelId },
      })
      setLoadingForm(false)
      const { data } = response

      if (data.isOk) {
        if (data.salesFunnel.length === 0) {
          message.error('Funil de vendas não encontrado ou acesso proibido!')
          closeSalesFunnelForm(false)
        } else {
          setEditData(data.salesFunnel[0])
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

  async function saveSalesFunnel() {
    setIsSaving(true)

    const salesFunnelBody = {
      salesFunnel: {
        salesFunnelId,
        title: form.getFieldValue('salesFunnelTitle'),
        type: form.getFieldValue('salesFunnelType'),
      },
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/salesfunnel`,
        data: salesFunnelBody,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        closeSalesFunnelForm(true)
      } else {
        if (salesFunnelTitleInput.current != null) {
          salesFunnelTitleInput.current.focus()
        }

        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <Modal
      visible={show}
      title={salesFunnelId === 0 ? 'Adicionar novo funil' : 'Alterar funil'}
      onOk={handleSubmit}
      onCancel={handleCancel}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={isSaving}
          disabled={loadingForm}
          onClick={handleSubmit}
          className="formButton"
        >
          {salesFunnelId === 0 ? 'Adicionar' : 'Salvar'}
        </Button>,
        <Button key="back" onClick={handleCancel}>
          Cancelar
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} onSubmit={handleSubmit}>
        <Spin size="large" spinning={loadingForm}>
          <Form.Item
            label="Título do funil"
            name="salesFunnelTitle"
            initialValue={editData?.title}
            rules={[
              {
                required: true,
                message: 'Por favor, informe o título do funil.',
              },
            ]}
          >
            <Input
              placeholder="Digite o título do funil"
              key={key}
              autoFocus
              ref={salesFunnelTitleInput}
            />
          </Form.Item>
          <div
            style={{ display: ownerProfile === 'Standard' ? 'none' : 'block' }}
          >
            <Form.Item
              label="Tipo do funil"
              name="salesFunnelType"
              initialValue={
                editData
                  ? editData.type
                  : ownerProfile === 'Standard'
                  ? 3
                  : null
              }
              rules={[
                {
                  required: true,
                  message: 'Informe o tipo de funil',
                },
              ]}
            >
              <Radio.Group>
                <Radio style={radioStyle} value={1}>
                  Franqueador
                </Radio>
                <Radio style={radioStyle} value={2}>
                  Franqueado
                </Radio>
                <Radio style={radioStyle} value={3}>
                  Ambos
                </Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </Spin>
      </Form>
    </Modal>
  )
}

SalesFunnelFormImplement.propTypes = {
  closeSalesFunnelForm: PropTypes.func,
  key: PropTypes.number,
  salesFunnelId: PropTypes.number,
  show: PropTypes.bool,
  ownerProfile: PropTypes.string,
}

// const SalesFunnelForm = Form.create()(SalesFunnelFormImplement)

export default SalesFunnelFormImplement
