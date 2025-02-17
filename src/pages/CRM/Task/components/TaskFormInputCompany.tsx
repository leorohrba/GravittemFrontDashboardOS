import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const { Option } = Select

let processCompanySearchId = 0

const TaskFormInputCompany = React.forwardRef((props: any, ref) => {
  const {
    form,
    companySource,
    setCompanySource,
    canBeUpdated,
    autoFocus,
    onChange,
    editData,
    newModal,
  } = props

  const [companyName, setCompanyName] = useState('')
  const [companyNoResultsMessage, setCompanyNoResultsMessage] = useState('')
  const [loadingCompanies, setLoadingCompanies] = useState(false)

  const debouncedCompanyName = useDebounce(companyName, 400)

  useEffect(() => {
    setCompanyName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('companyId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedCompanyName) {
      populateCompanySearch(debouncedCompanyName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedCompanyName])

  const handleSearchCompany = value => {
    setCompanyName(value)
  }

  const handleChangeCompany = value => {
    const company = companySource.find(x => x.value === value)
    if (!(onChange === null || onChange === undefined)) {
      if (company) {
        onChange(company)
      } else {
        onChange()
      }
    }
    setCompanyName('')
  }

  const populateCompanySearch = (name, id, isExact) => {
    setCompanySource([])
    setLoadingCompanies(true)

    processCompanySearchId++
    const internalProcessCompanySearchId = processCompanySearchId
    getCompanies(name, id, isExact)
      .then(records => {
        if (internalProcessCompanySearchId === processCompanySearchId) {
          const source: any = []
          setCompanyNoResultsMessage('')
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.shortName,
                value: record.customerId,
                isFranchisee: record.isFranchisee,
                personId: record.personId,
                franchiseeId: record.isFranchisee
                  ? record.franchiseeId
                  : record.responsibleFranchiseeId,
                franchiseeName: record.isFranchisee
                  ? record.franchiseeName
                  : record.responsibleFranchiseeName,
                franchiseeOwnerId: record.isFranchisee
                  ? null
                  : record.responsibleFranchiseeOwnerId,
              }),
            )
          } else {
            setCompanyNoResultsMessage('Não foram encontrados clientes')
          }
          setCompanySource(source)
          setLoadingCompanies(false)
        }
      })
      .catch(error => {
        setCompanyNoResultsMessage('Não foi possível buscar os clientes')
        setLoadingCompanies(false)
      })
  }

  const getCompanies = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isCustomer: true,
      customerId: id,
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
        label="Organização"
        className="mb-1"
        name="companyId"
        initialValue={editData ? editData?.companyId : null}
        rules={[{ required: true, message: 'Campo obrigatório!' }]}
      >
        <Select
          placeholder="Digite o nome da organização"
          filterOption={false}
          disabled={!canBeUpdated}
          showSearch
          onChange={handleChangeCompany}
          onSearch={handleSearchCompany}
          showArrow={false}
          className="select-autocomplete"
          autoFocus={
            autoFocus === null || autoFocus === undefined ? false : autoFocus
          }
          notFoundContent={
            loadingCompanies ? (
              <Spin size="small" />
            ) : companyName ? (
              companyNoResultsMessage
            ) : null
          }
        >
          {companySource.map((record, index) => (
            <Option key={index} value={record.value}>
              <Tooltip
                title={
                  record.franchiseeName
                    ? `Franqueado: ${record.franchiseeName}`
                    : ''
                }
              >
                {record.label}
              </Tooltip>
            </Option>
          ))}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
})

TaskFormInputCompany.propTypes = {
  form: PropTypes.any,
  companySource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setCompanySource: PropTypes.func,
  autoFocus: PropTypes.bool,
  editData: PropTypes.any,
  onChange: PropTypes.func,
}

export default TaskFormInputCompany
