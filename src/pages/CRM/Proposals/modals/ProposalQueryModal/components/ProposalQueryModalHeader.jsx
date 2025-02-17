import { Card, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import moment from 'moment'
import ProposalQueryModalField from './ProposalQueryModalField'

const gutter = 32

export default function ProposalQueryModalHeader({
  header,
  ownerProfile,
}) {

  return (
    <Card
      size="small"
      className="px-2"
    >
      <Row type="flex" gutter={gutter}>
        <ProposalQueryModalField 
          label="Negócio:" 
          value={header.number}
          width="100"
        />          
        <ProposalQueryModalField 
          label="Data de criação:" 
          value={moment(header.createDateTime).format('DD/MM/YYYY HH:mm')}
        />          
        <ProposalQueryModalField 
          label="Situação:"
          width="150"          
          value={header.actStatusDescription}
        /> 
        {!header.closedDate ?
         (      
          <ProposalQueryModalField 
            label="Previsão de fechamento:" 
            value={header.expectedClosingDate ? moment(header.expectedClosingDate).format('DD/MM/YYYY') : ''}
          />
          ) :
          (          
          <ProposalQueryModalField 
            label="Data de fechamento:" 
            value={header.closedDate ? moment(header.closedDate).format('DD/MM/YYYY') : ''}
          />
          )
        }  
        <ProposalQueryModalField 
          label="Fase:"
          width="220"          
          icon={header.funnelStageIcon}
          value={header.funnelStageName}
        />          
      </Row>
      <Row type="flex" gutter={gutter}>
        {ownerProfile !== 'Standard' && (
          <ProposalQueryModalField 
            label="Franqueado:" 
            value={header.franchiseeName}
            width="300"
          />   
        )}        
        <ProposalQueryModalField 
          label="Organização:" 
          value={header.companyShortName}
          width="300"
        />          
        <ProposalQueryModalField 
          label="Vendedor:" 
          value={header.sellerName}
          width="240"
        />          
      </Row>
    </Card>
  )
}

ProposalQueryModalHeader.propTypes = {
  header: PropTypes.object,
  ownerProfile: PropTypes.string,
}
