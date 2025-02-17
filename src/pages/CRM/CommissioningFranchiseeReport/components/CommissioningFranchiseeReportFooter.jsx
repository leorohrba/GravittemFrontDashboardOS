import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'
import { Row, Col } from 'antd' 

export default function CommissioningFranchiseeReportFooter({
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
  const totalMarketingValue = reportData.reduce(
    (sum, { marketingValue }) => sum + marketingValue,
    0,
  )
  return (
    <div className="mt-4">
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
          <h3 className="mr-5">Total comissão</h3></Col>
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

CommissioningFranchiseeReportFooter.propTypes = {
  reportData: PropTypes.array,
}
