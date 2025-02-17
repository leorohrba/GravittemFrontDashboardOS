import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processUserSearchId = 0

export default function UsersAutoComplete({
  form,
  userSource,
  canBeUpdated,
  setUserSource,
  autoFocus,
  editData,
}) {
  // const { getFieldDecorator } = form

  const [userName, setUserName] = useState('')
  const [userNoResultsMessage, setUserNoResultsMessage] = useState(null)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const userInput = useRef(null)

  const debouncedUserName = useDebounce(userName, 400)

  useEffect(() => {
    setUserName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('user')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedUserName) {
      populateUserSearch(debouncedUserName, null, false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUserName])

  useEffect(() => {
    editData &&
      setUserSource([
        {
          label: editData.username,
          value: editData.userId,
        },
      ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  const handleSearchUser = value => {
    setUserName(value)
  }

  const populateUserSearch = (name, id, isExact) => {
    setUserSource([])
    setLoadingUsers(true)

    processUserSearchId++
    const internalProcessUserSearchId = processUserSearchId
    getUsers(name, id, isExact)
      .then(records => {
        if (internalProcessUserSearchId === processUserSearchId) {
          const source = []
          setUserNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.username,
                value: record.userId,
              }),
            )
          } else {
            setUserNoResultsMessage('Não foram encontrados usuários')
          }
          setUserSource(source)
          setLoadingUsers(false)
        }
      })
      .catch(error => {
        setUserNoResultsMessage('Não foi possível buscar os usuários')
        setLoadingUsers(false)
      })
  }

  const getUsers = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isUser: true,
      isPersonForm: true,
      userId: id,
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

  const handleChangeUser = value => {
    setUserName('')
  }

  return (
    <React.Fragment>
      <Form.Item
        label="Usuário"
        className="mb-6"
        name="user"
        initialValue={editData ? editData?.userId : null}
      >
        <Select
          placeholder="Digite o nome do usuário"
          disabled={!canBeUpdated}
          filterOption={false}
          showSearch
          onSearch={handleSearchUser}
          onChange={handleChangeUser}
          ref={userInput}
          showArrow={false}
          style={{ width: '100%' }}
          className="select-autocomplete"
          autoFocus={
            autoFocus === null || autoFocus === undefined ? false : autoFocus
          }
          notFoundContent={
            loadingUsers ? (
              <Spin size="small" />
            ) : userName ? (
              userNoResultsMessage
            ) : null
          }
        >
          <Option value={null} style={{ height: '1.7rem' }} />
          {userSource.map((record, index) => (
            <Option key={index} value={record.value}>
              {record.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}
