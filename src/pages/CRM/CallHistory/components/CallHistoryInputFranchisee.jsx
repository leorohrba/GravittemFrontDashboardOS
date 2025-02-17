import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processFranchiseeSearchId = 0

const CallHistoryInputFranchisee = props => {
  const {
    form,
    franchiseeSource,
    setFranchiseeSource,
    canBeUpdated,
    editData,
    autoFocus,
    onChange,
  } = props
  const { getFieldDecorator } = form

  const [franchiseeName, setFranchiseeName] = useState('')
  const [franchiseeNoResultsMessage, setFranchiseeNoResultsMessage] = useState(
    null,
  )
  const [loadingFranchisees, setLoadingFranchisees] = useState(false)
  const inputFranchisee = useRef(null)

  useEffect(() => {
    setFranchiseeName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('franchiseeId')])

  const debouncedFranchiseeName = useDebounce(franchiseeName, 400)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedFranchiseeName) {
      populateFranchiseeSearch(debouncedFranchiseeName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFranchiseeName])

  const handleSearchFranchisee = value => {
    setFranchiseeName(value)
  }

  const handleChangeFranchisee = value => {
    const franchisee = franchiseeSource.find(x => x.value === value)
    if (!(onChange === null || onChange === undefined)) {
      if (franchisee) {
        onChange(franchisee)
      } else {
        onChange()
      }
    }
    setFranchiseeName('')
  }

  const populateFranchiseeSearch = (name, id, isExact) => {
    setFranchiseeSource([])
    setLoadingFranchisees(true)

    processFranchiseeSearchId++
    const internalProcessFranchiseeSearchId = processFranchiseeSearchId
    getFranchisees(name, id, isExact)
      .then(records => {
        if (internalProcessFranchiseeSearchId === processFranchiseeSearchId) {
          const source = []
          setFranchiseeNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.shortName,
                value: record.franchiseeId,
              }),
            )
          } else {
            setFranchiseeNoResultsMessage('Não foram encontrados franqueados')
          }
          setFranchiseeSource(source)
          setLoadingFranchisees(false)
        }
      })
      .catch(error => {
        setFranchiseeNoResultsMessage('Não foi possível buscar os franqueados')
        setLoadingFranchisees(false)
      })
  }

  const getFranchisees = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isFranchisee: true,
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

  const franchiseeValidate = (rule, value, callback) => {
    if (!value) {
      callback('Informe o franqueado!')
    } else {
      callback()
    }
  }

  return (
    <React.Fragment>
      <Form.Item
        label={
          <React.Fragment>
            <span style={{ color: 'red' }}>*&nbsp;</span>Franqueado
          </React.Fragment>
        }
      >
        {getFieldDecorator('franchiseeId', {
          initialValue: editData ? editData?.franchiseeId : null,
          rules: [
            {
              validator: franchiseeValidate,
            },
          ],
        })(
          <Select
            placeholder="Digite o nome do franqueado"
            filterOption={false}
            disabled={!canBeUpdated}
            showSearch
            onChange={handleChangeFranchisee}
            onSearch={handleSearchFranchisee}
            ref={inputFranchisee}
            showArrow={false}
            className="select-autocomplete"
            autoFocus={
              autoFocus === null || autoFocus === undefined ? false : autoFocus
            }
            notFoundContent={
              loadingFranchisees ? (
                <Spin size="small" />
              ) : franchiseeName ? (
                franchiseeNoResultsMessage
              ) : null
            }
          >
            {franchiseeSource.map((record, index) => (
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

CallHistoryInputFranchisee.propTypes = {
  form: PropTypes.any,
  franchiseeSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setFranchiseeSource: PropTypes.func,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  editData: PropTypes.any,
}

export default CallHistoryInputFranchisee
