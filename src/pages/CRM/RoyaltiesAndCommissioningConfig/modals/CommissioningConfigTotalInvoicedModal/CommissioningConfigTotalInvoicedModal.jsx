import Button from '@components/Button'
import { Modal, Row, Select, Col, Spin, Alert, Skeleton ,message} from 'antd'
import PropTypes from 'prop-types'
import {apiCRM} from '@services/api'
import React, { useState, useEffect } from 'react'

import {
  hasPermission,
  handleAuthError,
  removeNumberFormatting,
} from '@utils'

import CommissioningConfigTotalInvoicedModalTabs from './CommissioningConfigTotalInvoicedModalTabs'

const { Option } = Select
let commissionConfig = []

function CommissioningConfigTotalInvoicedModal({
  visible,
  toogleModalVisible,
  userPermissions,
  defaultCommissionType,
  readOnly,
}) {
  
  const commissionDiscount = 
  {    
    commissionTotalInvoiceDiscountId: 0,
    discountUntil: null,
    commissionPercentage: null,
  }
  
  const commissionInterval = 
  {
     commissionTotalInvoiceId: 0,
     title: null,
     initialValue: null,
     limitValue: null,
     marketingPercentage: null,
     rateCommissionType: 1,
     commissionPercentage: null,
     commissionDiscounts: [commissionDiscount]
  }
  
  const ref = React.useRef()
  const [canBeUpdated, setCanBeUpdated] = useState(false)
  const [formChanged, setFormChanged] = useState(false) 
  const [showSkeleton, setShowSkeleton] = useState(true)
  const [alertMessages, setAlertMessages] = useState([])
  const [commissionIntervals, setCommissionIntervals] = useState([])
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [commissionType, setCommissionType] = useState(1)
  const [activeKey, setActiveKey] = useState(0)

  useEffect(() => {
    if (visible) {
       setShowSkeleton(true)
       setCommissionIntervals([])
       setFormChanged(false)
       setCommissionType(1)
       setActiveKey(0)
       getConfig(defaultCommissionType)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [visible])      
  
  useEffect(() => {
     setCanBeUpdated(hasPermission(userPermissions, 'Alter') && !readOnly)
  },[readOnly, userPermissions])
  
  const handleSubmit = e => {
    
    e.preventDefault()
    
    if (!canBeUpdated) {
        message.error('Atualização não permitida!')
        return
    }
    
    if (formValidate()) {
      saveConfig()
    }

  }
  
  function formValidate() {
    const messages = []
    commissionIntervals.map((interval, index) => {
       if (!interval.title) {
         messages.push(`Título da faixa ${index + 1} não pode ficar em branco!`)
       }   
       if (!interval.initialValue && interval.initialValue !== 0) {
         messages.push(`Valor inicial da faixa ${index + 1} não pode ficar em branco!`) 
       }
       if (!interval.limitValue && interval.limitValue !== 0) {
        messages.push(`Valor final da faixa ${index + 1} não pode ficar em branco!`) 
       }
       if (!interval.commissionPercentage && interval.commissionPercentage !== 0 && interval.rateCommissionType === 1) {
          messages.push(`Comissão da faixa ${index + 1} não pode ficar em branco!`) 
       }
       if (interval.rateCommissionType === 2) {
         interval.commissionDiscounts.map((discount, i) => {
           if (!discount.discountUntil && discount.discountUntil !== 0) {
             messages.push(`Desconto nº ${i + 1} da faixa ${index + 1} não pode ficar em branco!`)
           }

           if (!discount.commissionPercentage && discount.commissionPercentage !== 0) {
              messages.push(`Comissão do desconto nº ${i + 1} da faixa ${index + 1} não pode ficar em branco!`)
           }
           return true
         })
       }
      return true
    })
    
    setAlertMessages(messages)

    if (ref.current && messages.length > 0) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }

    if (messages.length > 0) {
      message.error('Existem erros de validação na configuração do comissionamento!')
    }

    return messages.length === 0
  }
  
  async function getConfig(id) {
    
    setLoading(true)

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/commissionTotalInvoice`,
      })
      setLoading(false)
      setShowSkeleton(false)
      const { data } = response

      if (data.isOk) {
        
        commissionConfig = data.commissionTotalInvoice
        if (commissionConfig.length > 0)
        {
            let index = 0
            
            if (id) {
              index = commissionConfig.findIndex(x => x.commissionType === id)
            }
            
            if (index >= 0) {
              if (commissionConfig[index].commissionType !== commissionType) {
                  setActiveKey(0)
              }
              setCommissionType(commissionConfig[index].commissionType)
              buildForm(commissionConfig[index])
            }
            else {
                setCommissionIntervals([])
            }
        }
        else {
            setActiveKey(0)
            setCommissionIntervals([])
        }
        
        if (id) {
           setCommissionType(id)
        }

      } else {
        message.error(data.message)
        toogleModalVisible()
      }
    } catch (error) {
      console.log(error)  
      handleAuthError(error)
      toogleModalVisible()
    }
  }
  
  async function saveConfig(id) {
    
    setAlertMessages([])
    setIsSaving(true)

    const configBody = {
      commissionTotalInvoice: 
        {
            commissionType,
            commissionIntervals: []
        }
    }
    
    commissionIntervals.map( (interval, index) => {
        configBody.commissionTotalInvoice.commissionIntervals.push(
                 {
                   commissionTotalInvoiceId: interval.commissionTotalInvoiceId,
                   title: interval.title,
                   initialValue: removeNumberFormatting(interval.initialValue) || 0,
                   limitValue: removeNumberFormatting(interval.limitValue) || 0,
                   marketingPercentage: removeNumberFormatting(interval.marketingPercentage) || 0,
                   isFixedRateCommission: interval.rateCommissionType === 1,
                   isDiscountRateCommission: interval.rateCommissionType === 2,
                   commissionPercentage: interval.rateCommissionType === 1 ? removeNumberFormatting(interval.commissionPercentage) || 0 : 0,
                   commissionDiscounts: []
                 })
        if (interval.rateCommissionType === 2) {
           interval.commissionDiscounts.map((discount) => (
                configBody.commissionTotalInvoice.commissionIntervals[index].commissionDiscounts.push(
                {
                  commissionTotalInvoiceDiscountId: discount.commissionTotalInvoiceDiscountId,
                  discountUntil: removeNumberFormatting(discount.discountUntil) || 0,
                  commissionPercentage: removeNumberFormatting(discount.commissionPercentage) || 0,
                })
            ))
        }
        return true
    })      
    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/commissionTotalInvoice`,
        data: configBody,
        headers: { 'Content-Type': 'application/json' },
      })

      setIsSaving(false)

      const { data } = response

      if (data.isOk) {
        message.success('Comissionamento salvo com sucesso!')
        setFormChanged(false)
        getConfig(id || commissionType)
      } else {
        
        if (data.validationMessageList.length > 0) {
          setAlertMessages(data.validationMessageList)
        }
        
        if (ref.current) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
        
        message.error(data.message)
      }
    } catch (error) {
      console.log(error)  
      setIsSaving(false)
      handleAuthError(error)
    }
  }
  
  function buildForm(config) {
    const commissionIntervalsNew = []
    
    config.commissionIntervals.map( (interval, index) => {
       commissionIntervalsNew.push( 
                  {
                   commissionTotalInvoiceId: interval.commissionTotalInvoiceId,
                   title: interval.title,
                   initialValue: interval.initialValue,
                   limitValue: interval.limitValue,
                   marketingPercentage: interval.marketingPercentage,
                   rateCommissionType: interval.isFixedRateCommission ? 1 : 2,
                   commissionPercentage: interval.isFixedRateCommission ? interval.commissionPercentage : null,
                   commissionDiscounts: []
                  })
       if (interval.commissionDiscounts.length === 0) {
           commissionIntervalsNew[index].commissionDiscounts.push(commissionDiscount)
       }
       else 
       {
         interval.commissionDiscounts.map( (discount) => (
            commissionIntervalsNew[index].commissionDiscounts.push(
                  {            
                   commissionTotalInvoiceDiscountId: discount.commissionTotalInvoiceDiscountId,
                   discountUntil: discount.discountUntil,
                   commissionPercentage: discount.commissionPercentage
                  })
         ))
       }
       return true
    }) 
    
    if (activeKey > commissionIntervalsNew.length - 1) {
       setActiveKey(0)
    }
    setCommissionIntervals(commissionIntervalsNew)       
  }

  const addInterval = () => {  
    setFormChanged(true)
    const newActiveKey = commissionIntervals.length
    setCommissionIntervals([...commissionIntervals, commissionInterval])
    setActiveKey(newActiveKey)
  }
  
  const removeInterval = (targetKey) => {
    setFormChanged(true)
    let newActiveKey = targetKey 
    
    if (commissionIntervals.length === 1) {
        newActiveKey = 0
        setCommissionIntervals([])
    }
    else 
    {
        if (newActiveKey > commissionIntervals.length - 2) {
           newActiveKey = commissionIntervals.length - 2
        }
        commissionIntervals.splice(targetKey, 1)
        setCommissionIntervals([...commissionIntervals])
    }
    setActiveKey(newActiveKey)
  }  
  
  const setTitle = (value, tabKey) => {
    setFormChanged(true)
    commissionIntervals[tabKey].title = value
    setCommissionIntervals([...commissionIntervals])  
  }

  const setInitialValue = (value, tabKey) => {
    setFormChanged(true)
    commissionIntervals[tabKey].initialValue = value
    setCommissionIntervals([...commissionIntervals])  
  }

  const setLimitValue = (value, tabKey) => {
    setFormChanged(true)
    commissionIntervals[tabKey].limitValue = value
    setCommissionIntervals([...commissionIntervals])  
  }

  const setMarketingPercentage = (value, tabKey) => {
    setFormChanged(true)
    commissionIntervals[tabKey].marketingPercentage = value
    setCommissionIntervals([...commissionIntervals])  
  }

  const setCommissionPercentage = (value, tabKey) => {
    setFormChanged(true)
    commissionIntervals[tabKey].commissionPercentage = value
    setCommissionIntervals([...commissionIntervals])  
  }
  
  const setRateCommissionType = (value, tabKey) => {
    setFormChanged(true)
    commissionIntervals[tabKey].rateCommissionType = value
    setCommissionIntervals([...commissionIntervals])    
  }

  const setDiscountUntil = (value, tabKey, index) => {
    setFormChanged(true)
    commissionIntervals[tabKey].commissionDiscounts[index].discountUntil = value
    setCommissionIntervals([...commissionIntervals])  
  }

  const setDiscountCommission = (value, tabKey, index) => {
    setFormChanged(true)
    commissionIntervals[tabKey].commissionDiscounts[index].commissionPercentage = value
    setCommissionIntervals([...commissionIntervals])  
  }
  
  const addDiscountCommission = (tabKey) => {  
    setFormChanged(true)
    commissionIntervals[tabKey].commissionDiscounts.push(commissionDiscount)
    setCommissionIntervals([...commissionIntervals])
  }

  const removeDiscountCommission = (tabKey, index) => {  
    setFormChanged(true)
    commissionIntervals[tabKey].commissionDiscounts.splice(index, 1)
    if (commissionIntervals[tabKey].commissionDiscounts.length === 0) {
      commissionIntervals[tabKey].commissionDiscounts.push(commissionDiscount)
    }
    setCommissionIntervals([...commissionIntervals])
  }
  
  const onChangeCommissionType = value => {
     if (formChanged && canBeUpdated) {
      Modal.confirm({
        content: `Deseja salvar a configuração atual?`,
        title: 'Atenção',
        okText: 'Sim',
        cancelText: 'Não',
        onOk: () => {
          if (formValidate()) {
            saveConfig(value)
          }
        },
        onCancel: () => {
          handleChangeCommissionType(value)
        }
      })
    }
    else {
      handleChangeCommissionType(value)
    }        
  }     
  
  const handleChangeCommissionType = (id) => {
    setFormChanged(false)
    setAlertMessages([])
    setCommissionType(id)
     const index = commissionConfig.findIndex(x => x.commissionType === id)
     setActiveKey(0)
     if (index >= 0) {
       buildForm(commissionConfig[index])
     }
     else {
       setCommissionIntervals([])  
     }
  }      
  
  return (
    <Modal
      visible={visible}
      title="Comissionamento no total faturado"
      onCancel={toogleModalVisible}
      onOk={handleSubmit}
      style={{ top: '10px' }}
      footer={
        <Row type="flex">
         {canBeUpdated && !loading && (
            <Button
              className="formButton"
              htmlType="submit"
              loading={isSaving}
              onClick={handleSubmit}
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
       <Skeleton loading={showSkeleton} paragraph={{ rows: 15 }} active>
        
        <div ref={ref}> 
          {alertMessages.map((message, index) => (
          <Alert
            type="error"
            message={message}
            key={index}
            showIcon
            className="mb-2"
          />
          ))}
        </div>
        
        <Row>
          <Col className="mb-2">
            <b>Comissionamento sobre:</b>
          </Col>
          <Col className="mb-4 ml-2">           
            <Select
              className="w-full" 
              value={commissionType}
              onChange={onChangeCommissionType}
            >
              <Option value={1}>Valor total</Option>
              <Option value={2}>Valor dos produtos</Option>
              <Option value={3}>Valor dos serviços</Option>
            </Select>
          </Col>
        </Row> 

        <CommissioningConfigTotalInvoicedModalTabs
          commissionIntervals={commissionIntervals}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          addInterval={addInterval}
          removeInterval={removeInterval}
          setTitle={setTitle}
          setRateCommissionType={setRateCommissionType}
          setDiscountUntil={setDiscountUntil}
          setDiscountCommission={setDiscountCommission}
          addDiscountCommission={addDiscountCommission}
          removeDiscountCommission={removeDiscountCommission}
          setLimitValue={setLimitValue}
          setInitialValue={setInitialValue}
          setMarketingPercentage={setMarketingPercentage}
          setCommissionPercentage={setCommissionPercentage}
          canBeUpdated={canBeUpdated}
        />
      
       </Skeleton> 
     </Spin> 
      
    </Modal>
  )
}

CommissioningConfigTotalInvoicedModal.propTypes = {
  toogleModalVisible: PropTypes.func,
  visible: PropTypes.bool,
  userPermissions: PropTypes.array,
  defaultCommissionType: PropTypes.number,
  readOnly: PropTypes.bool,
}

export default CommissioningConfigTotalInvoicedModal
