import { Col, Alert, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function ProposalQueryModalField({
  label,
  value,
  align,
  width,
  icon,
  full,
}) {

  return (
     <Col className={full ? 'w-full' : ''}>
       <div className="mb-1">
         <span><b>{label}</b></span>
       </div>  
       <Alert 
         className={`mb-2 truncate ${align === 'center' ? 'text-center' : ''}`} 
         type="info"
         style={{ 
                 width: width ? `${width}px` : 'auto',
                }}
         message={<Tooltip title={value}>
                    {icon && (
                       <i className={`mr-2 fa ${icon} fa-lg`} style={{color: '#3182ce'}} />
                    )}   
                    {value ?
                       (
                         <span>{value}</span>
                       )
                       :
                       (
                         <span>&nbsp;</span>
                       )
                    }                        
                  </Tooltip>} 
       />
     </Col>
  )
}

ProposalQueryModalField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  align: PropTypes.string,
  width: PropTypes.number,
  icon: PropTypes.string,
  full: PropTypes.bool,
}
