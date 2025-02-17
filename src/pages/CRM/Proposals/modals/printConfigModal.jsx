import { apiCRM } from '@services/api'
import { fieldsValidationToast, handleAuthError } from '@utils'
import { Form, Button, message, Modal, Row } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import PrintConfigModalForm from './printConfigModalForm'

function PrintConfigModal({
  printConfigModalVisible,
  setPrintConfigModalVisible,
}) {
  const [loadingData, setLoadingData] = useState(true)

  const [form] = Form.useForm()

  const handleSubmit = e => {
    e && e.preventDefault()
    form
      .validateFields()
      .then(values => {
        sendDataToServer(values)
        setPrintConfigModalVisible(false)
      })
      .catch(err => fieldsValidationToast(err))
  }

  const sendDataToServer = async values => {
    const { title, description } = values
    try {
      const response = await apiCRM.post(`/api/CRM/ProposalConfiguration`, {
        proposalConfiguration: { title, description },
      })
      const { data } = response
      if (data.isOk) {
        message.success('Dados salvos com sucesso!')
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }
  // Pegar dados da API
  useEffect(() => {
    if (printConfigModalVisible) {
      setLoadingData(true)
      const getProposalConfigData = async () => {
        try {
          const response = await apiCRM.get(`/api/CRM/ProposalConfiguration`)
          const { data } = response
          if (data.isOk) {
            const { title, description } = data.proposalConfiguration
            form.setFieldsValue({ title, description })
          } else {
            message.error(data.message)
          }
        } catch (error) {
          handleAuthError(error)
        }
      }
      getProposalConfigData()
      setLoadingData(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printConfigModalVisible])
  return (
    <Modal
      title="Configurações de impressão"
      visible={printConfigModalVisible}
      onCancel={() => setPrintConfigModalVisible(false)}
      onOk={handleSubmit}
      footer={
        <Row type="flex">
          <Button
            key="submit"
            type="primary"
            onClick={handleSubmit}
            htmlType="submit"
            className="formButton"
          >
            Salvar
          </Button>
          <Button key="back" onClick={() => setPrintConfigModalVisible(false)}>
            Cancelar
          </Button>
        </Row>
      }
    >
      <PrintConfigModalForm
        loadingData={loadingData}
        form={form}
        handleSubmit={handleSubmit}
      />
    </Modal>
  )
}

PrintConfigModal.propTypes = {
  printConfigModalVisible: PropTypes.bool,
  setPrintConfigModalVisible: PropTypes.func,
}

export default PrintConfigModal
