import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processResponsibleSearchId = 0

const CallHistoryInputResponsible = props => {
  const {
    form,
    responsibleSource,
    setResponsibleSource,
    editData,
    canBeUpdated,
    autoFocus,
    onChange,
  } = props
  const { getFieldDecorator } = form

  const [responsibleName, setResponsibleName] = useState('')
  const [
    responsibleNoResultsMessage,
    setResponsibleNoResultsMessage,
  ] = useState(null)
  const [loadingResponsibles, setLoadingResponsibles] = useState(false)
  const inputResponsible = useRef(null)

  useEffect(() => {
    setResponsibleName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('responsibleId')])

  const debouncedResponsibleName = useDebounce(responsibleName, 400)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedResponsibleName) {
      populateResponsibleSearch(debouncedResponsibleName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedResponsibleName])

  const handleSearchResponsible = value => {
    setResponsibleName(value)
  }

  const handleChangeResponsible = value => {
    const responsible = responsibleSource.find(x => x.value === value)
    if (!(onChange === null || onChange === undefined)) {
      if (responsible) {
        onChange(responsible)
      } else {
        onChange()
      }
    }
    setResponsibleName('')
  }

  const populateResponsibleSearch = (name, id, isExact) => {
    setResponsibleSource([])
    setLoadingResponsibles(true)

    processResponsibleSearchId++
    const internalProcessResponsibleSearchId = processResponsibleSearchId
    getResponsibles(name, id, isExact)
      .then(records => {
        if (internalProcessResponsibleSearchId === processResponsibleSearchId) {
          const source = []
          setResponsibleNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({ label: record.name, value: record.collaboratorId }),
            )
          } else {
            setResponsibleNoResultsMessage(
              'Não foram encontrados colaboradores',
            )
          }
          setResponsibleSource(source)
          setLoadingResponsibles(false)
        }
      })
      .catch(error => {
        setResponsibleNoResultsMessage('Não foi possível buscar colaboradores')
        setLoadingResponsibles(false)
      })
  }

  const getResponsibles = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      name: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isCollaborator: true,
      onlyMyOwnerId: true,
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

  return (
    <React.Fragment>
      <Form.Item label="Responsável">
        {getFieldDecorator('responsibleId', {
          initialValue: editData ? editData?.responsibleUserId : undefined,
        })(
          <Select
            placeholder="Digite o nome do responsável"
            filterOption={false}
            allowClear
            disabled={!canBeUpdated}
            showSearch
            onChange={handleChangeResponsible}
            onSearch={handleSearchResponsible}
            ref={inputResponsible}
            showArrow={false}
            className="select-autocomplete"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loadingResponsibles ? (
                <Spin size="small" />
              ) : responsibleName ? (
                responsibleNoResultsMessage
              ) : null
            }
          >
            {responsibleSource.map((record, index) => (
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

CallHistoryInputResponsible.propTypes = {
  form: PropTypes.any,
  responsibleSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setResponsibleSource: PropTypes.func,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  editData: PropTypes.any,
}

export default CallHistoryInputResponsible
