/* eslint-disable react-hooks/exhaustive-deps  */
import { Button, Tooltip, Badge } from 'antd'
import React from 'react'
import DefaultTable from '@components/DefaultTable'
import { formatCellPhone, formatPhone, formatCnpjCpf } from '@utils'
import styles from '@pages/CRM/styles.css'
import PropTypes from 'prop-types'

export default function ContactsModalTable({
  dataSourceTable,
  keyTable,
  editContact,
  syncWhatsapp,
  canBeUpdated,
}) {
  const columns = [
    {
      title: 'Nome',
      dataIndex: 'contactName',
      render: (text, record) => (
        <div>
          <p className="mb-0">
            <i
              className={`mr-1 fa fa-user fa-fw ${styles.crmColorIconPersonGrid}`}
            />
            {record.contactName}
          </p>
          {record.documentCPF && (
            <small style={{ color: 'gray' }}>
              {`CPF: ${formatCnpjCpf(record.documentCPF)}`}
            </small>
          )}
        </div>
      ),
      width: '25%',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      width: '20%',
    },
    {
      title: 'Contato',
      dataIndex: '',
      render: (text, d) => (
        <React.Fragment>
          {d.phone && <span>{formatPhone(d.phone)}</span>}
          {d.phone && d.cellPhone && <br />}
          {d.cellPhone && <span>{formatCellPhone(d.cellPhone)}</span>}
        </React.Fragment>
      ),
      width: '15%',
    },
    {
      title: 'Cargo',
      dataIndex: 'role',
      width: '18%',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive, record) => (
        <span>
          <Badge
            status={isActive ? 'success' : 'error'}
            text={isActive ? 'Ativo' : 'Inativo'}
          />
        </span>
      ),
      width: '15%',
    },
    {
      title: '',
      dataIndex: '',
      render: (text, record) => (
        <div className="flex gap-3">
          <Tooltip placement="top" title="Sincronizar WhatsApp">
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton"
              onClick={() => syncWhatsapp(record.contactId)}
            >
              <i
                className={`fa fa-whatsapp fa-lg ${styles.crmColorIconEdit}`}
              />
            </Button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={canBeUpdated ? 'Editar' : 'Consultar'}
          >
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              className="iconButton"
              onClick={() => editContact(record.contactId)}
            >
              <i
                className={
                  canBeUpdated
                    ? `fa fa-pencil fa-lg ${styles.crmColorIconEdit}`
                    : `fa fa-search fa-lg ${styles.crmColorIconEdit}`
                }
              />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  return (
    <DefaultTable
      size="small"
      rowKey={record => record.contactId}
      columns={columns}
      dataSource={dataSourceTable}
      key={keyTable}
    />
  )
}

ContactsModalTable.propTypes = {
  keyTable: PropTypes.number,
  syncWhatsapp: PropTypes.func,
  editContact: PropTypes.func,
  canBeUpdated: PropTypes.bool,
}
