import DefaultTable from '@components/DefaultTable'
import { hasPermission, customSort } from '@utils'
import PropTypes from 'prop-types'
import React from 'react'

export default function RegionNeighborhoodTable(
  { data, 
    rowSelection,
    keyTable,    
    userPermissions,
    searchValue,
    loading,
  }) {
    
  const columns = [
    {
      title: 'Bairro',
      dataIndex: 'bairro',
      sorter: (a, b) => customSort(a.bairro, b.bairro),
      filteredValue: searchValue ?
                    [searchValue] : 
                    null,
      onFilter: (value, record) =>  value && (
                                   (record.bairro && record.bairro.toLowerCase().indexOf(value.toLowerCase()) >= 0) ||
                                   (record.municipioNome && record.municipioNome.toLowerCase().indexOf(value.toLowerCase()) >= 0) ||
                                   (record.estadoSigla && record.estadoSigla.toLowerCase().indexOf(value.toLowerCase()) >= 0) ||
                                   (record.estadoNome && record.estadoNome.toLowerCase().indexOf(value.toLowerCase()) >= 0) ||
                                   (record.paisNome && record.paisNome.toLowerCase().indexOf(value.toLowerCase()) >= 0) 
                                   ), 
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
    {
      title: 'País',
      dataIndex: 'paisNome',
      sorter: (a, b) => customSort(a.paisNome, b.paisNome),
    },
  ]

  return (
   <div> 
    {(data.length === 0 && !loading) ? (
      <div className="text-center" style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
        <i
          className="fa fa-exclamation-circle fa-3x m-5"
          aria-hidden="true"
        />
        <h3>
          Não há dados aqui. Para cadastrar clique em <b>Adicionar bairro/município</b>
        </h3>
      </div>
     ) : (
      <DefaultTable
        className="mt-5"
        dataSource={data}
        columns={columns}
        rowKey={record => record.regiaoBairroId}
        rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
        key={keyTable}
      />
    )}  
  </div>  
  )
}

RegionNeighborhoodTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  keyTable: PropTypes.number,
  userPermissions: PropTypes.array,
  searchValue: PropTypes.string,
  loading: PropTypes.bool,
}
