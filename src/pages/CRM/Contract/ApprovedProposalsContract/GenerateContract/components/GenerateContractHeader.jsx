import { Row, Col, Divider } from 'antd'
import React from 'react'
import PropTypes from 'prop-types'

export default function GenerateContractHeader({ handleReturn, generateIds }) {

  return (
    <React.Fragment>  
      <Row type="flex" align="middle" className="mb-2">
        <Col>
          <div>
            <span
              style={{
                color: '#1976D2',
                cursor: 'pointer',
              }}
              onClick={() => handleReturn()}
              role="button"
            >
               Gerar contratos de propostas aprovadas
            </span>
            <i className="mx-3 fa fa-angle-right" />
            <span>{!generateIds?.contratoId ? 'Gerar contrato' : 'Consultar contrato'}</span>  
          </div>
        </Col>
        <Col className="ml-auto">
          <h1>{`Proposta ${generateIds?.numero}`}</h1>
        </Col>
      </Row> 
      <Divider className="mt-0 mb-4" /> 
    </React.Fragment>  
    )
}

GenerateContractHeader.propTypes = {
  handleReturn: PropTypes.func,
  generateIds: PropTypes.any,
}

