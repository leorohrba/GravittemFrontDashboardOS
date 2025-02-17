import React from 'react'
import { Card, Spin, Tooltip } from 'antd'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'

const valueColor = 'blue'

export default function AverageCycleCard ({ loading, proposalAverageCycle, openProposalDetail }) {
  
  const getAverageCycle = (daysPerProposal) => {
    const value = parseFloat(daysPerProposal.toFixed(0))
    const average = `${formatNumber(value,0)} ${value === 1 ? 'dia' : 'dias'}`
    return average
  }
  
  return (
  <Spin spinning={loading}>  
    <Card>
      <Tooltip title={`Quantidade de dias em que cada negócio ganho ficou em aberto (${proposalAverageCycle?.quantityDays || 0}) / quantidade de negócios ganhos (${proposalAverageCycle?.quantityProposals || 0})`}>
        <h4>
          Ciclo médio de vendas
        </h4>
      </Tooltip>
      <span 
        style={{ fontSize: '200%', color: valueColor }} 
        className="mt-2 mb-2 cursor-pointer"
        role="button"
        onClick={() => openProposalDetail('averageCycle')}
      >
        {getAverageCycle(proposalAverageCycle?.averageDaysPerProposal || 0)}
      </span>
    </Card>
  </Spin>  
  )
}

AverageCycleCard.propTypes = {
  loading: PropTypes.bool,
  proposalAverageCycle: PropTypes.any, 
  openProposalDetail: PropTypes.func,
}

