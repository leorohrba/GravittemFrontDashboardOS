import { Form } from '@ant-design/compatible'
import Button from '@components/Button'
import { apiCRM } from '@services/api'
import { handleAuthError, hasPermission, removeNumberFormatting } from '@utils'
import { message, Modal, Row, Skeleton, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import CommissioningCommissionRecurrenceAmountModalForm from './CommissioningCommissionRecurrenceAmountModalForm'



function CommissioningCommissionRecurrenceAmountModal({
  visible,
  toogleModalVisible,
  form,
  userPermissions,
  readOnly,
}) {
  const [commissionRecurrenceAmountId, setCommissionRecurrenceAmountId] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [canBeUpdated, setCanBeUpdated] = useState(false)

  useEffect(() => {
    if (visible) {
       form.resetFields() 
       setCommissionRecurrenceAmountId(0)
       getConfig()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [visible])      
  
  useEffect(() => {
    setCanBeUpdated(hasPermission(userPermissions,'Alter') && !readOnly)
  },[readOnly, userPermissions])
  
  const handleSubmit = e => {
    e.preventDefault()
    
    if (!canBeUpdated) {
        message.error('Atualização não permitida!')
        return
    }
    
    form.validateFields((err, values) => {
      if (!err) {
        saveConfig()
      }
    })
  }

  async function getConfig() {
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/commissionRecurrenceAmount`,
      })
      setLoading(false)
      const { data } = response

      if (data.isOk) {
        const { commissionRecurrenceAmount } = data
        setCommissionRecurrenceAmountId(commissionRecurrenceAmount.commissionRecurrenceAmountId)
        form.setFieldsValue( {commissionPercentage: commissionRecurrenceAmount.commissionPercentage,
                              marketingPercentage: commissionRecurrenceAmount.marketingPercentage,
                              recurrenceQuantity: commissionRecurrenceAmount.recurrenceQuantity
                             })
      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      handleAuthError(error)
      toogleModalVisible()
    }
  }

  async function saveConfig() {
    
    setIsSaving(true)

    const configBody = {
      commissionRecurrenceAmount: 
        {
          commissionRecurrenceAmountId,
          commissionPercentage: removeNumberFormatting(form.getFieldValue('commissionPercentage')),
          marketingPercentage: removeNumberFormatting(form.getFieldValue('marketingPercentage')),
          recurrenceQuantity: form.getFieldValue('recurrenceQuantity'),
        }
    }

    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/commissionRecurrenceAmount`,
        data: configBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        toogleModalVisible()
      } else {
        message.error(data.message)
      }
    } catch (error) {
      console.log(error)
      setIsSaving(false)
      handleAuthError(error)
    }
  }


  const { getFieldDecorator } = form
  
  return (
    <Modal
      visible={visible}
      title="Comissionamento nas recorrências"
      onCancel={toogleModalVisible}
      onOk={handleSubmit}
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
            Fechar
          </Button>
        </Row>
      }
    >
      <Spin size="large" spinning={loading}>
        <Skeleton loading={loading} paragraph={{ rows: 3 }} active>
          <CommissioningCommissionRecurrenceAmountModalForm
            handleSubmit={handleSubmit}
            getFieldDecorator={getFieldDecorator}
            canBeUpdated={canBeUpdated}
          />
        </Skeleton>  
      </Spin>
    </Modal>
  )
}

CommissioningCommissionRecurrenceAmountModal.propTypes = {
  form: PropTypes.object,
  toogleModalVisible: PropTypes.func,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  readOnly: PropTypes.bool,
}

const WrappedComissioningCommissionRecurrenceAmountModal = Form.create({
  name: 'normal_form',
})(CommissioningCommissionRecurrenceAmountModal)

export default WrappedComissioningCommissionRecurrenceAmountModal
