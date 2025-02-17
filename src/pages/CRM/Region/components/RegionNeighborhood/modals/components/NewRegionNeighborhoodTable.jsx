import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'

export default function NewRegionNeighborhoodTable(
  { data, 
    rowSelection,
    keyTable,    
  }) {
    
  const columns = [
    {
      title: 'Bairro',
      dataIndex: 'bairro',
      sorter: (a, b) => customSort(a.bairro, b.bairro),
    },
    {
      title: 'Município',
      dataIndex: 'municipioNome',
      sorter: (a, b) => customSort(a.municipioNome, b.municipioNome),
    },
    {
      title: 'Estado',
      dataIndex: 'estadoSigla',
      sorter: (a, b) => customSort(a.estadoSigla, b.estadoSigla),
    },
  ]

  return (
    <DefaultTable
      className="mt-5"
      dataSource={data}
      columns={columns}
      rowKey={record => record.key}
      rowSelection={rowSelection}
      key={keyTable}
    />
  )
}

NewRegionNeighborhoodTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
}
