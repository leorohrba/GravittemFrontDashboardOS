import { Tabs } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import CommissioningConfigTotalInvoicedModalForm from './CommissioningConfigTotalInvoicedModalForm'

const { TabPane } = Tabs

export default function CommissioningConfigTotalInvoicedModalTabs(props)
{
  const { 
    commissionIntervals,
    activeKey,
    setActiveKey,    
    addInterval,
    removeInterval,
    setTitle,
    setRateCommissionType,
    setDiscountUntil,
    setDiscountCommission,
    addDiscountCommission,
    removeDiscountCommission,
    setCommissionPercentage,
    setMarketingPercentage,
    setInitialValue,
    setLimitValue,
    canBeUpdated,
  } = props

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      addInterval()
    }
    else if (action === 'remove') {
      removeInterval(targetKey)  
    }
  }
  
  const onChange = targetKey => {
    setActiveKey(targetKey)
  }
   
  return (
    <React.Fragment> 
      <Tabs
        onChange={onChange}
        activeKey={activeKey.toString()}
        type={canBeUpdated ? 'editable-card' : 'card'}
        onEdit={onEdit}
      >
        {commissionIntervals.map((commissionInterval, index) => (
          <TabPane 
            tab={`Faixa ${index + 1}`} 
            key={index} 
          >

            <CommissioningConfigTotalInvoicedModalForm
              commissionInterval={commissionInterval}
              setTitle={setTitle}
              setRateCommissionType={setRateCommissionType}
              tabKey={index}
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
            
          </TabPane>
        ))}
      </Tabs>
    </React.Fragment>
  )

}

CommissioningConfigTotalInvoicedModalTabs.propTypes = {
  commissionIntervals: PropTypes.array,
  activeKey: PropTypes.number,
  setActiveKey: PropTypes.func,
  addInterval: PropTypes.func,
  removeInterval: PropTypes.func,
  setTitle: PropTypes.func,
  setRateCommissionType: PropTypes.func,
  setDiscountUntil: PropTypes.func,
  setDiscountCommission: PropTypes.func,
  removeDiscountCommission: PropTypes.func,
  addDiscountCommission: PropTypes.func,
  setLimitValue: PropTypes.func,
  setInitialValue: PropTypes.func,
  setMarketingPercentage: PropTypes.func,
  setCommissionPercentage: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}

