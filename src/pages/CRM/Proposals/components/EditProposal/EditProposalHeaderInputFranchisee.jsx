import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
// import { Form } from '@ant-design/compatible'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processFranchiseeSearchId = 0

const EditProposalHeaderInputFranchisee = React.forwardRef((props, ref) => {
  const {
    form,
    franchiseeSource,
    setFranchiseeSource,
    canBeUpdated,
    autoFocus,
    onChange,
    editData,
    ownerProfile,
    statusCode,
  } = props
  // const { getFieldDecorator } = form

  const [franchiseeName, setFranchiseeName] = useState('')
  const [franchiseeNoResultsMessage, setFranchiseeNoResultsMessage] = useState(null)
  const [loadingFranchisees, setLoadingFranchisees] = useState(false)

  const debouncedFranchiseeName = useDebounce(franchiseeName, 400)
  
  useEffect(() => {
    form.validateFields(['franchiseeId'])
  // eslint-disable-next-line react-hooks/exhaustive-deps  
  }, [statusCode])
  
  useEffect(() => {
    setFranchiseeName('')
   // eslint-disable-next-line react-hooks/exhaustive-deps  
  },[form.getFieldValue('franchiseeId')])
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedFranchiseeName) {
      populateFranchiseeSearch(debouncedFranchiseeName)
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

  const populateFranchiseeSearch = (name) => {
    setFranchiseeSource([])
    setLoadingFranchisees(true)

    processFranchiseeSearchId++
    const internalProcessFranchiseeSearchId = processFranchiseeSearchId
    getFranchisees(name)
      .then(records => {
        if (internalProcessFranchiseeSearchId === processFranchiseeSearchId) {
          const source = []
          setFranchiseeNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.shortName,
                value: record.franchiseeId,
                ownerId: record.personOwnerId,
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

  const getFranchisees = (name) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: `%${name}%`,
      queryOperator: 'like',
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

  return (
    <React.Fragment>
      <Form.Item
        label="Franqueado"
        name="franchiseeId"
        initialValue={editData ? editData?.franchiseeId : null}
        rules={[{ required: (ownerProfile === 'Franchisor' || ownerProfile === 'Franchise') && statusCode === 'WON', message: 'Campo obrigatório!' }]}
      >
          <Select
            placeholder="Digite o nome do franqueado"
            filterOption={false}
            disabled={!canBeUpdated}
            showSearch
            allowClear
            onChange={handleChangeFranchisee}
            onSearch={handleSearchFranchisee}
            ref={ref}
            showArrow={false}
            className="select-autocomplete"
            style={{ textIndent: '2px' }}
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
      </Form.Item>
    </React.Fragment>
  )
})

EditProposalHeaderInputFranchisee.propTypes = {
  form: PropTypes.any,
  franchiseeSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setFranchiseeSource: PropTypes.func,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  editData: PropTypes.any,
  ownerProfile: PropTypes.string,
  statusCode: PropTypes.string,
}

export default EditProposalHeaderInputFranchisee
