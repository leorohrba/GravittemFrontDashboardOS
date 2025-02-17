/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/button-has-type */
import { apiCRM } from '@services/api'
import {
  handleAuthError,
  removeMask,
} from '@utils'
import {
  Button,
  Card,
  Checkbox,
  message,
  Skeleton,
  Spin,
} from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import PersonContactForm from '../../../../PersonForm/components/PersonContactForm'
import LeftBarContact from './LeftBarContact'

export default function LeftBarContacts(props) {
  const {
    contacts,
    loading,
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
  const [isSaving, setIsSaving] = useState(false)
  const [showInactive, setShowInactive] = useState(false)

  useEffect(() => {
    if (!contacts.find(x => x.isActive === false)) {
      setShowInactive(false)
    }
  }, [contacts])

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

  const renderSelectedContacts = () => {
    const mapSelectedContacts = contacts.map((contact, index) => (
      <LeftBarContact
        {...{
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
        }}
      />
    ))
    return mapSelectedContacts
  }

  const onChangeShowInactive = e => {
    setShowInactive(e.target.checked)
  }

  return (
    <Card className="mt-5 relative" bodyStyle={{ padding: 0 }}>
      <Spin size="large" spinning={isSavingProposal}>
        <div className="primary-background-color h-12" />
        <h3
          className="absolute text-white"
          style={{ top: '10px', left: '20px' }}
        >
          Contatos
        </h3>

        <Skeleton
          className="px-4"
          loading={loading}
          paragraph={{ rows: 4 }}
          active
        >
          <div className="m-3">{renderSelectedContacts()}</div>
        </Skeleton>

        {canBeUpdated && !loading && (
          <div className="m-3">
            <Button
              className="w-full"
              size="default"
              type="secondary"
              onClick={() => editPersonContact(0)}
            >
              <i className="fa fa-plus fa-lg mr-3" />
              Novo contato
            </Button>
          </div>
        )}

        {contacts.find(x => x.isActive === false) && !loading && (
          <div className="m-3">
            <Checkbox checked={showInactive} onChange={onChangeShowInactive}>
              Mostrar contatos inativos
            </Checkbox>
          </div>
        )}

        <PersonContactForm
          show={showPersonContactForm}
          personContact={personContact}
          closePersonContactForm={closePersonContactForm}
          savePersonContactForm={savePersonContactForm}
          canBeUpdated={canBeUpdated}
          isSaving={isSaving}
        />
      </Spin>
    </Card>
  )
}

LeftBarContacts.propTypes = {
  loading: PropTypes.bool,
  contacts: PropTypes.array,
  personContactId: PropTypes.number,
  setProposalContactId: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  personId: PropTypes.number,
  onChange: PropTypes.func,
  isSavingProposal: PropTypes.bool,
}
