/* eslint-disable react/jsx-no-bind */
// import { Form } from '@ant-design/compatible'
import styles from '@pages/CRM/styles.css'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import {
  Form,
  Alert,
  Button,
  Col,
  message,
  Modal,
  Row,
  Select,
  Spin,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import EditProposalBatchInputSeller from './EditProposalBatchInputSeller'
import { useProposalContext } from '../../Context/proposalContext'

const { Option } = Select

const renderFunnelStage = (name, icon) => (
  <div>
    <i className={`mr-1 fa ${icon} fa-fw ${styles.crmColorIconGrid}`} />
    <span>{name}</span>
  </div>
)

function EditProposalBatchImplement(props) {
  const {selectedRowKeys} = useProposalContext()
  const { show, closeEditProposalBatch } = props

  const [alertMessages, setAlertMessages] = useState([])
  const [funnelStages, setFunnelStages] = useState([])
  const [salesFunnels, setSalesFunnels] = useState([])
  const [salesFunnelId, setSalesFunnelId] = useState(null)
  const [loadingSalesFunnel, setLoadingSalesFunnel] = useState([])
  const [keyInputSeller, setKeyInputSeller] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const changeSellerInput = useRef(null)

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e.preventDefault()

    setAlertMessages([])

    if (selectedRowKeys.length === 0) {
      setAlertMessages(['Não há negócios selecionados para atualizar'])
      return
    }

    if (
      form.getFieldValue('changeSeller') === 1 &&
      form.getFieldValue('changeFunnelStage') === 1
    ) {
      setAlertMessages(['Não há valores para alterar!'])
      return
    }

    form.validateFields().then(() => {
      saveProposals()
    })
  }

  useEffect(() => {
    getSalesFunnels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCancel() {
    closeEditProposalBatch(false)
  }

  useEffect(() => {
    if (show) {
      clearForm()
      if (changeSellerInput.current) {
        changeSellerInput.current.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function clearForm() {
    form.resetFields()
    setKeyInputSeller(keyInputSeller + 1)
    setAlertMessages([])
  }

  async function saveProposals() {
    const sellerId =
      form.getFieldValue('changeSeller') === 2
        ? form.getFieldValue('sellerId')
        : null

    const funnelStageId =
      form.getFieldValue('changeFunnelStage') === 2
        ? form.getFieldValue('funnelStage')
        : null

    const proposalBody = {
      batchProposal: {
        proposalId: selectedRowKeys,
        sellerId,
        funnelStageId,
      },
    }

    setIsSaving(true)

    try {
      const response = await apiCRM({
        method: 'PUT',
        url: `/api/crm/batchProposal`,
        data: proposalBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        closeEditProposalBatch(true)
      } else {
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
        }
        message.error(data.message)
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  const funnelStageValidate = (rule, value, callback) => {
    if (
      (!value || value.length === 0) &&
      form.getFieldValue('changeFunnelStage') === 2
    ) {
      callback('Informe a fase!')
    } else {
      callback()
    }
  }

  const clearAlerts = () => {
    setAlertMessages([])
  }

  async function getSalesFunnels() {
    setLoadingSalesFunnel(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/salesFunnel`,
        params: { useFilterType: true },
      })

      setLoadingSalesFunnel(false)

      const { data } = response

      if (data.isOk) {
        if (data.salesFunnel.length === 0) {
          message.error('Não existe funil cadastrado!')
        } else {
          setSalesFunnels(data.salesFunnel)
        }
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  useEffect(() => {
    const salesFunnel = salesFunnels.find(
      x => x.salesFunnelId === salesFunnelId,
    )
    if (salesFunnel) {
      setFunnelStages(salesFunnel.funnelStage)
    } else {
      setFunnelStages([])
    }
  }, [salesFunnels, salesFunnelId])

  const onChangeSalesFunnel = value => {
    setSalesFunnelId(value)
    form.setFieldsValue({ funnelStage: null })
  }

  return (
    <Modal
      visible={show}
      title={`Editar em lote (${selectedRowKeys.length})`}
      width="400px"
      onOk={e => handleSubmit(e)}
      onCancel={handleCancel}
      centered
      footer={[
        <React.Fragment>
          <Button
            type="primary"
            className="formButton"
            loading={isSaving}
            onClick={e => handleSubmit(e)}
            htmlFor="submit-form"
          >
            Atualizar
          </Button>
          <Button onClick={handleCancel}>Cancelar</Button>
        </React.Fragment>,
      ]}
    >
      <div>
        <Form form={form} layout="vertical" onSubmit={e => handleSubmit(e, false)}>
          {alertMessages.map((message, index) => (
            <Alert
              type="error"
              message={message}
              key={index}
              showIcon
              className="mb-2"
            />
          ))}

          <Row
            style={{
              marginBottom:
                form.getFieldValue('changeSeller') === 1 ? '20px' : '0px',
            }}
          >
            <Col span="24" className="mb-2">
              <Form.Item label="Vendedor:" name="changeSeller" initialValue={1}>
                <Select
                  onChange={clearAlerts}
                  autoFocus
                  ref={changeSellerInput}
                >
                  <Option value={1}>Manter valor existente</Option>
                  <Option value={2}>Substituir valor existente com...</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row
            style={{
              display:
                form.getFieldValue('changeSeller') === 2 ? 'block' : 'none',
            }}
          >
            <Col className="mb-2">
              <EditProposalBatchInputSeller form={form} key={keyInputSeller} />
            </Col>
          </Row>

          <Spin spinning={loadingSalesFunnel} style={{ marginTop: '-2px' }}>
            <Row>
              <Col span="24" className="mb-2">
                <Form.Item label="Fase" name="changeFunnelStage" initialValue={1}>
                  <Select onChange={clearAlerts}>
                    <Option value={1}>Manter valor existente</Option>
                    <Option value={2}>Substituir valor existente com...</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row
              style={{
                display:
                  form.getFieldValue('changeFunnelStage') === 2
                    ? 'block'
                    : 'none',
              }}
            >
              <Col className="w-full">
                <Form.Item label="Funil">
                  <Select
                    showSearch
                    value={salesFunnelId}
                    onChange={onChangeSalesFunnel}
                    placeholder="Selecione o funil"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.props.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {salesFunnels.map(record => (
                      <Option value={record.salesFunnelId}>
                        {record.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col className="w-full">
                <Form.Item
                  label="Fase do funil"
                  name="funnelStage"
                  initialValue={null}
                  rules={[
                    {
                      validator: funnelStageValidate,
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Selecione uma fase"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      let checkFilter = -1
                      try {
                        checkFilter = option.props.label // children.props.children[1].props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase())
                      } catch {
                        checkFilter = -1
                      }
                      return checkFilter >= 0
                    }}
                  >
                    {funnelStages.map(record => (
                      <Option label={record.name} value={record.funnelStageId}>
                        {renderFunnelStage(record.name, record.icon)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Spin>
          <input type="submit" id="submit-form" className="hidden" />
        </Form>
      </div>
    </Modal>
  )
}

export default EditProposalBatchImplement

EditProposalBatchImplement.propTypes = {
  show: PropTypes.bool,
  closeEditProposalBatch: PropTypes.func,
}
