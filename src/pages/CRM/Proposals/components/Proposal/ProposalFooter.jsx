import React, { useEffect, useState } from 'react'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import { Col, Row, Spin } from 'antd'
import { useProposalContext } from '../../Context/proposalContext'

const fontSizePercent = 10
export default function ProposalFooter() {
  const {
    loading,
    loadingOwnerProfile,
    proposals,
    selectedRowKeys,
    isGrid,
  } = useProposalContext()

  const [singleTotalAmount, setSingleTotalAmount] = useState(0)
  const [recurringValue, setRecurringValue] = useState(0)

  const [singleTotalAmountSelected, setSingleTotalAmountSelected] = useState(0)
  const [recurringValueSelected, setRecurringValueSelected] = useState(0)
  const [
    singleTotalAmountNotSelected,
    setSingleTotalAmountNotSelected,
  ] = useState(0)
  const [recurringValueNotSelected, setRecurringValueNotSelected] = useState(0)
  const [quantitySelected, setQuantitySelected] = useState(0)
  const [quantityNotSelected, setQuantityNotSelected] = useState(0)

  const [
    percentSingleTotalAmountSelected,
    setPercentSingleTotalAmountSelected,
  ] = useState(null)
  const [
    percentRecurringValueSelected,
    setPercentRecurringValueSelected,
  ] = useState(null)
  const [
    percentSingleTotalAmountNotSelected,
    setPercentSingleTotalAmountNotSelected,
  ] = useState(null)
  const [
    percentRecurringValueNotSelected,
    setPercentRecurringValueNotSelected,
  ] = useState(null)
  const [percentQuantitySelected, setPercentQuantitySelected] = useState(null)
  const [percentQuantityNotSelected, setPercentQuantityNotSelected] = useState(
    null,
  )

  useEffect(() => {
    let singleTotalAmountWork = 0
    let recurringValueWork = 0
    proposals.map(record => {
      singleTotalAmountWork += record.singleTotalAmount
      recurringValueWork += record.recurringValue
      return true
    })
    setSingleTotalAmount(singleTotalAmountWork)
    setRecurringValue(recurringValueWork)
  }, [proposals])

  useEffect(() => {
    let singleTotalAmountSelectedWork = 0
    let recurringValueSelectedWork = 0
    let quantitySelectedWork = 0

    const quantity = proposals.length
    if (selectedRowKeys.length === proposals.length) {
      singleTotalAmountSelectedWork = singleTotalAmount
      recurringValueSelectedWork = recurringValue
      quantitySelectedWork = quantity
    } else if (selectedRowKeys.length > 0) {
      proposals
        .filter(d => selectedRowKeys.includes(d.proposalId))
        .map(record => {
          singleTotalAmountSelectedWork += record.singleTotalAmount
          recurringValueSelectedWork += record.recurringValue
          quantitySelectedWork++
          return true
        })
    }
    const singleTotalAmountNotSelectedWork =
      singleTotalAmount - singleTotalAmountSelectedWork
    const recurringValueNotSelectedWork =
      recurringValue - recurringValueSelectedWork
    const quantityNotSelectedWork = quantity - quantitySelectedWork

    const percentSingleTotalAmountSelectedWork = singleTotalAmount
      ? Math.round(
          10000 * (singleTotalAmountSelectedWork / singleTotalAmount),
        ) / 100
      : null
    const percentSingleTotalAmountNotSelectedWork = singleTotalAmount
      ? Math.round(
          10000 * (singleTotalAmountNotSelectedWork / singleTotalAmount),
        ) / 100
      : null

    const percentRecurringValueSelectedWork = recurringValue
      ? Math.round(10000 * (recurringValueSelectedWork / recurringValue)) / 100
      : null
    const percentRecurringValueNotSelectedWork = recurringValue
      ? Math.round(10000 * (recurringValueNotSelectedWork / recurringValue)) /
        100
      : null

    const percentQuantitySelectedWork = quantity
      ? Math.round((10000 * quantitySelectedWork) / quantity) / 100
      : null
    const percentQuantityNotSelectedWork = quantity
      ? Math.round((10000 * quantityNotSelectedWork) / quantity) / 100
      : null

    setSingleTotalAmountSelected(singleTotalAmountSelectedWork)
    setRecurringValueSelected(recurringValueSelectedWork)

    setSingleTotalAmountNotSelected(singleTotalAmountNotSelectedWork)
    setRecurringValueNotSelected(recurringValueNotSelectedWork)
    setQuantitySelected(quantitySelectedWork)
    setQuantityNotSelected(quantityNotSelectedWork)

    setPercentSingleTotalAmountSelected(percentSingleTotalAmountSelectedWork)
    setPercentRecurringValueSelected(percentRecurringValueSelectedWork)
    setPercentSingleTotalAmountNotSelected(
      percentSingleTotalAmountNotSelectedWork,
    )
    setPercentRecurringValueNotSelected(percentRecurringValueNotSelectedWork)
    setPercentQuantitySelected(percentQuantitySelectedWork)
    setPercentQuantityNotSelected(percentQuantityNotSelectedWork)
  }, [proposals, selectedRowKeys, singleTotalAmount, recurringValue])

  if (!loadingOwnerProfile && !loading) {
    return (
      <Row type="flex" gutter={48} justify="end">
        {isGrid &&
          selectedRowKeys.length > 0 &&
          selectedRowKeys.length < proposals.length && (
            <React.Fragment>
              <Col>
                <div style={{ color: 'gray' }}>
                  <span>
                    <b>Total negócios selecionados</b>
                  </span>
                  <div className="text-base text-right">
                    <div>
                      <span>
                        Total de recorrência:{' '}
                        {loading ? (
                          <Spin
                            className="ml-2"
                            style={{ marginTop: '-.5px' }}
                            size="small"
                          />
                        ) : (
                          <React.Fragment>
                            <b>
                              {addBrlCurrencyToNumber(recurringValueSelected)}
                            </b>
                            <span style={{ fontSize: fontSizePercent }}>
                              {` (${formatNumber(
                                percentRecurringValueSelected,
                                2,
                              )}%)`}
                            </span>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                    <div>
                      <span>
                        Total único:{' '}
                        {loading ? (
                          <Spin
                            className="ml-2"
                            style={{ marginTop: '-.5px' }}
                            size="small"
                          />
                        ) : (
                          <React.Fragment>
                            <b>
                              {addBrlCurrencyToNumber(
                                singleTotalAmountSelected,
                              )}
                            </b>
                            <span style={{ fontSize: fontSizePercent }}>
                              {` (${formatNumber(
                                percentSingleTotalAmountSelected,
                                2,
                              )}%)`}
                            </span>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                    <div>
                      <span>
                        Quantidade de negócios:{' '}
                        {loading ? (
                          <Spin
                            className="ml-2"
                            style={{ marginTop: '-.5px' }}
                            size="small"
                          />
                        ) : (
                          <React.Fragment>
                            <b>{quantitySelected}</b>
                            <span style={{ fontSize: fontSizePercent }}>
                              {` (${formatNumber(
                                percentQuantitySelected,
                                2,
                              )}%)`}
                            </span>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>

              <Col>
                <div style={{ color: 'gray' }}>
                  <span>
                    <b>Total negócios não selecionados</b>
                  </span>
                  <div className="text-base text-right">
                    <div>
                      <span>
                        Total de recorrência:{' '}
                        {loading ? (
                          <Spin
                            className="ml-2"
                            style={{ marginTop: '-.5px' }}
                            size="small"
                          />
                        ) : (
                          <React.Fragment>
                            <b>
                              {addBrlCurrencyToNumber(
                                recurringValueNotSelected,
                              )}
                            </b>
                            <span style={{ fontSize: fontSizePercent }}>
                              {` (${formatNumber(
                                percentRecurringValueNotSelected,
                                2,
                              )}%)`}
                            </span>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                    <div>
                      <span>
                        Total único:{' '}
                        {loading ? (
                          <Spin
                            className="ml-2"
                            style={{ marginTop: '-.5px' }}
                            size="small"
                          />
                        ) : (
                          <React.Fragment>
                            <b>
                              {addBrlCurrencyToNumber(
                                singleTotalAmountNotSelected,
                              )}
                            </b>
                            <span style={{ fontSize: fontSizePercent }}>
                              {` (${formatNumber(
                                percentSingleTotalAmountNotSelected,
                                2,
                              )}%)`}
                            </span>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                    <div>
                      <span>
                        Quantidade de negócios:{' '}
                        {loading ? (
                          <Spin
                            className="ml-2"
                            style={{ marginTop: '-.5px' }}
                            size="small"
                          />
                        ) : (
                          <React.Fragment>
                            <b>{quantityNotSelected}</b>
                            <span style={{ fontSize: fontSizePercent }}>
                              {` (${formatNumber(
                                percentQuantityNotSelected,
                                2,
                              )}%)`}
                            </span>
                          </React.Fragment>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </React.Fragment>
          )}
        <Col>
          <div>
            {isGrid &&
              selectedRowKeys.length > 0 &&
              selectedRowKeys.length < proposals.length && (
                <span>
                  <b>Total geral</b>
                </span>
              )}
            <div className="text-base text-right">
              <div>
                <span>
                  Total de recorrência:{' '}
                  <b>
                    {loading ? (
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
                    {loading ? (
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
              <div>
                <span>
                  Quantidade de negócios:{' '}
                  <b>
                    {loading ? (
                      <Spin
                        className="ml-2"
                        style={{ marginTop: '-.5px' }}
                        size="small"
                      />
                    ) : (
                      <React.Fragment>{proposals.length}</React.Fragment>
                    )}
                  </b>
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }
  return null
}