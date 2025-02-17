import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Col, message, Row, Select, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'

const { Option } = Select

let processSellerSearchId = 0

const LeftBarInputSeller = props => {
  const {
    sellerSource,
    setSellerSource,
    sellerId,
    canBeUpdated,
    autoFocus,
    onChange,
    franchiseeOwnerId,
    owner,
  } = props

  const [sellerName, setSellerName] = useState('')
  const [sellerNoResultsMessage, setSellerNoResultsMessage] = useState(null)
  const [loadingSellers, setLoadingSellers] = useState(false)
  const sellerInput = useRef(null)

  const debouncedSellerName = useDebounce(sellerName, 400)

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

  const handleChangeSeller = value => {
    if (onChange !== null || onChange !== undefined) {
      onChange(value)
    }
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

  return (
    <React.Fragment>
      <Row>
        <Select
          placeholder="Informe o vendedor"
          disabled={!canBeUpdated}
          filterOption={false}
          showSearch
          value={sellerId}
          onChange={handleChangeSeller}
          onSearch={handleSearchSeller}
          ref={sellerInput}
          showArrow={false}
          optionLabelProp="label"
          className="select-autocomplete"
          style={{ width: '14vw' }}
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
            <Option
              key={index}
              value={record.value}
              label={
                <Row type="flex">
                  <Col style={{ maxWidth: '105px' }} className="truncate">
                    <Tooltip title={record.label}>{record.label}</Tooltip>
                  </Col>
                </Row>
              }
            >
              {record.label}
            </Option>
          ))}
        </Select>
      </Row>
      <Row>
        {!sellerId && (
          <span style={{ color: 'red' }}>Campo obrigatório!</span>
        )}
      </Row>
    </React.Fragment>
  )
}

LeftBarInputSeller.propTypes = {
  sellerSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setSellerSource: PropTypes.func,
  sellerId: PropTypes.number,
  autoFocus: PropTypes.bool,
  onChange: PropTypes.func,
  franchiseeOwnerId: PropTypes.number,
  owner: PropTypes.any,
}

export default LeftBarInputSeller
