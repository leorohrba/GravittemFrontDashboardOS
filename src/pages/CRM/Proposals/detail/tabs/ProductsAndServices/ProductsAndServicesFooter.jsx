import { Spin } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { addBrlCurrencyToNumber } from '@utils'

export default function ProductsAndServicesFooter({
  recurringValue,
  singleTotalAmount,
  locationValue,
  proposalType,
  loading,
  profitPercent,
  profitSingleValue,
  profitRecurringValue,
}) {
  return (
    <div>
      <div className="text-base text-right">
        <div>
          <span>
            Total de recorrência:{' '}
            <b>
              {!loading ? (
                <Spin
                  className="ml-2"
                  style={{ marginTop: '-.5px' }}
                  size="small"
                />
              ) : (
                <React.Fragment>
                  {addBrlCurrencyToNumber(recurringValue)}
                </React.Fragment>
              )}
            </b>
          </span>
        </div>
        <div>
          <span>
            Total único:{' '}
            <b>
              {!loading ? (
                <Spin
                  className="ml-2"
                  style={{ marginTop: '-.5px' }}
                  size="small"
                />
              ) : (
                <React.Fragment>
                  {addBrlCurrencyToNumber(singleTotalAmount)}
                </React.Fragment>
              )}
            </b>
          </span>
        </div>
        {!!profitPercent && !!profitRecurringValue && (
          <div>
            <span>
              Valor do lucro recorrente:{' '}
              <b>
                {!loading ? (
                  <Spin
                    className="ml-2"
                    style={{ marginTop: '-.5px' }}
                    size="small"
                  />
                ) : (
                  <React.Fragment>
                    {addBrlCurrencyToNumber(profitRecurringValue)}
                  </React.Fragment>
                )}
              </b>
            </span>
          </div>
        )}
        {!!profitSingleValue && (
          <div>
            <span>
              Valor do lucro:{' '}
              <b>
                {!loading ? (
                  <Spin
                    className="ml-2"
                    style={{ marginTop: '-.5px' }}
                    size="small"
                  />
                ) : (
                  <React.Fragment>
                    {addBrlCurrencyToNumber(profitSingleValue)}
                  </React.Fragment>
                )}
              </b>
            </span>
          </div>
        )}
        {proposalType === 2 && (
          <div>
            <span>
              Valor da locação:{' '}
              <b>
                {!loading ? (
                  <Spin
                    className="ml-2"
                    style={{ marginTop: '-.5px' }}
                    size="small"
                  />
                ) : (
                  <React.Fragment>
                    {addBrlCurrencyToNumber(locationValue)}
                  </React.Fragment>
                )}
              </b>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

ProductsAndServicesFooter.propTypes = {
  recurringValue: PropTypes.number,
  singleTotalAmount: PropTypes.number,
  loading: PropTypes.bool,
  proposalType: PropTypes.number,
  locationValue: PropTypes.number,
  profitPercent: PropTypes.number,
  profitSingleValue: PropTypes.number,
  profitRecurringValue: PropTypes.number,
}
