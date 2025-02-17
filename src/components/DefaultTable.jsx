import { Table } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'

export default function DefaultTable({
  id,
  columns,
  dataSource,
  rowSelection,
  loading,
  size,
  ...rest
}) {
  return (
    <Table
      size={size || 'middle'}
      id={id}
      rowSelection={rowSelection}
      columns={columns}
      loading={loading}
      dataSource={dataSource}
      pagination={{
        showSizeChanger: true,
        locale: {
          items_per_page: '',
        },
        defaultPageSize: 30,
        pageSizeOptions: ['30', '50', '100'],
        defaultCurrent: 1,
        showTotal: (total, range) =>
          `${range[0]} - ${range[1]} de ${total} itens`,
      }}
      {...rest}
    />
  )
}

DefaultTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  dataSource: PropTypes.array,
  id: PropTypes.string,
  isDesktop: PropTypes.bool,
  loading: PropTypes.bool,
  rowSelection: PropTypes.object,
  size: PropTypes.string,
}
