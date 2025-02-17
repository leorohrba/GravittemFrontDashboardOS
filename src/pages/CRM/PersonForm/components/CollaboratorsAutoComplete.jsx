import React, { useEffect, useRef, useState } from 'react'
import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'

const { Option } = Select

let processCollaboratorSearchId = 0

export default function CollaboratorsAutoComplete({
  form,
  collaboratorSource,
  canBeUpdated,
  setCollaboratorSource,
  autoFocus,
  editData,
}) {

  const [collaboratorName, setCollaboratorName] = useState('')
  const [
    collaboratorNoResultsMessage,
    setCollaboratorNoResultsMessage,
  ] = useState(null)
  const [loadingCollaborators, setLoadingCollaborators] = useState(false)
  const collaboratorInput = useRef(null)

  const debouncedCollaboratorName = useDebounce(collaboratorName, 400)

  useEffect(() => {
    setCollaboratorName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('supervisor')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedCollaboratorName) {
      populateCollaboratorSearch(debouncedCollaboratorName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCollaboratorName])

  useEffect(() => {
    editData &&
      setCollaboratorSource([
        {
          label: editData.supervisorName,
          value: editData.supervisorId,
        },
      ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  const handleSearchCollaborator = value => {
    setCollaboratorName(value)
  }

  const populateCollaboratorSearch = (name, id, isExact) => {
    setCollaboratorSource([])
    setLoadingCollaborators(true)

    processCollaboratorSearchId++
    const internalProcessCollaboratorSearchId = processCollaboratorSearchId
    getCollaborators(name, id, isExact)
      .then(records => {
        if (
          internalProcessCollaboratorSearchId === processCollaboratorSearchId
        ) {
          const source = []
          setCollaboratorNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.shortName,
                value: record.collaboratorId,
              }),
            )
          } else {
            setCollaboratorNoResultsMessage(
              'Não foram encontrados colaboradores',
            )
          }
          setCollaboratorSource(source)
          setLoadingCollaborators(false)
        }
      })
      .catch(error => {
        setCollaboratorNoResultsMessage(
          'Não foi possível buscar os colaboradores',
        )
        setLoadingCollaborators(false)
      })
  }

  const getCollaborators = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isCollaborator: true,
      isPersonForm: true,
      collaboratorId: id,
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

  const handleChangeCollaborator = value => {
    setCollaboratorName('')
  }

  return (
    <React.Fragment>
      <Form.Item label="Supervisor" className="mb-6" name="supervisor" initialValue={editData ? editData?.supervisorId : null}>
          <Select
            placeholder="Digite o nome do supervisor"
            disabled={!canBeUpdated}
            filterOption={false}
            showSearch
            onSearch={handleSearchCollaborator}
            onChange={handleChangeCollaborator}
            ref={collaboratorInput}
            showArrow={false}
            className="select-autocomplete"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loadingCollaborators ? (
                <Spin size="small" />
              ) : collaboratorName ? (
                collaboratorNoResultsMessage
              ) : null
            }
          >
            <Option value={null} style={{ height: '1.7rem' }} />
            {collaboratorSource.map((record, index) => (
              <Option key={index} value={record.value}>
                {record.label}
              </Option>
            ))}
          </Select>,
      </Form.Item>
    </React.Fragment>
  )
}
