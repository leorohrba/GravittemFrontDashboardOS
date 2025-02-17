import React, { SetStateAction } from 'react'
import { useDiscountAllowanceContext } from '../context/DiscountAllowanceContext'
import DefaultTable from '@components/DefaultTable'
import { Spin, Button } from 'antd'
import styles from '@pages/CRM/styles.css'
import { IFranchiseeVendor } from '@interfaces/CRM/DiscountAllowance/FranchiseeVendorInterface'

export default function DiscountAllowanceTable() {
  const {
    rowSelection,
    tableData,
    loadingTableData,
    serverColumns,
    setEditData,
    canAddItem,
  } = useDiscountAllowanceContext()

  const columns = [
    ...serverColumns,
    {
      title: '',
      align: 'right',
      render: (d: SetStateAction<IFranchiseeVendor>) => (
        <Button onClick={() => setEditData(d)}>
          <i className={`fa fa-${!canAddItem ? 'pencil' : 'search'} fa-lg`} />
        </Button>
      ),
    },
  ]

  return (
    <div className="mx-3">
      <Spin spinning={loadingTableData}>
        <DefaultTable
          columns={columns}
          dataSource={tableData}
          rowKey={record => record.key}
          rowSelection={rowSelection}
        />
      </Spin>
    </div>
  )
}
