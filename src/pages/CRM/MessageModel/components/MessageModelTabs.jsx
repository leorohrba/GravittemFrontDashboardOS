import DefaultTable from '@components/DefaultTable'
import { Button, Tabs, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import { hasPermission, customSort } from '@utils'
import React from 'react'

const { TabPane } = Tabs

export default function MessageModelTabs({
  folders,
  rowSelection,
  editFolder,
  editModel,
  userPermissions,
  confirmDeleteFolder,
  selectedRows,
  confirmDeleteModels,
  keyTable,
  onSelectModel,
}) {
  const columns = [
    {
      title: 'Nome',
      key: 'name',
      dataIndex: 'name',
      render: (text,record) => (
         <React.Fragment>
           {onSelectModel === undefined ? (
             <span>{text}</span>
           ) : (
             <span
               role="button"
               className="cursor-pointer primary-color"
               onClick={() => onSelectModel(record)}
             >
              {text}
             </span>  
           )}               
         </React.Fragment>
      ),
      sorter: (a, b)  => customSort(a.name, b.name),
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      render: d => (
        <React.Fragment>
          <Tooltip placement="top" title={hasPermission(userPermissions, 'Alter') && d.canBeUpdated ? 'Editar' : 'Consultar'}>
            <Button
              onClick={() => editModel(d.messageModelFolderEmailId, d.messageModelItemEmailId)}
              shape="circle"
              type="primary"
              className="iconButton"
              ghost
              size="default"
            >
              <i className={`fa fa-${hasPermission(userPermissions, 'Alter') && d.canBeUpdated ? 'pencil' : 'search'} fa-lg`} />
            </Button>
          </Tooltip>
        </React.Fragment>
      ),
    },
  ]

  const onEdit = (targetKey, action) => {
    if (action === 'add' && hasPermission(userPermissions, 'Include')) {
      editFolder(0)
    } else if (action === 'remove') {
      confirmDeleteFolder(parseInt(targetKey, 10))
    }
  }

  return (
    <Tabs 
      type="editable-card" 
      onEdit={onEdit} 
      className="mt-5"
    >
      {folders.map(d => (
        <TabPane 
          tab={d.name} 
          key={d.messageModelFolderEmailId}
          closable={hasPermission(userPermissions, 'Exclude') && d.canBeUpdated}
        >
          {selectedRows.length === 0 && hasPermission(userPermissions, 'Include') && (
            <React.Fragment>
              <Button
                type="primary"
                ghost
                className="mr-2"
                onClick={() => editModel(d.messageModelFolderEmailId, 0)}
              >
                <i className="fa fa-plus fa-lg mr-3" />
                Novo modelo de mensagem
              </Button>
              {d.canBeUpdated && (
                <Button onClick={() => editFolder(d.messageModelFolderEmailId)} className="iconButton">
                  <i className="fa fa-pencil fa-lg mr-3" /> Editar
                </Button>
              )}
            </React.Fragment>
          )}  
          {selectedRows.length > 0 && hasPermission(userPermissions, 'Exclude') && (
            <React.Fragment>
              <Button
                className="mr-2"
                style={{ color: 'red' }}
                onClick={() => confirmDeleteModels()}
              >
                <i className="fa fa-trash fa-lg mr-3" />
                {`Excluir (${selectedRows.length})`}
              </Button>
            </React.Fragment>
          )}  
          <DefaultTable
            className="mt-5"
            dataSource={d.items}
            columns={columns}
            rowSelection={hasPermission(userPermissions, 'Exclude') ? rowSelection : undefined}
            rowKey={record => record.messageModelItemEmailId}
            pagination={false}
            key={keyTable}
          />
        </TabPane>
      ))}
    </Tabs>
  )
}

MessageModelTabs.propTypes = {
  folders: PropTypes.array,
  rowSelection: PropTypes.any,
  editFolder: PropTypes.func,
  editModel: PropTypes.func,
  userPermissions: PropTypes.array,
  confirmDeleteFolder: PropTypes.array,
  selectedRows: PropTypes.array,
  keyTable: PropTypes.number,
  confirmDeleteModels: PropTypes.func,
  onSelectModel: PropTypes.func,
}
