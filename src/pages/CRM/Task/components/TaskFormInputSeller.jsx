import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processSellerSearchId = 0

const TaskFormInputSeller = props => {
  const {
    form,
    sellerSource,
    canBeUpdated,
    setSellerSource,
    autoFocus,
    owner,
    franchiseeOwnerId,
    editData,
    newModal,
  } = props

  const [sellerName, setSellerName] = useState('')
  const [sellerNoResultsMessage, setSellerNoResultsMessage] = useState(null)
  const [loadingSellers, setLoadingSellers] = useState(false)
  const sellerInput = useRef(null)

  const debouncedSellerName = useDebounce(sellerName, 400)

  useEffect(() => {
    setSellerName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('sellerId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedSellerName) {
      populateSellerSearch(debouncedSellerName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSellerName])

  const handleSearchSeller = value => {
    setSellerName(value)
  }

  const populateSellerSearch = (name, id, isExact) => {
    setSellerSource([])
    setLoadingSellers(true)

    processSellerSearchId++
    const internalProcessSellerSearchId = processSellerSearchId
    getSellers(name, id, isExact)
      .then(records => {
        if (internalProcessSellerSearchId === processSellerSearchId) {
          const source = []
          setSellerNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({ label: record.shortName, value: record.sellerId }),
            )
          } else {
            setSellerNoResultsMessage('Não foram encontrados vendedores')
          }
          setSellerSource(source)
          setLoadingSellers(false)
        }
      })
      .catch(error => {
        setSellerNoResultsMessage('Não foi possível buscar os vendedores')
        setLoadingSellers(false)
      })
  }

  const getSellers = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: isExact ? name : `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isSeller: true,
      sellerId: id,
      getPersonDetails: false,
      ownerId: owner?.ownerId,
      additionalOwnerId:
        owner?.ownerProfile === 'Franchisor' ? franchiseeOwnerId : null,
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

  const handleChangeSeller = value => {
    setSellerName('')
  }

  return (
    <React.Fragment>
      <Form.Item
        label="Vendedor"
        name="sellerId"
        initialValue={editData ? editData?.sellerId : null}
        rules={[{ required: true, message: 'Informe o vendedor!' }]}
        className="mb-0"
      >
        <Select
          placeholder="Digite o nome do vendedor"
          disabled={!canBeUpdated}
          filterOption={false}
          showSearch
          onSearch={handleSearchSeller}
          onChange={handleChangeSeller}
          ref={sellerInput}
          showArrow={false}
          className="select-autocomplete"
          autoFocus={
            autoFocus === null || autoFocus === undefined ? false : autoFocus
          }
          notFoundContent={
            loadingSellers ? (
              <Spin size="small" />
            ) : sellerName ? (
              sellerNoResultsMessage
            ) : null
          }
        >
          {sellerSource.map((record, index) => (
            <Option key={index} value={record.value}>
              {record.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </React.Fragment>
  )
}

TaskFormInputSeller.propTypes = {
  form: PropTypes.any,
  sellerSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setSellerSource: PropTypes.func,
  autoFocus: PropTypes.bool,
  owner: PropTypes.any,
  franchiseeOwnerId: PropTypes.number,
  editData: PropTypes.any,
  newModal: PropTypes.any,
}

export default TaskFormInputSeller
