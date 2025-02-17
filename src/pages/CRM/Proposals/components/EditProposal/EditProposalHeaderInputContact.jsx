/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-bind */
import { apiCRM } from '@services/api'
import { handleAuthError, removeMask } from '@utils'
// import { Form } from '@ant-design/compatible'
import { Form, message, Select, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import PersonContactForm from '../../../PersonForm/components/PersonContactForm'

const { Option } = Select

const EditProposalHeaderInputContact = React.forwardRef((props, ref) => {
  const {
    form,
    contactSource,
    canBeUpdated,
    autoFocus,
    personId,
    onChange,
    loading,
    editData,
  } = props
  // const { getFieldDecorator } = form

  const [showPersonContactForm, setShowPersonContactForm] = useState(false)
  const [personContact, setPersonContact] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  function editPersonContact(e, contactId) {
    e.preventDefault()
    if (contactId === 0) {
      setPersonContact(null)
      setShowPersonContactForm(true)
    }
    // não implementado
    /*
    else
    {
       const contact = contacts.find(x => x.contactId === contactId)
       setPersonContact(contact)
    }
    */
    setShowPersonContactForm(true)
  }

  function closePersonContactForm() {
    setShowPersonContactForm(false)
  }

  async function savePersonContactForm(contactToSave) {
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
        DocumentCPF: removeMask(contactToSave.documentCPF) || '',
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
          onChange(parseInt(data.idGenerated, 10))
        }
      }
    } catch (error) {
      setIsSaving(false)

      handleAuthError(error)
    }
  }

  return (
    <React.Fragment>
      <Form.Item
        label={
          <React.Fragment>
            <span>Nome do contato</span>
            {personId > 0 && canBeUpdated && (
              <button
                style={{ marginTop: '-2px', position: 'absolute' }}
                className="linkButton ml-1"
                onClick={e => editPersonContact(e, 0)}
                type="button"
              >
                <Tooltip title="Novo contato">
                  <i
                    className="fa fa-plus"
                    style={{ color: 'gray', fontSize: '8px' }}
                    aria-hidden="true"
                  />
                </Tooltip>
              </button>
            )}
          </React.Fragment>
        }
        name="contactId"
        initialValue={editData ? editData?.personContactId : undefined}
        rules={[{ required: false, message: 'Campo obrigatório!' }]}
      >
        <Select
          disabled={!canBeUpdated}
          ref={ref}
          showSearch
          showArrow
          allowClear
          loading={loading}
          autoFocus={
            autoFocus === null || autoFocus === undefined ? false : autoFocus
          }
          style={{ textIndent: '2px' }}
          placeholder="Digite o nome do contato"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {contactSource.map(p => (
            <Option key={p.value} value={p.value}>
              {p.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <PersonContactForm
        show={showPersonContactForm}
        personContact={personContact}
        closePersonContactForm={closePersonContactForm}
        savePersonContactForm={savePersonContactForm}
        canBeUpdated
        isSaving={isSaving}
      />
    </React.Fragment>
  )
})

EditProposalHeaderInputContact.propTypes = {
  form: PropTypes.any,
  contactSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  autoFocus: PropTypes.bool,
  personId: PropTypes.number,
  loading: PropTypes.bool,
  onChange: PropTypes.func,
  editData: PropTypes.any,
}

export default EditProposalHeaderInputContact
