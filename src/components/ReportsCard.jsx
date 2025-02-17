import { getLocaleCurrency } from '@utils'
import { Card, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatNumber } from 'umi-plugin-react/locale'

export default function ReportsCard({
  title,
  value,
  icon,
  color,
  leftBottomDetail,
  rightBottomDetail,
  size,
}) {
  return (
    <Card
      className="mr-3"
      style={{
        width: 300,
        backgroundColor: color,
        color: 'white',
        borderRadius: '4px',
      }}
      size={size || null}
    >
      <div className="flex">
        <p className="mb-0">{title}</p>
        <i className={`fa fa-${icon} fa-lg ml-auto`} aria-hidden="true" />
      </div>
      <h2
        className="m-0"
        style={{
          color: 'white',
        }}
      >
        {formatNumber(value, {
          style: 'currency',
          currency: getLocaleCurrency(),
        })}
      </h2>
      <Row className="mt-1" type="flex">
        {leftBottomDetail}
        {rightBottomDetail}
      </Row>
    </Card>
  )
}

ReportsCard.propTypes = {
  color: PropTypes.any,
  icon: PropTypes.any,
  title: PropTypes.any,
  value: PropTypes.any,
  leftBottomDetail: PropTypes.any,
  rightBottomDetail: PropTypes.any,
  size: PropTypes.any,
}
