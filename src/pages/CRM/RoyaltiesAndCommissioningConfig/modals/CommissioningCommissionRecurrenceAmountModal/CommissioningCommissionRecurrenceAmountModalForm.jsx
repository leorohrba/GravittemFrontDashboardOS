import { Form } from '@ant-design/compatible'
import { Row, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import NumberFormat from 'react-number-format'
                        
export default function CommissioningCommissionRecurrenceAmountModalForm({
  handleSubmit,
  getFieldDecorator,
  canBeUpdated,
}) {
  return (
    <Form layout="vertical" onSubmit={handleSubmit}>
      <Row type="flex">
        <Form.Item label="% de comissionamento" className="pr-4">
          {getFieldDecorator(`commissionPercentage`,
             { rules: [{ required: true, message: 'Campo obrigatório!' }] }         
          )(
            <NumberFormat
              className="ant-input"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              suffix="%"
              readOnly={!canBeUpdated}
              autoFocus
            />,
          )}
        </Form.Item>
        <Form.Item label="% de marketing">
          {getFieldDecorator(`marketingPercentage`,
            { rules: [{ required: true, message: 'Campo obrigatório!' }] }
          )(
            <NumberFormat
              className="ant-input"
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              thousandSeparator="."
              decimalSeparator=","
              suffix="%"
              readOnly={!canBeUpdated}
            />,
          )}
        </Form.Item>
      </Row>
      <Form.Item
        className="w-1/2"
        colon={false}
        label={
          <span>
            <span className="mr-2">Quantidade de recorrências :</span>
            <Tooltip
              title="Defina os primeiros meses de um contrato que serão comissionados."
              placement="right"
            >
              <i className="fa fa-info-circle" aria-hidden="true" />
            </Tooltip>
          </span>
        }
      >
        {getFieldDecorator(`recurrenceQuantity`,
          { rules: [{ required: true, message: 'Campo obrigatório!' }] }
        )(
          <NumberFormat
            className="ant-input"
            decimalScale={0}
            allowNegative={false}
            readOnly={!canBeUpdated}
          />,
        )}
      </Form.Item>
      <input type="submit" id="submit-form" className="hidden" />
    </Form>
  )
}

CommissioningCommissionRecurrenceAmountModalForm.propTypes = {
  getFieldDecorator: PropTypes.func,
  handleSubmit: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}
