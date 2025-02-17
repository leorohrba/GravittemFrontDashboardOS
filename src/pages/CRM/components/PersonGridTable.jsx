import DefaultTable from '@components/DefaultTable'
import styles from '@pages/CRM/styles.css'
import { hasPermission } from '@utils'
import { Button, Row, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import ContactsModal from './ContactsModal'

export default function PersonGridTable(props) {
  const {
    rowSelection,
    loadingPeople,
    people,
    ownerProfile,
    userPermissions,
    openPerson,
    serverColumns,
    loadingColumns,
  } = props

  const [person, setPerson] = useState({})
  const [modalVisible, setModalVisible] = useState(false)

  const defaultColumns = [
    ...serverColumns,
    {
      title: '',
      dataIndex: '',
      width: 90,
      fixed: 'right',
      render: (text, record) => (
        <Row>
          <Tooltip placement="top" title="Contatos">
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              onClick={() => openContacts(record)}
              className="iconButton mr-2"
            >
              <i className={`fa fa-lg fa-user ${styles.crmColorIconEdit}`} />
            </Button>
          </Tooltip>
          <Tooltip
            placement="top"
            title={
              record.canBeUpdated && hasPermission(userPermissions, 'Alter')
                ? 'Editar'
                : 'Consultar'
            }
          >
            <Button
              shape="circle"
              size="default"
              type="primary"
              ghost
              onClick={() => openPerson(record.personId)}
              className="iconButton"
            >
              <i
                className={
                  record.canBeUpdated && hasPermission(userPermissions, 'Alter')
                    ? `fa fa-pencil fa-lg ${styles.crmColorIconEdit}`
                    : `fa fa-search fa-lg ${styles.crmColorIconEdit}`
                }
              />
            </Button>
          </Tooltip>
        </Row>
      ),
    },
  ]

  // Copia o objeto
  const standardColumns = defaultColumns.map(a => {
    const newObject = {}
    Object.keys(a).forEach(propertyKey => {
      newObject[propertyKey] = a[propertyKey]
    })
    return newObject
  })

  // standardColumns[0].width = '27%' // aumenta tamanho da coluna Nome
  // standardColumns[1].width = '33%' // aumenta tamanho da coluna Endereço
  // standardColumns[2].width = '20%' // aumenta tamanho da coluna Contato

  // Elimina a coluna 'Franqueado Responsavel' e 'Franqueado'
  let i = standardColumns.findIndex(
    x => x.dataIndex === 'responsibleFranchiseeName',
  )
  if (i > -1) {
    standardColumns.splice(i, 1)
  }
  i = standardColumns.findIndex(x => x.dataIndex === 'isFranchisee')
  if (i > -1) {
    standardColumns.splice(i, 1)
  }

  const openContacts = person => {
    setPerson(person)
    setModalVisible(true)
  }

  return (
    <React.Fragment>
      {modalVisible && (
        <ContactsModal
          userPermissions={userPermissions}
          person={person}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}

      {!ownerProfile ? (
        <div
          className="w-full text-center pt-10"
          style={{ display: loadingPeople ? 'block' : 'none' }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <DefaultTable
          rowKey={record => record.personId}
          loading={loadingPeople || loadingColumns}
          rowSelection={
            hasPermission(userPermissions, 'Exclude') ||
            hasPermission(userPermissions, 'ExportExcel')
              ? rowSelection
              : undefined
          }
          columns={
            ownerProfile === 'Franchise' || ownerProfile === 'Standard'
              ? standardColumns
              : defaultColumns
          }
          dataSource={people}
          locale={{
            emptyText: (
              <div style={{ color: 'hsla(0, 0%, 0%, 0.45)' }}>
                <i className="fa fa-search fa-3x m-5" aria-hidden="true" />
                <h3 className="my-2">
                  Faça uma pesquisa para requisitar os dados.
                </h3>
              </div>
            ),
          }}
          scroll={{ x: 'max-content' }}
        />
      )}
    </React.Fragment>
  )
}

PersonGridTable.propTypes = {
  ownerProfile: PropTypes.string,
  people: PropTypes.array,
  loadingPeople: PropTypes.bool,
  userPermissions: PropTypes.array,
  rowSelection: PropTypes.func,
  openPerson: PropTypes.func,
}
