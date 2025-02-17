import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processRequesterSearchId = 0

const CallHistoryInputRequester = props => {
  const {
    form,
    requesterSource,
    setRequesterSource,
    canBeUpdated,
    editData,
    autoFocus,
    onChange,
  } = props
  const { getFieldDecorator } = form

  const [requesterName, setRequesterName] = useState('')
  const [requesterNoResultsMessage, setRequesterNoResultsMessage] = useState(
    null,
  )
  const [loadingRequesters, setLoadingRequesters] = useState(false)
  const inputRequester = useRef(null)

  useEffect(() => {
    setRequesterName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('requesterId')])

  const debouncedRequesterName = useDebounce(requesterName, 400)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedRequesterName) {
      populateRequesterSearch(debouncedRequesterName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRequesterName])

  const handleSearchRequester = value => {
    setRequesterName(value)
  }

  const handleChangeRequester = value => {
    const requester = requesterSource.find(x => x.value === value)
    if (!(onChange === null || onChange === undefined)) {
      if (requester) {
        onChange(requester)
      } else {
        onChange()
      }
    }
    setRequesterName('')
  }

  const populateRequesterSearch = (name, id, isExact) => {
    setRequesterSource([])

    if (!form.getFieldValue('franchiseeId')) {
      setRequesterNoResultsMessage('O franqueado deve ser informado primeiro!')
      return
    }

    setLoadingRequesters(true)
    processRequesterSearchId++
    const internalProcessRequesterSearchId = processRequesterSearchId
    getRequesters(name, id, isExact)
      .then(records => {
        if (internalProcessRequesterSearchId === processRequesterSearchId) {
          const source = []
          setRequesterNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({ label: record.name, value: record.collaboratorId }),
            )
          } else {
            setRequesterNoResultsMessage(
              'Não foram encontrados colaboradores da franquia',
            )
          }
          setRequesterSource(source)
          setLoadingRequesters(false)
        }
      })
      .catch(error => {
        setRequesterNoResultsMessage(
          'Não foi possível buscar colaboradores da franquia',
        )
        setLoadingRequesters(false)
      })
  }

  const getRequesters = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      name: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isCollaborator: true,
      franchiseeIdResponsiblePerson: form.getFieldValue('franchiseeId'),
      getPersonDetails: false,
    }
    return apiCRM
      .get(`/api/crm/person`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.person
        }
        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const requesterValidate = (rule, value, callback) => {
    if (!value) {
      callback('Informe o solicitante!')
    } else {
      callback()
    }
  }

  return (
    <React.Fragment>
      <Form.Item
        colon={false}
        label={
          <React.Fragment>
            <span style={{ color: 'red' }}>*&nbsp;</span>
            <span>
              <span className="mr-2">Solicitante :</span>
              <Tooltip
                title="Esse campo deve ser preenchido com o usuário solicitante, que seja vinculado ao franqueado"
                placement="right"
              >
                <i className="fa fa-info-circle" aria-hidden="true" />
              </Tooltip>
            </span>
          </React.Fragment>
        }
      >
        {getFieldDecorator('requesterId', {
          initialValue: editData ? editData?.requesterUserId : null,
          rules: [
            {
              validator: requesterValidate,
            },
          ],
        })(
          <Select
            placeholder="Digite o nome do solicitante"
            filterOption={false}
            disabled={!canBeUpdated}
            showSearch
            onChange={handleChangeRequester}
            onSearch={handleSearchRequester}
            ref={inputRequester}
            showArrow={false}
            className="select-autocomplete"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loadingRequesters ? (
                <Spin size="small" />
              ) : requesterName ? (
                requesterNoResultsMessage
              ) : null
            }
          >
            {requesterSource.map((record, index) => (
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

CallHistoryInputRequester.propTypes = {
  form: PropTypes.any,
  requesterSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setRequesterSource: PropTypes.func,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  editData: PropTypes.any,
}

export default CallHistoryInputRequester
