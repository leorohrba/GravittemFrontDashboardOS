import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processProposalSearchId = 0

const TaskFormInputProposal = props => {
  const {
    form,
    proposalSource,
    setProposalSource,
    canBeUpdated,
    editData,
    newModal,
  } = props

  const [proposalName, setProposalName] = useState('')
  const [proposalNoResultsMessage, setProposalNoResultsMessage] = useState(null)
  const [loadingProposals, setLoadingProposals] = useState(false)
  const proposalInput = useRef(null)

  const debouncedProposalName = useDebounce(proposalName, 400)

  useEffect(() => {
    setProposalName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('proposalId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedProposalName) {
      populateProposalSearch(debouncedProposalName)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedProposalName])

  const handleSearchProposal = value => {
    setProposalName(value)
  }

  const populateProposalSearch = name => {
    setProposalSource([])
    setLoadingProposals(true)

    processProposalSearchId++
    const internalProcessProposalSearchId = processProposalSearchId
    getProposals(name)
      .then(records => {
        if (internalProcessProposalSearchId === processProposalSearchId) {
          const source = []
          setProposalNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                label: record.number,
                value: record.proposalId,
              }),
            )
          } else {
            setProposalNoResultsMessage(
              !form.getFieldValue('companyId')
                ? 'Informe a organização!'
                : 'Negócio inválido!',
            )
          }
          setProposalSource(source)
          setLoadingProposals(false)
        }
      })
      .catch(error => {
        setProposalNoResultsMessage('Não foi possível buscar os negócios')
        setLoadingProposals(false)
      })
  }

  const getProposals = name => {
    if (!name || !form.getFieldValue('companyId')) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      number: name,
      companyId: form.getFieldValue('companyId'),
      getProposalDetails: false,
    }

    return apiCRM
      .get(`/api/crm/proposal`, {
        params,
      })
      .then(response => {
        const { data } = response

        if (data.isOk) {
          return data.proposal
        }
        message.error(data.message)
        return []
      })
      .catch(function handleError(error) {
        handleAuthError(error)
      })
  }

  const handleChangeProposal = value => {
    setProposalName('')
  }

  return (
    <Form.Item
      label="Negócio relacionado"
      name="proposalId"
      initialValue={editData ? editData?.proposalId : undefined}
    >
      <Select
        placeholder="Procurar"
        filterOption={false}
        disabled={!canBeUpdated}
        showSearch
        allowClear
        onSearch={handleSearchProposal}
        onChange={handleChangeProposal}
        ref={proposalInput}
        showArrow={false}
        className="select-autocomplete"
        notFoundContent={
          loadingProposals ? (
            <Spin size="small" />
          ) : proposalName ? (
            proposalNoResultsMessage
          ) : null
        }
      >
        {proposalSource.map((record, index) => (
          <Option key={index} value={record.value}>
            {record.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )
}

TaskFormInputProposal.propTypes = {
  form: PropTypes.any,
  proposalSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setProposalSource: PropTypes.func,
  editData: PropTypes.any,
  newModal: PropTypes.any,
}

export default TaskFormInputProposal
