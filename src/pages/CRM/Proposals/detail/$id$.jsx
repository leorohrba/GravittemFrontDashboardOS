/**
 * breadcrumb: Detalhe do negócio
 * hide: true
 */
import PropTypes from 'prop-types'
import React from 'react'
import Proposal from './Proposal'

export default function Detail({ match }) {

  return (
    <Proposal
      isRouter
    />      
  )
}

Detail.propTypes = {
  match: PropTypes.object,
}
