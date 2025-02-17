import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'
import { Tooltip } from 'antd'
import moment from 'moment'
import PropTypes from 'prop-types'
import React from 'react'
import { customSort, hasPermission } from '@utils'

export default function CallHistoryTable({
  selectedRowKeys,
  setSelectedRowKeys,
  data,
  selectValue,
  userPermissions,
  loading,
  keyTable,
  editCall,
  ownerProfile,
}) {
  const columns = [
    {
      title: 'Número',
      dataIndex: 'number',
      sorter: (a, b) => a.number - b.number,
    },
    {
      title: 'Franqueado',
      dataIndex: 'franchiseeName',
      render: (text, record) => (
        <Tooltip title={`Solicitante: ${record.requesterName}`}>
          <span>{text}</span>
        </Tooltip>
      ),
      sorter: (a, b) => customSort(a.franchiseeName, b.franchiseeName),
    },
    {
      title: 'Responsável',
      dataIndex: 'responsibleName',
      sorter: (a, b) => customSort(a.responsibleName, b.responsibleName),
    },
    {
      title: 'Tipo de chamado',
      dataIndex: 'callTypeName',
      sorter: (a, b) => customSort(a.callTypeName, b.callTypeName),
    },
    {
      title: 'Título',
      dataIndex: 'title',
      sorter: (a, b) => customSort(a.title, b.title),
    },
    {
      title: 'Data',
      dataIndex: 'callDate',
      render: date => moment(date).format('D MMM YYYY, HH:mm'),
      sorter: (a, b) => customSort(a.callDate, b.callDate),
    },
    {
      title: 'Status',
      dataIndex: 'actStatusDescription',
      sorter: (a, b) =>
        customSort(a.actStatusDescription, b.actStatusDescription),
      render: (text, record) => (
        <React.Fragment>
          <div>
            <span>{text}</span>
          </div>
          <i
            className="fa fa-exclamation-circle"
            aria-hidden="true"
            size="default"
          />
          {(record.actStatusCode === 'ABRT' ||
            record.actStatusCode === 'EAND') && (
            <SmallTableFieldDescription
              theme="filled"
              color={
                record.priority === 'High'
                  ? '#d32f2f'
                  : record.priority === 'Medium'
                  ? '#ffb300'
                  : '#3182ce'
              }
              fontSize="12px"
              label={`Prioridade ${record.priorityName}`}
              fontStyle="italic"
            />
          )}
        </React.Fragment>
      ),
    },
    {
      title: '',
      key: 'operation',
      render: (text, record) => (
        <div className="flex">
          <Tooltip
            placement="top"
            title={
              record.canBeUpdated && hasPermission(userPermissions, 'Alter')
                ? 'Editar'
                : 'Consultar'
            }
          >
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton ml-4"
              onClick={() => editCall(record.callId)}
            >
              <i
                className={`fa fa-${
                  record.canBeUpdated && hasPermission(userPermissions, 'Alter')
                    ? 'pencil'
                    : 'search'
                } fa-lg`}
              />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  // Fazer cópia das colunas 'default' para 'franchisees'
  const franchiseeColumns = columns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  const index = franchiseeColumns.findIndex(
    x => x.dataIndex === 'franchiseeName',
  )
  if (index >= 0) {
    franchiseeColumns.splice(index, 1)
    franchiseeColumns.splice(index, 0, {
      title: 'Solicitante',
      dataIndex: 'requesterName',
      sorter: (a, b) => customSort(a.requesterName, b.requesterName),
    })
  }

  const rowSelection = {
    onChange: (selectedRowKeysFromTable, selectedRowsFromTable) => {
      setSelectedRowKeys(selectedRowKeysFromTable)
    },
    getCheckboxProps: record => ({
      disabled: !record.canBeUpdated,
    }),
  }

  return (
    <div>
      <DefaultTable
        className="mt-5"
        rowKey={record => record.callId}
        rowSelection={
          ownerProfile &&
          ownerProfile !== 'Franchise' &&
          hasPermission(userPermissions, 'Alter')
            ? rowSelection
            : undefined
        }
        columns={ownerProfile === 'Franchise' ? franchiseeColumns : columns}
        dataSource={data}
        loading={loading}
        key={keyTable}
      />
    </div>
  )
}

CallHistoryTable.propTypes = {
  data: PropTypes.array,
  selectValue: PropTypes.string,
  setSelectedRowKeys: PropTypes.func,
  selectedRowKeys: PropTypes.array,
  userPermissions: PropTypes.array,
  loading: PropTypes.bool,
  keyTable: PropTypes.number,
  editCall: PropTypes.number,
  ownerProfile: PropTypes.string,
}
