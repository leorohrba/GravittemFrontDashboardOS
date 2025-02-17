/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-param-reassign */
import SyncChat from '@components/modals/WhatsAppModal/components/SyncChat'
import React, { useState } from 'react'
import DefaultTable from '@components/DefaultTable'
import { Tooltip, Button, Row, Col, Modal, Badge } from 'antd'
import { formatPhone, formatCellPhone } from '@utils'
import styles from '@pages/CRM/styles.css'
import PropTypes from 'prop-types'
import PersonContactForm from './PersonContactForm'

export default function PersonContactTable({
  editData,
  loadingForm,
  canBeUpdated,
  contactDataSource,
  setContactDataSource,
  selectedRowKeysContact,
  setSelectedRowKeysContact,
  setRefresh,
}) {
  const [showWhatsappModal, setShowWhatsappModal] = useState(false)
  const [showPersonContactForm, setShowPersonContactForm] = useState(false)
  const [personContact, setPersonContact] = useState(null)
  const [keyContact, setKeyContact] = useState(1)
  const [keyContactForm, setKeyContactForm] = useState(1)

  const contactColumns = [
    {
      title: 'Nome',
      dataIndex: 'contactName',
      render: (text, record) => (
        <div>
          <i
            className={`mr-1 fa fa-user fa-fw ${styles.crmColorIconPersonGrid}`}
          />
          {record.contactName}
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
      title: 'Status do contato',
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
              onClick={() => syncWhatsapp(record.key)}
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
              onClick={() => editPersonContact(record.key)}
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

  const rowSelectionContact = {
    selectedRowKeysContact,
    onChange: selectedRowKeys => onSelectChangeContact(selectedRowKeys),
    getCheckboxProps: record => ({
      disabled:
        record.emailId > 0 || record.phoneId > 0 || record.cellPhoneId > 0, // Column configuration not to be checked
    }),
  }

  const onSelectChangeContact = selectedRowKeys => {
    setSelectedRowKeysContact(selectedRowKeys)
  }

  function editPersonContact(key) {
    if (key === -1) {
      setPersonContact(null)
      setShowPersonContactForm(true)
      setKeyContactForm(keyContactForm + 1)
    } else {
      const contact = contactDataSource.find(x => x.key === key)
      if (contact) {
        setPersonContact(contact)
        setShowPersonContactForm(true)
        setKeyContactForm(keyContactForm + 1)
      }
    }
  }
  function syncWhatsapp(key) {
    if (key === -1) {
      setPersonContact(null)
      setShowPersonContactForm(true)
    } else {
      const contact = contactDataSource.find(x => x.key === key)
      if (contact) {
        setPersonContact(contact)
        setShowWhatsappModal(true)
      }
    }
  }

  function closePersonContactForm() {
    setShowPersonContactForm(false)
  }

  function savePersonContactForm(contactToSave) {
    let key = -1

    for (let i = 0; i < contactDataSource.length; i++) {
      if (
        contactDataSource[i].key === contactToSave.key &&
        contactToSave.key !== -1
      ) {
        contactDataSource[i] = contactToSave
        setContactDataSource(contactDataSource)
        break
      }

      if (contactToSave.key === -1 && contactDataSource[i].key > key) {
        key = contactDataSource[i].key
      }
    }
    if (contactToSave.key === -1) {
      key++
      contactToSave.key = key
      contactDataSource.push(contactToSave)
      setContactDataSource([...contactDataSource])
    }

    setShowPersonContactForm(false)
    setKeyContact(keyContact + 1)
  }

  function confirmDeletePersonContacts() {
    Modal.confirm({
      content:
        selectedRowKeysContact.length === 1
          ? 'Você tem certeza que deseja excluir o contato selecionado?'
          : 'Você tem certeza que deseja excluir os contatos selecionados?',
      title: 'Atenção',
      okText: 'Sim',
      okType: 'danger',
      cancelText: 'Não',
      onOk: () => {
        deletePersonContacts()
      },
    })
  }

  function deletePersonContacts() {
    selectedRowKeysContact.map(selectedRowKey => {
      const i = contactDataSource.findIndex(x => x.key === selectedRowKey)
      if (i > -1) {
        contactDataSource.splice(i, 1)
      }
      return true
    })

    setSelectedRowKeysContact([])
    setContactDataSource([...contactDataSource])
    setKeyContact(keyContact + 1)
  }

  return (
    <React.Fragment>
      <Row>
        <h2>Contatos do cliente</h2>
        <hr />
      </Row>

      <Row type="flex" className="mb-4" gutter={12}>
        <Col
          style={{
            display: selectedRowKeysContact.length === 0 ? 'block' : 'none',
          }}
        >
          <Button
            type="primary"
            disabled={loadingForm || !canBeUpdated}
            onClick={() => editPersonContact(-1)}
          >
            <i className="fa fa-plus fa-lg mr-3" />
            Novo contato
          </Button>
        </Col>
        <Col
          style={{
            display: selectedRowKeysContact.length > 0 ? 'block' : 'none',
          }}
        >
          <Button
            type="outline"
            onClick={() => confirmDeletePersonContacts()}
            disabled={loadingForm || !canBeUpdated}
            style={{
              color: '#D32F2F',
              border: '1px solid #D32F2F',
            }}
          >
            <i
              className="fa fa-trash fa-lg mr-3"
              size="default"
              style={{
                color: '#D32F2F',
              }}
            />
            {`Excluir (${selectedRowKeysContact.length})`}
          </Button>
        </Col>
      </Row>

      <DefaultTable
        rowKey={record => record.key}
        loading={loadingForm}
        rowSelection={rowSelectionContact}
        columns={contactColumns}
        dataSource={contactDataSource}
        key={keyContact}
      />

      <React.Fragment>
        <SyncChat
          isModalOpen={showWhatsappModal}
          setIsModalOpen={setShowWhatsappModal}
          entityId={editData?.guidPersonId}
          person={personContact}
          getChats={() => setRefresh(refresh => refresh + 1)}
        />
      </React.Fragment>
      <React.Fragment>
        <PersonContactForm
          show={showPersonContactForm}
          personContact={personContact}
          closePersonContactForm={closePersonContactForm}
          savePersonContactForm={savePersonContactForm}
          canBeUpdated={canBeUpdated}
          isSaving={false}
          key={keyContactForm}
        />
      </React.Fragment>
    </React.Fragment>
  )
}

PersonContactTable.propTypes = {
  loadingForm: PropTypes.bool,
  canBeUpdated: PropTypes.bool,
  contactDataSource: PropTypes.array,
  setContactDataSource: PropTypes.func,
  selectedRowKeysContact: PropTypes.array,
  setSelectedRowKeysContact: PropTypes.func,
}
