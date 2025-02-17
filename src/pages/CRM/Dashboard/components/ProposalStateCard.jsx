import React from 'react'
import { Card, Row, Col, Spin, Tooltip } from 'antd'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import PropTypes from 'prop-types'

export default function ProposalStateCard ({ type, loading, proposalState, openProposalDetail }) {
  
  
  return (
  <Spin spinning={loading}>  
    <Card>
      <Tooltip title={type === 1 ?
                      'Negócios ganhos com data de fechamento conforme período selecionado' :
                      type === 2 ?
                      'Negócios perdidos com data de fechamento conforme período selecionado' :
                      'Negócios criados com data de criação conforme período selecionado'
                     }
      >              
        <h4>
            {
              type === 1 ? 
             'Negócios ganhos' :
              type === 2 ?
              'Negócios perdidos' :
              type === 3 ?
              'Negócios criados' :
              ''
            }
        </h4>
      </Tooltip>
      <span 
        style={{ fontSize: '200%', color: type === 2 ? 'red' : '#4caf50' }} 
        className="mt-2 mb-2 cursor-pointer"
        role="button" 
        onClick={() => openProposalDetail('proposalState', type)}
      >
        {formatNumber(proposalState?.quantity || 0,0)}
      </span>
      <Row type="flex" gutter={36}>
        <Col span={12}>
          <span style={{ color: 'gray' }}>
            <i>Valor único</i>
          </span>
          <br />
          <span>
            {addBrlCurrencyToNumber(proposalState?.uniqueValue || 0)}
          </span>
        </Col>
        <Col span={12}>
          <span style={{ color: 'gray' }}>
            <i>Valor recorrente</i>
          </span>
          <br />
          <span>
            {addBrlCurrencyToNumber(proposalState?.recurrenceValue || 0)}
          </span>
        </Col>
      </Row>
    </Card>
  </Spin>  
  )
}

ProposalStateCard.propTypes = {
  type: PropTypes.string, 
  loading: PropTypes.bool,
  proposalState: PropTypes.any, 
  openProposalDetail: PropTypes.func,
}
