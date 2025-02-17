import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import styles from '@pages/CRM/styles.css'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { customSort, hasPermission } from '@utils'

export default function CallTypeTable({
  selectedRowKeys,
  setSelectedRowKeys,
  callTypes,
  loading,
  userPermissions,
  editCallType,
  keyTable,
}) {

  const columns = [
    {
      title: 'Tipo de chamado',
      dataIndex: 'name',
      width: '90%',
      sorter: (a, b) => customSort(a.name, b.name),
    },
    {
      title: '',
      key: 'operation',
      width: '5%',
      render: (text, record) => (
       <React.Fragment>
       {record.canBeUpdated && hasPermission(userPermissions, 'Alter')  && (
        <div className="flex">
          <Tooltip placement="top" title="Editar">
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              onClick={() => editCallType(record.callTypeId)}
              className="iconButton ml-2"
            >
              <i className={`fa fa-pencil fa-lg ${styles.crmColorIconEdit}`} />
            </Button>
          </Tooltip>
        </div>
       )}
       </React.Fragment>
      ),
    },
  ]
  const rowSelection = {
    onChange: (selectedRowKeysFromTable, selectedRowsFromTable) => {
      setSelectedRowKeys(selectedRowKeysFromTable)
    },
    getCheckboxProps: record => ({
      disabled: !record.canBeDeleted, // Column configuration not to be checked
    }),
  }
  
  return (
    <div>
      <DefaultTable
        className="mt-5"
        rowKey={record => record.callTypeId}
        rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
        columns={columns}
        dataSource={callTypes}
        loading={loading}
        key={keyTable}
      />
    </div>
  )
}

CallTypeTable.propTypes = {
  setSelectedRowKeys: PropTypes.func,
  selectedRowKeys: PropTypes.array,
  callTypes: PropTypes.array,
  loading: PropTypes.bool,
  userPermissions: PropTypes.array,
  editCallType: PropTypes.func,
  keyTable: PropTypes.number,
}
