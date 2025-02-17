import PropTypes from 'prop-types'
import React from 'react'
import { addBrlCurrencyToNumber } from '@utils'

export default function ProposalQueryModalTotal({
  recurringValue, singleTotalAmount
}) {

  return (
    <div className="mt-4">
      <div className="text-base text-right">
        <div>
          <span>
            Total de recorrência:
            <b className="ml-2">
              {addBrlCurrencyToNumber(recurringValue)}
            </b>
          </span>
        </div>
        <div>
          <span>
            Total único:
            <b className="ml-2">
              {addBrlCurrencyToNumber(singleTotalAmount)}
            </b>
          </span>
        </div>
      </div>
    </div>
  )
}

ProposalQueryModalTotal.propTypes = {
  recurringValue: PropTypes.number,
  singleTotalAmount: PropTypes.number,
}
