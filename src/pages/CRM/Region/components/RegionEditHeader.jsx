import { Row, Col, Button } from 'antd'
import React from 'react'
import router from 'umi/router'
import PropTypes from 'prop-types'
import { hasPermission } from '@utils'

export default function RegionEditHeader({regionId, loading, isSaving, canBeUpdated, userPermissions, newRegion, isModal }) {
  
  const title = (isSavingForm) => ( isSavingForm ? 'Salvando...' : 'Carregando...')
  
  return (
  <Row type="flex" className={isModal && !hasPermission('Include') ? 'mb-0' : 'mb-4'}>
    {!isModal && (
      <Col>
        <span
          style={{
            color: '#1976D2',
            cursor: 'pointer',
          }}
          onClick={() => router.push('/Region')}
          role="button"
        >
          Regiões
        </span>
        <i className="mx-3 fa fa-angle-right" />
        {loading ? title(isSaving) : 
           regionId ? 
             (<span>{`${canBeUpdated ? 'Editar' : 'Consultar'} região`}</span>) :
             'Nova região'
        }
      </Col>
    )}
    {hasPermission(userPermissions, 'Include') && regionId && (          
      <Col className="ml-auto">
        <Button
          type="primary"
          onClick={() => newRegion()}
        >
          <i className="fa fa-plus fa-lg mr-3" />
            Nova região
        </Button>
      </Col>
    )}
  </Row> 
  )
}

RegionEditHeader.propTypes = {
  regionId: PropTypes.number,
  loading: PropTypes.bool,
  isSaving: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  userPermissions: PropTypes.array,
  newRegion: PropTypes.func,
  isModal: PropTypes.bool,
}