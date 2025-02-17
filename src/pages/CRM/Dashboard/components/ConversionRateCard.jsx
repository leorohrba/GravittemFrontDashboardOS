import React from 'react'
import { Card, Spin, Tooltip } from 'antd'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'

const valueColor = 'blue'

export default function ConversionRateCard ({ loading, proposalConversionRate, openProposalDetail }) {

  return (
  <Spin spinning={loading}>  
    <Card>
      <Tooltip title={`Quantidade de negócios ganhos no período (${proposalConversionRate?.quantityProposalsWon || 0}) / quantidade de negócios criados no período (${proposalConversionRate?.quantityProposalsCreated || 0})`}>
        <h4>
          Taxa de conversão e vendas
        </h4>
      </Tooltip>  
      <span 
        style={{ fontSize: '200%', color: valueColor }} 
        className="mt-2 mb-2 cursor-pointer"
        role="button"
        onClick={() => openProposalDetail('conversionRate')}
      >
         {`${formatNumber(proposalConversionRate?.percentConversiontRate || 0,0)} %`}
      </span>
    </Card>
  </Spin>  
  )
}

ConversionRateCard.propTypes = {
  loading: PropTypes.bool,
  proposalConversionRate: PropTypes.any, 
  openProposalDetail: PropTypes.func,
}
