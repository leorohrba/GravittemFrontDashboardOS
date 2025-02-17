import Button from '@components/Button'
import { Form, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import NumberFormat from 'react-number-format'

export default function CommissioningConfigTotalInvoicedModalFormDiscountCommission(props) {
  
  const
  { commissionDiscounts,
    tabKey,
    setDiscountUntil,
    setDiscountCommission,
    addDiscountCommission,
    removeDiscountCommission,
    canBeUpdated,
  } = props
  
  const onChangeDiscountUntil = (e, index) => {
    setDiscountUntil(e.target.value, tabKey, index)
  }
  
  const onChangeDiscountCommission = (e, index) => {
    setDiscountCommission(e.target.value, tabKey, index)
  }

  const labelForm = (label) => {
    return <React.Fragment><span className="mr-1" style={{color: 'red'}}>*</span>{label}</React.Fragment>
  }
  
  return (
  <div>
   {commissionDiscounts.map((commissionDiscount, index) => (  
    <Row key={index} type="flex">
      <Form.Item
        label={labelForm('Desconto de até')}
        className="pr-4"
        style={{ width: '45%' }}
      >
        <NumberFormat
          value={commissionDiscount.discountUntil}
          onChange={(e) => onChangeDiscountUntil(e, index)} 
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
      <Form.Item label={labelForm('% de comissionamento')} style={{ width: '45%' }}>
        <NumberFormat
          value={commissionDiscount.commissionPercentage}
          onChange={(e) => onChangeDiscountCommission(e, index)}
          id="input-parcel-value"
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
      {index > 0 && canBeUpdated && (
        <div>
          <i
            className="fa fa-times fa-lg mt-12 ml-5 cursor-pointer"
            style={{ color: 'gray' }}
            aria-hidden="true"
            onClick={() => removeDiscountCommission(tabKey, index)}
          />
        </div>
      )} 
    </Row>
    ))}
    {canBeUpdated && (
      <div className="flex justify-end">
       <Button className="cursor-pointer" onClick={() => addDiscountCommission(tabKey)}>
         Adicionar outro desconto
       </Button>
      </div>
    )}
  </div>
  )
}

CommissioningConfigTotalInvoicedModalFormDiscountCommission.propTypes = {
  tabKey: PropTypes.number,
  commissionDiscounts: PropTypes.array,
  setDiscountUntil: PropTypes.func,
  setDiscountCommission: PropTypes.func,
  removeDiscountCommission: PropTypes.func,
  addDiscountCommission: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}
