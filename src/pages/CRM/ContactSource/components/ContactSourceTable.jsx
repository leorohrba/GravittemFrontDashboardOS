import DefaultTable from '@components/DefaultTable'
import { hasPermission, customSort } from '@utils'
import { Button, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'

export default function ContactSourceTable(
  { data, 
    rowSelection,
    editContactSource,  
    keyTable,    
    userPermissions,
    loading,
  }) {
    
  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      sorter: (a, b) => customSort(a.descricao, b.descricao),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <Tooltip placement="top" title={formatMessage({ id: hasPermission(userPermissions, 'Alter') ? 'edit' : 'query' })}>
          <Button
            className="iconButton"
            shape="circle"
            type="primary"
            ghost
            onClick={() => {
              editContactSource(d.id)
            }}
          >
            <i className={`fa fa-${hasPermission(userPermissions, 'Alter') ? 'pencil' : 'search'} fa-lg`} />
          </Button>
        </Tooltip>
      ),
    },
  ]

  return (
   <div> 
    {(data?.length === 0 && !loading) ? (
      <div className="text-center" style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
        <i
          className="fa fa-exclamation-circle fa-3x m-5"
          aria-hidden="true"
        />
        <h3>
          Não há dados aqui. Para cadastrar clique em <b>Nova origem de contato</b>
        </h3>
      </div>
     ) : (
      <DefaultTable
        className="mt-5"
        dataSource={data}
        columns={columns}
        rowKey={record => record.id}
        rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
        key={keyTable}
      />
    )}  
  </div>  
  )
}

ContactSourceTable.propTypes = {
  data: PropTypes.array,
  rowSelection: PropTypes.any,
  editContactSource: PropTypes.func,
  keyTable: PropTypes.number,
  userPermissions: PropTypes.array,
  loading: PropTypes.bool,
}
