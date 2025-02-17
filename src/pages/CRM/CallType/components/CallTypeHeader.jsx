import Button from '@components/Button'
import { hasPermission } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'

export default function CallTypeHeader({
  selectedRowKeys,
  userPermissions,
  editCallType,
  confirmDeleteCallTypes,
}) {
  return (
    <div>
      {selectedRowKeys.length === 0 ? (
        <React.Fragment>
          {hasPermission(userPermissions, 'Include') && (
            <Button
              size="default"
              type="primary"
              onClick={() => editCallType(0)}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              Novo tipo de chamado
            </Button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {hasPermission(userPermissions, 'Exclude') && (
            <Button
              quantity={selectedRowKeys.length}
              id="button-delete-account-plan"
              type="outline"
              onClick={() => confirmDeleteCallTypes()}
              style={{
                color: '#D32F2F',
                border: '1px solid #D32F2F',
              }}
            >
              <i
                className="fa fa-trash fa-lg mr-3"
                size="default"
                ghost
                style={{
                  color: '#D32F2F',
                }}
              />
              Excluir
            </Button>
          )}
        </React.Fragment>
      )}
    </div>
  )
}

CallTypeHeader.propTypes = {
  selectedRowKeys: PropTypes.array,
  userPermissions: PropTypes.array,
  editCallType: PropTypes.func,
  confirmDeleteCallTypes: PropTypes.func,
}
