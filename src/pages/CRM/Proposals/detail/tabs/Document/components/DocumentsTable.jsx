import Button from '@components/Button'
import DefaultTable from '@components/DefaultTable'
import { Tooltip } from 'antd'
import React from 'react'
import { formatMessage } from 'umi-plugin-react/locale'
import { useDocumentsContext } from '../contexts/Documents'
import SmallTableFieldDescription from '@components/SmallTableFieldDescription'

export default function DocumentsTable({ documentsData, canInclude }) {
  const { showDocumentsModal, rowSelection } = useDocumentsContext()

  const documentsColumns = [
    {
      title: 'Número',
      dataIndex: 'codigo',
      key: 'codigo',
    },
    {
      title: 'Tipo',
      key: 'tipoDescricao',
      render: record => (
        <React.Fragment>
          <div>{record.tipoDescricao}</div>
          {record.documentoExterno && (
            <SmallTableFieldDescription
              label="Documento externo"
              fontStyle="italic"
            />
          )}
        </React.Fragment>
      ),
    },
    {
      align: 'right',
      title: '',
      render: data =>
        canInclude && (
          <Tooltip
            placement="top"
            title={formatMessage({
              id: 'edit',
            })}
          >
            <Button
              id="button-codigo-edit"
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton"
              onClick={e => showDocumentsModal(data)}
            >
              <i className="fa fa-pencil fa-lg" />
            </Button>
          </Tooltip>
        ),
    },
  ]
  return (
    <DefaultTable
      rowSelection={rowSelection}
      rowKey={record => record.key}
      columns={documentsColumns}
      dataSource={documentsData}
    />
  )
}
