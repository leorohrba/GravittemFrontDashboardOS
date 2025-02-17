import Button from '@components/Button'
import SimpleSearch from '@components/SimpleSearch'
import { hasPermission } from '@utils'
import { Col, Row } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function MaterialsHeader({
  editLibrary,
  ownerProfile,
  userPermissions,
  startSearch,
  setSearchValues,
  searchOptions,
}) {
  return (
    <div>
      <Row>
        <Col style={{ width: '480px', marginLeft: 'auto' }}>
          <SimpleSearch
            searchOptions={searchOptions}
            fixedTypeWidth={150}
            startSearch={startSearch}
            setSearchValues={setSearchValues}
          />
        </Col>
      </Row>
      <Row>
        {hasPermission(userPermissions, 'Include') &&
          ownerProfile &&
          ownerProfile !== 'Franchise' && (
            <Button
              size="default"
              type="primary"
              onClick={() => editLibrary(0)}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              Novo material
            </Button>
          )}
      </Row>
    </div>
  )
}

MaterialsHeader.propTypes = {
  editLibrary: PropTypes.func,
  ownerProfile: PropTypes.string,
  userPermissions: PropTypes.array,
  setSearchValues: PropTypes.func,
  startSearch: PropTypes.func,
  searchOptions: PropTypes.array,
}
