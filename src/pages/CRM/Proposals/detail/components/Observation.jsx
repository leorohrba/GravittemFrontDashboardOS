import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission } from '@utils'
import { Form } from '@ant-design/compatible'
import { Input, message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { TextArea } = Input

function Observation({
  visible,
  toogleModalVisible,
  proposalId,
  userPermissions,
  onChange,
}) {
  const [observation, setObservation] = useState(null)
  const [observation1, setObservation1] = useState(null)
  const [observation2, setObservation2] = useState(null)
  const [observation3, setObservation3] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const observationInput = useRef(null)

  useEffect(() => {
    if (visible) {
      setObservation(null)
      setCanBeUpdated(false)
      getProposal()
      if (observationInput.current) {
        observationInput.current.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleSubmit = e => {
    e.preventDefault()
    updateProposalObservation()
  }

  async function getProposal() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/proposal`,
        params: { proposalId },
      })

      const { data } = response
      setLoading(false)

      if (data.isOk) {
        if (data.proposal.length === 0) {
          message.error('Negócio não existe ou não há permissão de acesso!')
          toogleModalVisible()
        } else {
          const proposal = data.proposal[0]

          setObservation(proposal.observation)
          setObservation1(proposal.observation1)
          setObservation2(proposal.observation2)
          setObservation3(proposal.observation3)
          setCanBeUpdated(
            proposal.actStatusCode === 'ABRT' &&
              proposal.canBeUpdated &&
              hasPermission(userPermissions, 'Alter'),
          )
        }
      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  async function updateProposalObservation() {
    const proposalBody = {
      proposalId,
      observation,
      observation1,
      observation2,
      observation3,
    }

    setIsSaving(true)
    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/proposalUpdateObservation`,
        data: proposalBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (!data.isOk) {
        let messageError
        if (data.validationMessageList.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          messageError = data.validationMessageList[0]
        } else {
          messageError = data.message
        }
        message.error(
          <span>
            {messageError}
            <br />
            Atualização não realizada
          </span>,
        )
      } else {
        onChange()
        toogleModalVisible()
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <Modal
      visible={visible}
      title="Observação de impressão"
      onCancel={toogleModalVisible}
      onOk={handleSubmit}
      centered
      width="650px"
      footer={
        <Row type="flex">
          {canBeUpdated && !loading && (
            <Button
              className="formButton"
              htmlType="submit"
              onClick={handleSubmit}
              loading={isSaving}
            >
              Salvar
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
      <Spin size="large" spinning={loading}>
        <Skeleton loading={loading} paragraph={{ rows: 8 }} active>
          <Form layout="vertical" onSubmit={handleSubmit}>
            <Form.Item label="Observação">
              <TextArea
                rows={6}
                data-testid="observation-field"
                autoFocus
                value={observation}
                onChange={e => setObservation(e.target.value)}
                ref={observationInput}
              />
            </Form.Item>

            <Form.Item label="Observação (1)">
              <TextArea
                rows={6}
                data-testid="observation-field-1"
                value={observation1}
                onChange={e => setObservation1(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Observação (2)">
              <TextArea
                rows={6}
                data-testid="observation-field-2"
                value={observation2}
                onChange={e => setObservation2(e.target.value)}
              />
            </Form.Item>

            <Form.Item label="Observação (3)">
              <TextArea
                rows={6}
                data-testid="observation-field-3"
                value={observation3}
                onChange={e => setObservation3(e.target.value)}
              />
            </Form.Item>

            <input type="submit" id="submit-form" className="hidden" />
          </Form>
        </Skeleton>
      </Spin>
    </Modal>
  )
}

Observation.propTypes = {
  proposalId: PropTypes.number,
  toogleModalVisible: PropTypes.func,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  onChange: PropTypes.func,
}

export default Observation
