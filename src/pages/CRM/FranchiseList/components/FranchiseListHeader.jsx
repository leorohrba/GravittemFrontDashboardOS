import Button from '@components/Button'
import PropTypes from 'prop-types'
import React from 'react'
import router from 'umi/router'
import { hasPermission } from '@utils'

export default function FranchiseListHeader({
  selectedRowKeys,
  setSelectedRowKeys,
  userPermissions,
  confirmDeleteFranchiseLists,
}) {
  return (
    <div>
      {selectedRowKeys.length === 0 ? (
        <React.Fragment>
         {hasPermission(userPermissions, 'Include') && (
          <Button
            size="default"
            type="primary"
            onClick={() => router.push(`/CRM/FranchiseList/FranchiseListForm`)}
          >
            <i className="fa fa-plus fa-lg mr-3" />
            Nova lista
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
          onClick={() => confirmDeleteFranchiseLists()}
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

FranchiseListHeader.propTypes = {
  setSelectedRowKeys: PropTypes.func,
  selectedRowKeys: PropTypes.array,
  userPermissions: PropTypes.array,
  confirmDeleteFranchiseLists: PropTypes.func,
}
