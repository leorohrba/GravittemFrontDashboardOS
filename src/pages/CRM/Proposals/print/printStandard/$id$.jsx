import React from 'react'
import { PrintProposal } from './PrintProposal'
import { PropTypes } from 'prop-types'
import router from 'umi/router'

const Index = ({ match }) => {
  const proposalId = match.params.id
  
  const handleClose = () => {
    router.push(`/CRM/proposals/detail/${proposalId}`)
  }
  
  return (  
   <PrintProposal
     proposalId={proposalId}
     onClose={handleClose}
   />  
  )
}

Index.propTypes = {
  match: PropTypes.any,
}

export default Index
