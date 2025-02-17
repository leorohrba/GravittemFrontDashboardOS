import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { Row, Col } from 'antd'

export default function CommissioningFranchisorReportFooter({
  reportData,
}) {
  const totalComissionValue = reportData.reduce(
    (sum, { commissionValue }) => sum + commissionValue,
    0,
  )
  const totalGrossBilling = reportData.reduce(
    (sum, { grossBilling }) => sum + grossBilling,
    0,
  )
  const totalRecurrenceValue = reportData.reduce(
    (sum, { recurrenceValue }) => sum + recurrenceValue,
    0,
  )
  const totalFinalRecurrenceValue = reportData.reduce(
    (sum, { finalRecurrenceValue }) => sum + finalRecurrenceValue,
    0,
  )
  const totalMarketingValue = reportData.reduce(
    (sum, { marketingValue }) => sum + marketingValue,
    0,
  )
  return (
    <div className="mt-4">
      <Row type="flex">
        <Col className="ml-auto">
          <h3 className="mr-5">Total recorrência</h3></Col>
        <Col>
          <h3>
            {formatNumber(totalRecurrenceValue, {
              style: 'currency',
              currency: 'BRL',
            })}
          </h3>
        </Col>
      </Row>
      <Row type="flex">
        <Col className="ml-auto">
          <h3 className="mr-5">Total marketing</h3></Col>
        <Col>
          <h3
            style={{
              color: 'gray',
            }}
          >
            {formatNumber(totalMarketingValue, {
              style: 'currency',
              currency: 'BRL',
            })}
          </h3>
        </Col>
      </Row>
      <Row type="flex">
        <Col className="ml-auto">
          <h3 className="mr-5">Total rebate</h3></Col>
        <Col>
          <h3
            style={{
              color: '#388e3c',
            }}
          >
            {formatNumber(totalComissionValue, {
              style: 'currency',
              currency: 'BRL',
            })}
          </h3>
        </Col>
      </Row>
      <Row type="flex">
        <Col className="ml-auto">
          <h3 className="mr-5">Total líquido recorrência</h3></Col>
        <Col>
          <h3>
            {formatNumber(totalFinalRecurrenceValue, {
              style: 'currency',
              currency: 'BRL',
            })}
          </h3>
        </Col>
      </Row>
      <Row type="flex">
        <Col className="ml-auto">
          <h3 className="mr-5">Total faturamento bruto</h3></Col>
        <Col>
          <h3>
            {formatNumber(totalGrossBilling, {
              style: 'currency',
              currency: 'BRL',
            })}
          </h3>
        </Col>
      </Row>
    </div>
  )
}

CommissioningFranchisorReportFooter.propTypes = {
  reportData: PropTypes.array,
}
