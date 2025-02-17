import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form } from '@ant-design/compatible'
import { message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processRecipientSearchId = 0

const CommunicationInputRecipient = props => {
  const { form, recipientSource, setRecipientSource, canBeUpdated, editData } = props
  const { getFieldDecorator } = form

  const [recipientName, setRecipientName] = useState('')
  const [recipientNoResultsMessage, setRecipientNoResultsMessage] = useState(
    null,
  )
  const [loadingRecipients, setLoadingRecipients] = useState(false)
  const inputRecipient = useRef(null)


  useEffect(() => {
    setRecipientName('')
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [editData])

  const debouncedRecipientName = useDebounce(recipientName, 400)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedRecipientName) {
      populateRecipientSearch(debouncedRecipientName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRecipientName])

  const handleSearchRecipient = value => {
    setRecipientName(value)
  }

  const handleChangeRecipient = value => {
    setRecipientName('')
  }

  const populateRecipientSearch = name => {
    setRecipientSource([])
    setLoadingRecipients(true)

    processRecipientSearchId++
    const internalProcessRecipientSearchId = processRecipientSearchId
    getRecipients(name)
      .then(records => {
        if (internalProcessRecipientSearchId === processRecipientSearchId) {
          const source = []
          setRecipientNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.recipientName,
                value:
                  record.recipientType === 'Franchise'
                    ? `f${record.recipientId}`
                    : `l${record.recipientId}`,
                recipientId: record.recipientId,
                recipientType: record.recipientType,
              }),
            )
          } else {
            setRecipientNoResultsMessage('Não foram encontrados destinatários')
          }
          setRecipientSource(source)
          setLoadingRecipients(false)
        }
      })
      .catch(error => {
        setRecipientNoResultsMessage('Não foi possível buscar destinatários')
        setLoadingRecipients(false)
      })
  }

  const getRecipients = name => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      recipientName: name,
    }

    return apiCRM
      .get(`/api/crm/communicationRecipients`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.recipients
        }
        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  return (
    <React.Fragment>
      <Form.Item label="Para">
        {getFieldDecorator('recipient', {
          initialValue: editData ? editData?.recipient || [] : [],
          rules: [
            {
              required: true,
              message: 'Campo obrigatório',
            },
          ],
        })(
          <Select
            placeholder="Digite o nome da lista ou franquia"
            filterOption={false}
            disabled={!canBeUpdated}
            showSearch
            onChange={handleChangeRecipient}
            onSearch={handleSearchRecipient}
            ref={inputRecipient}
            showArrow={false}
            mode="multiple"
            className="select-autocomplete"
            style={{ textIndent: '2px' }}
            autoFocus
            notFoundContent={
              loadingRecipients ? (
                <Spin size="small" />
              ) : recipientName ? (
                recipientNoResultsMessage
              ) : null
            }
          >
            {recipientSource.map((record, index) => (
              <Option key={index} value={record.value}>
                {record.label}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </React.Fragment>
  )
}

CommunicationInputRecipient.propTypes = {
  form: PropTypes.any,
  recipientSource: PropTypes.array,
  setRecipientSource: PropTypes.func,
  canBeUpdated: PropTypes.bool,
  editData: PropTypes.any,
}

export default CommunicationInputRecipient
