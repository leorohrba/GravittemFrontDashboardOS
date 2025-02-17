/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react'
import { apiCRM } from '@services/api'
import { Button, Modal, Row, Col, message, Spin } from 'antd'
import SyncChat from '@components/modals/WhatsAppModal/components/SyncChat'
import PropTypes from 'prop-types'
import {
  handleAuthError,
  formatPhone,
  formatCellPhone,
  hasPermission,
  removeMask,
  formatCnpjCpf,
} from '@utils'
import styles from '@pages/CRM/styles.css'
import moment from 'moment'
import ReactExport from 'react-data-export'
import ContactsModalTable from './ContactsModalTable'
import PersonContactForm from '../PersonForm/components/PersonContactForm'
import { notNullUndefined } from '@utils/generics'

const { ExcelFile } = ReactExport
const { ExcelSheet } = ExcelFile

const bgColor = 'FFF86B00'
const fgColor = 'white'

export default function ContactsModal({
  setModalVisible,
  modalVisible,
  person,
  userPermissions,
}) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [dataExport, setDataExport] = useState([])
  const [owner, setOwner] = useState({})
  const [keyTable, setKeyTable] = useState(0)
  const [showPersonContactForm, setShowPersonContactForm] = useState(false)
  const [showWhatsappModal, setShowWhatsappModal] = useState(false)
  const [personContact, setPersonContact] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [dataSourceTable, setDataSourceTable] = useState([])
  useEffect(() => {
    getOwner()
  }, [])

  useEffect(() => {
    if (modalVisible) {
      getContacts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible, person])

  function setDataContactsTable(dataRecebida) {
    setDataSourceTable(
      dataRecebida.filter(el => {
        return el.contactName !== null || ''
      }),
    )
  }
  const formatValue = (value, bold, width) => {
    const result = {
      value,
      style: {
        font: { color: { rgb: fgColor }, bold },
        fill: {
          patternType: 'solid',
          fgColor: { rgb: bgColor },
        },
      },
    }

    return result
  }

  const formatColumn = (title, wpx) => {
    return { title, width: { wpx } }
  }
  useEffect(() => {
    const source = [
      {
        ySteps: -1,
        columns: [],
        data: [
          [
            '',
            '',
            `Usuário: ${owner?.userName} - ${moment().format(
              'DD/MM/YYYY HH:mm:ss',
            )}`,
          ],
        ],
      },
      {
        columns: [],
        data: [
          [formatValue('Contatos do cliente:'), formatValue(person?.shortName)],
        ],
      },
      {
        columns: [
          formatColumn('', 130),
          formatColumn('', 130),
          formatColumn('', 100),
          formatColumn('', 100),
          formatColumn('', 90),
          formatColumn('', 100),
        ],
        data: [
          [
            formatValue('Nome', true),
            formatValue('E-mail', true),
            formatValue('Telefone', true),
            formatValue('Celular', true),
            formatValue('Cargo', true),
            formatValue('CPF', true),
          ],
        ],
      },
    ]

    data
      .filter(x => x.isActive)
      .map(p =>
        source[2].data.push([
          p.contactName,
          p.email,
          formatPhone(p.phone),
          formatCellPhone(p.cellPhone),
          p.role,
          formatCnpjCpf(p.documentCPF),
        ]),
      )

    setDataExport(source)
  }, [data, person, owner])

  async function getOwner() {
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/owner`,
      })
      const { data } = response
      if (data.isOk) {
        setOwner(data)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      handleAuthError(error)
    }
  }

  async function getContacts() {
    setLoading(true)
    try {
      const response = await apiCRM({
        method: 'GET',
        url: `/api/crm/personContact`,
        params: { personId: person?.personId || 0 },
      })
      setLoading(false)
      const { data } = response
      if (data.isOk && notNullUndefined(data.personContact)) {
        setData(data.personContact)
        setDataContactsTable(data.personContact)
        setKeyTable(keyTable + 1)
      } else {
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  function syncWhatsapp(contactId) {
    if (contactId === -1) {
      setPersonContact(null)
      setShowPersonContactForm(true)
    } else {
      const contact = data.find(x => x.contactId === contactId)

      if (contact) {
        setPersonContact(contact)
        setShowWhatsappModal(true)
      }
    }
  }

  function editContact(contactId) {
    if (contactId === 0) {
      setPersonContact(null)
      setShowPersonContactForm(true)
    } else {
      const contact = data.find(x => x.contactId === contactId)
      setPersonContact(contact)
    }
    setShowPersonContactForm(true)
  }

  function closePersonContactForm() {
    setShowPersonContactForm(false)
  }

  async function savePersonContactForm(contactToSave) {
    const personContactBody = {
      personContact: {
        personId: person?.personId || 0,
        contactName: contactToSave.contactName,
        isActive: contactToSave.isActive,
        role: contactToSave.role,
        emailId: contactToSave.emailId,
        email:
          contactToSave.email === null
            ? null
            : contactToSave.email.toLowerCase(),
        phoneId: contactToSave.phoneId,
        phone: removeMask(contactToSave.phone),
        cellPhoneId: contactToSave.cellPhoneId,
        DocumentCPF: contactToSave.documentCPF || '',
        cellPhone: removeMask(contactToSave.cellPhone),
      },
    }
    setIsSaving(true)
    try {
      const response = await apiCRM({
        method: 'POST',
        url: `/api/crm/personContact`,
        data: personContactBody,
        headers: { 'Content-Type': 'application/json' },
      })
      setIsSaving(false)
      const { data } = response
      if (!data.isOk) {
        if (data.validationMessageList.length > 0) {
          message.error(data.validationMessageList[0])
        } else {
          message.error(data.message)
        }
      } else {
        setShowPersonContactForm(false)
        getContacts()
      }
    } catch (error) {
      setIsSaving(false)
      handleAuthError(error)
    }
  }

  return (
    <React.Fragment>
      {showPersonContactForm && (
        <PersonContactForm
          show={showPersonContactForm}
          personContact={personContact}
          closePersonContactForm={closePersonContactForm}
          savePersonContactForm={savePersonContactForm}
          canBeUpdated={hasPermission(userPermissions, 'Include')}
          isSaving={isSaving}
        />
      )}
      <React.Fragment>
        <SyncChat
          isModalOpen={showWhatsappModal}
          setIsModalOpen={setShowWhatsappModal}
          entityId={personContact?.guidPersonId}
          person={personContact}
        />
      </React.Fragment>
      <Modal
        title="Informações de contato"
        visible={modalVisible}
        width="950px"
        centered
        destroyOnClose
        onCancel={() => setModalVisible(false)}
        footer={
          <Row type="flex">
            <Col className="ml-auto">
              <Button
                type="secondary"
                key="back"
                onClick={() => setModalVisible(false)}
              >
                Fechar
              </Button>
            </Col>
          </Row>
        }
        zIndex={900}
      >
        <Spin spinning={loading} size="large">
          <Row type="flex" className="mb-2" gutter={12}>
            <Col
              style={{
                display: hasPermission(userPermissions, 'Include')
                  ? 'block'
                  : 'none',
              }}
            >
              <Button onClick={() => editContact(0)} type="primary">
                <i className="fa fa-plus mr-3" />
                Novo contato
              </Button>
            </Col>
            <Col
              className="ml-auto"
              style={{
                display: hasPermission(userPermissions, 'ExportExcel')
                  ? 'block'
                  : 'none',
              }}
            >
              <ExcelFile
                filename={`Contatos_${moment().format('DD_MM_YYYY')}_`}
                element={
                  <Button>
                    <i
                      className={`fa fa-download fa-lg mr-3 ${styles.crmColorIconEdit}`}
                    />
                    Exportar
                  </Button>
                }
              >
                <ExcelSheet dataSet={dataExport} name="Contatos" />
              </ExcelFile>
            </Col>
          </Row>
          <ContactsModalTable
            {...{
              loading,
              dataSourceTable,
              keyTable,
              editContact,
              syncWhatsapp,
            }}
            canBeUpdated={hasPermission(userPermissions, 'Alter')}
          />
        </Spin>
      </Modal>
    </React.Fragment>
  )
}

ContactsModal.propTypes = {
  setModalVisible: PropTypes.func,
  modalVisible: PropTypes.bool,
  person: PropTypes.any,
  userPermissions: PropTypes.array,
}
