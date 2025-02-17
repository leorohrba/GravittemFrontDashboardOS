/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/jsx-boolean-value */
import React, { useState, useEffect } from 'react'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError, showNotifications, getLocaleDateFormat } from '@utils'
import { Form, Checkbox, Modal, Spin, DatePicker, Row } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import { getService, updatePriceProposalItems } from '../../service'

function ProposalClone({
  visible,
  toogleModalVisible,
  proposalId,
  number,
  onChange,
  createMessage,
  createHistory,
  onChangeTotal,
}) {
  const [ItemsByProposalId, setItemsByProposalId] = useState([])
  const [isSaving, setIsSaving] = useState(false)
  const [key, setKey] = useState(0)
  const [form] = Form.useForm()

  const handleSubmit = e => {
    e && e.preventDefault()
    cloneProposal()
  }

  function disabledDate(current) {
    return current && current < moment().startOf('day')
  }

  async function cloneProposal() {
    const proposalBody = {
      proposalId,
      receiptMethod: form.getFieldValue('receiptMethod'),
      installationTime: form.getFieldValue('installationTime'),
      attachments: form.getFieldValue('attachments'),
      productAndServices: form.getFieldValue('productAndServices'),
      tasks: form.getFieldValue('tasks'),
      taskDate:
        form.getFieldValue('tasks') && form.getFieldValue('taskDate')
          ? form.getFieldValue('taskDate').format('YYYY-MM-DD')
          : null,
    }
    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/cloneProposal`,
        data: proposalBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (!data.isOk) {
        if (data.validationMessageList.length > 0) {
          showNotifications(data.validationMessageList)
        } else {
          showNotifications([data.message])
        }
      } else {
        const idGenerated = parseInt(data.idGenerated, 10)
        await onChange(idGenerated)
        await handleUpdatePrice(idGenerated)
        await toogleModalVisible()
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  const handleUpdatePrice = async idGenerated => {
    await createMessage(
      'Favor revisar valores da proposta, ocorreu atualização da lista de preço',
      'warning',
    )
    await getService(
      `api/crm/ItemsByProposalId?proposalId=${idGenerated}`,
      setItemsByProposalId,
    )
  }

  useEffect(() => {
    if (ItemsByProposalId && ItemsByProposalId?.proposalItem) {
      const proposalItem = ItemsByProposalId?.proposalItem.map(
        item => item.proposalItemId,
      )

      updatePriceProposalItems(
        proposalId,
        proposalItem,
        null,
        null,
        createHistory,
        onChangeTotal,
      )
    }
  }, [ItemsByProposalId])

  useEffect(() => {
    setKey(key + 1)
  }, [])

  return (
    <Modal
      visible={visible}
      title={`Clonar negócio ${number}`}
      centered
      destroyOnClose
      onCancel={toogleModalVisible}
      onOk={handleSubmit}
      width="550px"
      footer={
        <Row type="flex">
          <Button
            className="formButton"
            htmlType="submit"
            onClick={handleSubmit}
            loading={isSaving}
          >
            Clonar
          </Button>
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
      <Spin size="large" spinning={isSaving}>
        <h3>Selecione os itens que deseja copiar:</h3>
        <Form onSubmit={handleSubmit} form={form} layout="vertical">
          <Form.Item
            name="receiptMethod"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox checked>Forma de pagamento</Checkbox>
          </Form.Item>
          <Form.Item
            name="installationTime"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox checked>Prazo de instalação</Checkbox>
          </Form.Item>
          <Form.Item
            name="attachments"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox checked>Anexos</Checkbox>
          </Form.Item>
          <Form.Item
            name="productAndServices"
            valuePropName="checked"
            initialValue={true}
          >
            <Checkbox checked>Produtos e serviços</Checkbox>
          </Form.Item>
          <Form.Item name="tasks" valuePropName="checked" initialValue={true}>
            <Checkbox checked onChange={() => setKey(key + 1)}>
              Tarefas
            </Checkbox>
          </Form.Item>
          <div
            style={{ display: form.getFieldValue('tasks') ? 'block' : 'none' }}
          >
            <Form.Item
              label="Data de agendamento"
              name="taskDate"
              initialValue={moment()}
            >
              <DatePicker
                format={getLocaleDateFormat()}
                disabledDate={disabledDate}
              />
            </Form.Item>
          </div>
          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </Spin>
    </Modal>
  )
}

ProposalClone.propTypes = {
  proposalId: PropTypes.number,
  toogleModalVisible: PropTypes.func,
  visible: PropTypes.bool,
  onChange: PropTypes.func,
  number: PropTypes.number,
}

// const WrappedAProposalClone = Form.create({
//   name: 'proposalCloneForm',
// })(ProposalClone)

export default ProposalClone
