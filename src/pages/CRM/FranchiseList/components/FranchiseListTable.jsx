import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import { Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import router from 'umi/router'
import { customSort, hasPermission } from '@utils'

export default function FranchiseListTable({
  selectedRowKeys,
  setSelectedRowKeys,
  franchiseLists,
  keyTable,
  loading,
  userPermissions,
}) {

  const columns = [
    {
      title: 'Nome da lista',
      dataIndex: 'name',
      width: '90%',
      sorter: (a, b) => customSort(a.name, b.name),
    },
    {
      title: '',
      key: 'operation',
      width: '5%',
      render: (text, record) => (
        <div className="flex">
          <Tooltip placement="top" title={hasPermission(userPermissions, 'Alter') ? 'Editar' : 'Consultar'}>
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              onClick={() => router.push(`/CRM/FranchiseList/FranchiseListForm/${record.franchiseListId}`)}
              className="iconButton ml-4"
            >
              <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]
  const rowSelection = {
    onChange: (selectedRowKeysFromTable, selectedRowsFromTable) => {
      setSelectedRowKeys(selectedRowKeysFromTable)
    },
  }
  return (
    <div>
      <DefaultTable
        className="mt-5"
        rowKey={record => record.franchiseListId}
        rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
        columns={columns}
        dataSource={franchiseLists}
        key={keyTable}
        loading={loading}
      />
    </div>
  )
}

FranchiseListTable.propTypes = {
  setSelectedRowKeys: PropTypes.func,
  selectedRowKeys: PropTypes.array,
  franchiseLists: PropTypes.array,
  keyTable: PropTypes.number,
  loading: PropTypes.bool,
  userPermissions: PropTypes.array,
}
