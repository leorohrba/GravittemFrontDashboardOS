import React from 'react'
import DefaultTable from '@components/DefaultTable'
import { customSort, hasPermission } from '@utils'
import { Button, Spin, Tooltip } from 'antd'
import { useProposalContext } from '../../Context/proposalContext'

const ProposalGrid = props => {
  const {
    userPermissions,
    proposals,
    loading,
    keyTable,
    serverColumns,
    loadingColumns,
    rowSelection,
    loadingOwnerProfile,
    openProposal,
    validateOwner,
  } = useProposalContext()

  const columns = [
    ...serverColumns,
    {
      title: '',
      key: 'operation',
      width: 60,
      fixed: 'right',
      render: (text, record) => {
        const isEditable =
          hasPermission(userPermissions, 'Alter') &&
          record.canBeUpdated &&
          validateOwner?.isOk
        const tooltipTitle = validateOwner?.isOk
          ? isEditable
            ? 'Editar informações'
            : 'Ver detalhes'
          : validateOwner?.message

        return (
          <Tooltip placement="top" title={tooltipTitle}>
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              disabled={!validateOwner?.isOk}
              onClick={() => openProposal(record.proposalId)}
              className={`iconButton ${
                !validateOwner?.isOk ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <i
                className={`fa fa-${isEditable ? 'pencil' : 'search'} fa-lg`}
              />
            </Button>
          </Tooltip>
        )
      },
    },
  ]

  // Fazer cópia das colunas 'default' para 'franchisees'
  const standardColumns = columns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  const index = standardColumns.findIndex(x => x.dataIndex === 'franchiseeName')
  if (index >= 0) {
    standardColumns.splice(index, 1)
    standardColumns.splice(index, 0, {
      title: 'Vendedor',
      dataIndex: 'sellerName',
      sorter: (a, b) => customSort(a.sellerName, b.sellerName),
    })
  }

  if (loadingOwnerProfile) {
    return (
      <Spin
        size="large"
        className="relative"
        style={{ left: '50%', marginTop: '10%' }}
      />
    )
  }

  return (
    <DefaultTable
      rowKey={record => record.proposalId}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={proposals}
      loading={loading || loadingColumns}
      key={keyTable}
      locale={{
        emptyText: (
          <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
            <i className="fa fa-search fa-3x m-5" aria-hidden="true" />
            <h3 className="my-2">
              Faça uma pesquisa para requisitar os dados.
            </h3>
          </div>
        ),
      }}
      sticky
    />
  )
}

export default ProposalGrid
