import Button from '@components/Button'
import { hasPermission } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'

export default function TasksHeader({
  tableSelectedRowKeys,
  setTableSelectedRowKeys,
  proposalCanBeUpdate,
  editTask,
  userPermissions,
  confirmDeleteTasks,
}) {
  return (
    <div>
      {tableSelectedRowKeys.length === 0 ? (
        <React.Fragment>
          {hasPermission(userPermissions, 'Include') && proposalCanBeUpdate && (
            <Button size="default" type="primary" onClick={() => editTask(0)}>
              <i className="fa fa-plus fa-lg mr-3" />
              Nova tarefa
            </Button>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {hasPermission(userPermissions, 'Exclude') && proposalCanBeUpdate && (
            <Button
              quantity={tableSelectedRowKeys.length}
              id="button-delete-account-plan"
              type="outline"
              onClick={() => confirmDeleteTasks()}
              ghost
              style={{
                color: '#D32F2F',
                border: '1px solid #D32F2F',
              }}
            >
              <i
                className="fa fa-trash fa-lg mr-3"
                size="default"
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

TasksHeader.propTypes = {
  setTableSelectedRowKeys: PropTypes.func,
  tableSelectedRowKeys: PropTypes.array,
  proposalCanBeUpdate: PropTypes.bool,
  editTask: PropTypes.func,
  userPermissions: PropTypes.array,
  confirmDeleteTasks: PropTypes.func,
}
