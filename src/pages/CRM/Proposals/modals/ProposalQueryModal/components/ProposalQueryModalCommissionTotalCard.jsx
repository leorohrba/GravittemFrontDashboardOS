import { Card, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import ProposalQueryModalField from './ProposalQueryModalField'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'

const gutter = 36

export default function ProposalQueryModalCommissionTotalCard({
  title, grossValue, value, percentDiscount
}) {

  return (
    <Card
      title={<span style={{fontSize: '16px'}}>{title}</span>}
      className="px-2 py-2"
      size="small"
    >
     <Row type="flex" gutter={gutter}>
       <ProposalQueryModalField 
         label="Bruto:" 
         full
         value={addBrlCurrencyToNumber(grossValue)}
       />          
     </Row>  
     <Row type="flex" gutter={gutter}>
       <ProposalQueryModalField 
         label="Líquido:" 
         full
         value={addBrlCurrencyToNumber(value)}
       />          
     </Row>  
     <Row type="flex" gutter={gutter}>
       <ProposalQueryModalField 
         label="Desconto médio:" 
         full
         value={`${formatNumber(percentDiscount,2)}%`}
       />          
     </Row>  
    </Card>
  )
}

ProposalQueryModalCommissionTotalCard.propTypes = {
  grossValue: PropTypes.number,
  value: PropTypes.number,
  percentDiscount: PropTypes.number,
  title: PropTypes.string,
}
