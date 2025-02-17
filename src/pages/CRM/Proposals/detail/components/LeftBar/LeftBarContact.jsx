/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
import SyncChat from '@components/modals/WhatsAppModal/components/SyncChat'
import { apiCRM } from '@services/api'
import {
  formatCellPhone,
  formatPhone,
  handleAuthError,
  removeMask,
} from '@utils'
import { Avatar, Col, message, Row, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useCallback } from 'react'
import PersonContactForm from '../../../../PersonForm/components/PersonContactForm'

const colorList = ['#1976d2', '#4caf50', '#7265e6', '#ffbf00', '#00a2ae']

export default function LeftBarContact(props) {
  const {
    contacts,
    contact,
    index,
    personContactId,
    setProposalContactId,
    canBeUpdated,
    personId,
    onChange,
    isSavingProposal,
    proposalId,
    onChangeLeftBar,
  } = props
  const [showPersonContactForm, setShowPersonContactForm] = useState(false)
  const [personContact, setPersonContact] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    if (!contacts.find(x => x.isActive === false)) {
      setShowInactive(false)
    }
  }, [contacts])

  const handleClick = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  function editPersonContact(contactId) {
    if (contactId === 0) {
      setPersonContact(null)
      setShowPersonContactForm(true)
    } else {
      const contact = contacts.find(x => x.contactId === contactId)
      setPersonContact(contact)
    }

    setShowPersonContactForm(true)
  }

  function closePersonContactForm() {
    setShowPersonContactForm(false)
  }

  async function savePersonContactForm(contactToSave) {
    if (
      !contactToSave.isActive &&
      (contactToSave.phoneId === personContactId ||
        contactToSave.cellPhoneId === personContactId ||
        contactToSave.emailId === personContactId)
    ) {
      message.error(
        'Este contato não pode ficar inativo pois está vinculado ao negócio!',
      )
      return
    }

    const personContactBody = {
      personContact: {
        personId,
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
        if (onChange !== null && onChange !== undefined) {
          onChange()
        }
      }
    } catch (error) {
      setIsSaving(false)

      handleAuthError(error)
    }
  }

  return (
    <>
      <>
        {(contact.emailId === personContactId ||
          contact.phoneId === personContactId ||
          contact.cellPhoneId === personContactId ||
          contact.isActive ||
          (!contact.isActive && showInactive)) && (
          <Row key={index} type="flex" className="mt-5" align="top">
            <Col style={{ width: '13%' }}>
              {!contact.isMain && (
                <Avatar
                  style={{
                    backgroundColor:
                      (contact.emailId === personContactId ||
                        contact.phoneId === personContactId ||
                        contact.cellPhoneId === personContactId) &&
                      personContactId > 0
                        ? colorList[1]
                        : colorList[0],
                    verticalAlign: 'middle',
                  }}
                  className="mt-1"
                  size="large"
                >
                  <div style={{ marginTop: '-2px', marginLeft: '-1px' }}>
                    <button
                      disabled={
                        !canBeUpdated ||
                        !contact.isActive ||
                        !contact.contactName ||
                        isSavingProposal
                      }
                      className="ghostButton"
                      onClick={() => setProposalContactId(contact.contactId)}
                    >
                      {contact.contactName
                        ? contact.contactName[0].toUpperCase()
                        : '?'}
                    </button>
                  </div>
                </Avatar>
              )}
            </Col>
            <Col
              style={{ width: '78%' }}
              className={`ml-4 ${contact.isMain ? '' : 'mt-1'}`}
            >
              <Row type="flex" className="w-full">
                <Col style={{ width: '70%' }}>
                  <h4 style={{ color: !contact.isActive ? 'gray' : '' }}>
                    <Tooltip title={contact.role}>
                      {contact.isMain
                        ? 'Contato principal'
                        : contact.contactName}
                    </Tooltip>
                  </h4>
                </Col>
                {contact.cellPhone && (
                  <Col>
                    <button
                      className="linkButton"
                      onClick={handleClick}
                      hidden={!contact.cellPhone}
                    >
                      <i
                        className="fa fa-whatsapp"
                        style={{ color: 'gray' }}
                        aria-hidden="true"
                      />
                    </button>
                  </Col>
                )}
                <SyncChat
                  tableName="TPROPOSALS"
                  isModalOpen={isModalOpen}
                  setIsModalOpen={setIsModalOpen}
                  entityId={proposalId}
                  person={contact}
                  getChats={onChangeLeftBar}
                />
                {!contact.isMain && (
                  <Col>
                    <button
                      className="linkButton"
                      onClick={() => editPersonContact(contact.contactId)}
                    >
                      <Tooltip title={canBeUpdated ? 'Editar' : 'Consultar'}>
                        <i
                          className={`fa fa-${
                            canBeUpdated ? 'pencil' : 'search'
                          }`}
                          style={{ color: 'gray' }}
                          aria-hidden="true"
                        />
                      </Tooltip>
                    </button>
                  </Col>
                )}
              </Row>
              <Row className="w-full">
                <Col>
                  <div
                    className="truncate w-full"
                    style={{
                      color: !contact.isActive ? 'gray' : '',
                      marginTop: '-7px',
                    }}
                  >
                    {contact.email && <span>{contact.email}</span>}
                    {contact.email && contact.phone && <br />}
                    {contact.phone && <span>{formatPhone(contact.phone)}</span>}
                    {(contact.email || contact.phone) && contact.cellPhone && (
                      <br />
                    )}
                    {contact.cellPhone && (
                      <span>{formatCellPhone(contact.cellPhone)}</span>
                    )}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </>
      <PersonContactForm
        show={showPersonContactForm}
        personContact={personContact}
        closePersonContactForm={closePersonContactForm}
        savePersonContactForm={savePersonContactForm}
        canBeUpdated={canBeUpdated}
        isSaving={isSaving}
      />
    </>
  )
}

LeftBarContact.propTypes = {
  index: PropTypes.number,
  contacts: PropTypes.array,
  contact: PropTypes.object,
  personContactId: PropTypes.number,
  setProposalContactId: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  personId: PropTypes.number,
  onChange: PropTypes.func,
  isSavingProposal: PropTypes.bool,
}
