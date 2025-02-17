import DefaultTable from '@components/DefaultTable'
import { customSort } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'

export default function NewRegionZipCodeTable(
  { data, 
    rowSelection,
    keyTable,    
  }) {
    
  const columns = [
    {
      title: 'CEP',
      dataIndex: 'cep',
      sorter: (a, b) => customSort(a.cep, b.cep),
    },
    {
      title: 'Rua',
      dataIndex: 'rua',
      sorter: (a, b) => customSort(a.rua, b.rua),
      render: (text, d) => (<div>
                              <span>{text}</span>
                              {!!d.limite && (
                                <div>
                                  <span style={{ color: 'gray' }}>
                                    <small>{d.limite}</small>
                                  </span>
                                </div>
                              )}
                             </div>),   
    },
    {
      title: 'Bairro',
      dataIndex: 'bairro',
      sorter: (a, b) => customSort(a.bairro, b.bairro),
      render: (text, d) => (<div>
                              <span>{text}</span>
                              {!!d.lado && (
                                <div>
                                  <span style={{ color: 'gray' }}>
                                    <small>{d.lado}</small>
                                  </span>
                                </div>
                              )}
                             </div>),   
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
      rowKey={record => record.cepId}
      rowSelection={rowSelection}
      key={keyTable}
    />
  )
}

NewRegionZipCodeTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
}
