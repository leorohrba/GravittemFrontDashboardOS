import DefaultTable from '@components/DefaultTable'
import { Transfer } from 'antd'
import { difference } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'

const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer {...restProps} showSelectAll>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns

      const rowSelection = {
        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter(item => !item.disabled)
            .map(({ key }) => key)
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys)
          onItemSelectAll(diffKeys, selected)
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected)
        },
        selectedRowKeys: listSelectedKeys,
      }

      return (
        <DefaultTable
          rowSelection={rowSelection}
          pagination={{
            showSizeChanger: true,
            locale: {
              items_per_page: '',
            },
            pageSize: 10,
            pageSizeOptions: ['10', '30', '50'],
            defaultCurrent: 1,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} de ${total} itens`,
          }}
          columns={columns}
          dataSource={filteredItems}
          style={{ pointerEvents: listDisabled ? 'none' : null }}
          onRow={({ key, disabled: itemDisabled }) => ({
            onClick: () => {
              if (itemDisabled || listDisabled) return
              onItemSelect(key, !listSelectedKeys.includes(key))
            },
          })}
        />
      )
    }}
  </Transfer>
)

TableTransfer.propTypes = {
  leftColumns: PropTypes.array,
  rightColumns: PropTypes.array,
}

export default TableTransfer
