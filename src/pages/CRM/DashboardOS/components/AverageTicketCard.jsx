import React from 'react'
import { Card, Row, Col, Spin, Tooltip } from 'antd'
import { addBrlCurrencyToNumber } from '@utils'
import PropTypes from 'prop-types'

const valueColor = 'blue'

export default function AverageTicketCard ({ loading, proposalState, openProposalDetail }) {
  
  const getAverageTicket = (value, quantity) => {
     const average = quantity === 0 ? 0 : value / quantity
     return parseFloat(average.toFixed(2))
  }
  
  return (
  <Spin spinning={loading}>  
    <Card>
      <Tooltip title="Valor total dos negócios ganhos / quantidade dos negócios ganhos">
        <h4>
          Ticket médio
        </h4>
      </Tooltip>  
     <Row type="flex" gutter={36}>
        <Col span={12}>
          <span style={{ color: 'gray' }}>
            <i>Valor único</i>
          </span>
          <br />
          <span 
            style={{ color: valueColor }}
            role="button"
            className="cursor-pointer"
            onClick={() => openProposalDetail('averageTicket')}
          >
            {addBrlCurrencyToNumber(getAverageTicket(proposalState?.uniqueValue || 0, proposalState?.quantity || 0))}
          </span>
        </Col>
        <Col span={12}>
          <span style={{ color: 'gray' }}>
            <i>Valor recorrente</i>
          </span>
          <br />
          <span 
            style={{ color: valueColor }}
            role="button"
            className="cursor-pointer"
            onClick={() => openProposalDetail('averageTicket')}
          >
            {addBrlCurrencyToNumber(getAverageTicket(proposalState?.recurrenceValue || 0, proposalState?.quantity || 0))}
          </span>
        </Col>
      </Row>
    </Card>
  </Spin>  
  )
}

AverageTicketCard.propTypes = {
  loading: PropTypes.bool,
  proposalState: PropTypes.any, 
  openProposalDetail: PropTypes.func,
}
