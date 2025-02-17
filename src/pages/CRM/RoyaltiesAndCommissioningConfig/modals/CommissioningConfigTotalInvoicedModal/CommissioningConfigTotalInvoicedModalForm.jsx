import { Form } from '@ant-design/compatible'
import { Input, Radio, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import NumberFormat from 'react-number-format'
import CommissioningConfigTotalInvoicedModalFormDiscountCommission from './CommissioningConfigTotalInvoicedModalFormDiscountCommission'

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
}

export default function CommissioningConfigTotalInvoicedModalForm({
  commissionInterval,
  tabKey,
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
}) {
  
  const onChangeRateCommissionType = e => {
    if (canBeUpdated) {  
      setRateCommissionType(e.target.value, tabKey)
    }
  }
  
  const onChangeTitle = e => {
    setTitle(e.target.value, tabKey)
  }
  
  const onChangeInitialValue = e => {
    setInitialValue(e.target.value, tabKey)
  }
  
  const onChangeLimitValue = e => {
    setLimitValue(e.target.value, tabKey)
  }

  const onChangeMarketingPercentage = e => {
    setMarketingPercentage(e.target.value, tabKey)
  }

  const onChangeCommissionPercentage = e => {
    setCommissionPercentage(e.target.value, tabKey)
  }    
  
  const labelForm = (label) => {
    return <React.Fragment><span className="mr-1" style={{color: 'red'}}>*</span>{label}</React.Fragment>
  }

  return (
    <React.Fragment>
      <Form layout="vertical">
        <Form.Item label={labelForm('Título')}>
          <Input
            placeholder="Digite um título para a faixa"
            value={commissionInterval.title}
            onChange={onChangeTitle}
            readOnly={!canBeUpdated}
            autoFocus
          />
        </Form.Item>
        <Row type="flex">
          <Form.Item label={labelForm('Valor inicial')} className="pr-4">
            <NumberFormat
              value={commissionInterval.initialValue}
              onChange={onChangeInitialValue}
              className="ant-input"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$"
              readOnly={!canBeUpdated}
            />
          </Form.Item>
          <Form.Item label={labelForm('Valor final')}>
            <NumberFormat
              value={commissionInterval.limitValue}
              onChange={onChangeLimitValue}
              className="ant-input"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$"
              readOnly={!canBeUpdated}
            />
          </Form.Item>
        </Row>
        <Row type="flex">
          <Form.Item label="% de marketing" className="pr-4">
            <NumberFormat
              value={commissionInterval.marketingPercentage}
              onChange={onChangeMarketingPercentage}
              className="ant-input"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              suffix="%"
              readOnly={!canBeUpdated}
            />
          </Form.Item>
        </Row>
        <Form.Item>
          <Radio.Group value={commissionInterval.rateCommissionType} onChange={onChangeRateCommissionType}>
            <Radio style={radioStyle} value={1}>
              Comissão com alíquota fixa
            </Radio>
            <Radio style={radioStyle} value={2}>
              Comissão com alíquota conforme descontos
            </Radio>
          </Radio.Group>
        </Form.Item>
        {commissionInterval.rateCommissionType === 1 && (
          <Row>
            <Form.Item label={labelForm('% de comissionamento')} className="w-1/2">
              <NumberFormat
                value={commissionInterval.commissionPercentage}
                onChange={onChangeCommissionPercentage}
                className="ant-input"
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                thousandSeparator="."
                decimalSeparator=","
                suffix="%"
                readOnly={!canBeUpdated}
              />
            </Form.Item>
          </Row>
        )}
      </Form>
      
      {commissionInterval.rateCommissionType === 2 && (
        <CommissioningConfigTotalInvoicedModalFormDiscountCommission
          commissionDiscounts={commissionInterval.commissionDiscounts}
          setDiscountUntil={setDiscountUntil}
          setDiscountCommission={setDiscountCommission}
          addDiscountCommission={addDiscountCommission}
          removeDiscountCommission={removeDiscountCommission}
          tabKey={tabKey}
          canBeUpdated={canBeUpdated}
        />
      )}
      
    </React.Fragment>
  )
}

CommissioningConfigTotalInvoicedModalForm.propTypes = {
  commissionInterval: PropTypes.object,
  tabKey: PropTypes.number,
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
