import useDebounce from '@components/useDebounce'
import { apiCRM } from '@services/api'
import { handleAuthError } from '@utils'
import { Form, message, Select, Spin, Tooltip, Row, Col, Button } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import RegionModal from '../../Region/RegionModal'

const { Option } = Select

let processSearchId = 0

const InputResponsibleFranchisee = props => {
  const {
    form,
    responsibleFranchiseeSource,
    setResponsibleFranchiseeSource,
    canBeUpdated,
    ownerProfile,
    citySource,
    editData,
  } = props

  const [name, setName] = useState('')
  const [noResultsMessage, setNoResultsMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const responsibleFranchiseeInput = useRef(null)
  const [searching, setSearching] = useState(false)
  const [regionId, setRegionId] = useState(null)
  const [regionModalVisible, setRegionModalVisible] = useState(false)

  const debouncedName = useDebounce(name, 400)

  useEffect(() => {
    setName('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getFieldValue('responsibleFranchiseeId')])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (debouncedName) {
      populateSearch(debouncedName, null, false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName])

  const handleSearch = value => {
    setName(value)
    setSearching(false)
  }

  const populateSearch = (name, id, isExact) => {
    setResponsibleFranchiseeSource([])
    setLoading(true)

    processSearchId++
    const internalProcessSearchId = processSearchId
    getResponsibleFranchisees(name, id, isExact)
      .then(records => {
        if (internalProcessSearchId === processSearchId) {
          const source = []
          setNoResultsMessage(null)
          if (records.length > 0) {
            records.map(record =>
              source.push({
                name: record.shortName,
                address: record.addressDescription,
                city: `${record.cityName} - ${record.stateAbbreviation}`,
                distance: '',
                id: record.franchiseeId,
                regionId: record.regionId,
                regionName: record.regionName,
                regionStatus: record.regionStatus,
              }),
            )
          } else {
            setNoResultsMessage('Não foram encontrados franqueados')
          }
          setResponsibleFranchiseeSource(source)
          setLoading(false)
        }
      })
      .catch(error => {
        setNoResultsMessage('Não foi possível buscar os franqueados')
        setLoading(false)
      })
  }

  const getResponsibleFranchisees = (name, id, isExact) => {
    if (!name) {
      return new Promise((resolve, reject) => {
        resolve([])
      })
    }

    const params = {
      shortName: `%${name}%`,
      queryOperator: isExact ? '=' : 'like',
      isFranchisee: true,
      getPersonDetails: false,
      isActive: true,
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

  const handleChange = value => {
    setName('')
  }

  async function searchFranchiseeByLocation() {
    if (!form.getFieldValue('cityId')) {
      message.error(
        'Você deve informar a cidade para poder fazer a busca dos franqueados...',
      )
      return
    }

    if (!form.getFieldValue('stateAbbreviation')) {
      message.error(
        'Você deve informar o estado para poder fazer a busca dos franqueados...',
      )
      return
    }

    setLoading(true)
    setSearching(true)
    setResponsibleFranchiseeSource([])
    setNoResultsMessage(null)

    if (responsibleFranchiseeInput.current) {
      try {
        responsibleFranchiseeInput.current.rcSelect.setOpenState(true, true)
      } catch {}
    }

    const city = citySource.find(x => x.cityId === form.getFieldValue('cityId'))
    let cityName = ''
    if (city) {
      cityName = city.cityName
    }

    const params = {
      cityName,
      cityId: form.getFieldValue('cityId'),
      stateAbbreviation: form.getFieldValue('stateAbbreviation'),
      street: form.getFieldValue('addressName')
        ? form.getFieldValue('addressName')
        : '',
      houseNumber: form.getFieldValue('addressNumber')
        ? form.getFieldValue('addressNumber')
        : '',
      zipCode: form.getFieldValue('zipCode'),
      neighborhood: form.getFieldValue('neighborhood'),
    }

    try {
      const response = await apiCRM({
        method: 'GET',
        url: `${process.env.UMI_API_HOST_CRM}/api/crm/findfranchisee`,
        params,
      })

      const { data } = response

      if (data.isOk) {
        const { franchiseeRange } = data
        if (franchiseeRange === null) {
          setNoResultsMessage(
            'Não encontramos franqueado para você! \nTente pesquisar pelo nome.',
          )
        } else {
          setNoResultsMessage(
            `Não encontramos franqueado para você \n no raio de ${franchiseeRange} km.\nTente pesquisar pelo nome.`,
          )
        }

        const source = []

        data.franchisee.map((franchisee, index) => {
          let distance = Math.round(franchisee.distance * 10) / 10
          if (franchisee.distance > 100) {
            distance = Math.round(franchisee.distance, 0)
          }
          source.push({
            name: franchisee.shortName,
            address: franchisee.addressDescription,
            city: `${franchisee.cityName} - ${franchisee.stateAbbreviation}`,
            distance: franchiseeRange
              ? `${distance.toString().replace('.', ',')} km`
              : '',
            id: franchisee.franchiseeId,
            regionId: franchisee.regionId,
            regionName: franchisee.regionName,
            regionStatus: franchisee.regionStatus,
          })
          return true
        })

        setResponsibleFranchiseeSource(source)
        setLoading(false)
      } else {
        setLoading(false)
        message.error(data.message)
      }
    } catch (error) {
      setLoading(false)
      handleAuthError(error)
    }
  }

  const handleBlur = () => {
    setSearching(false)
  }

  const showMessage = message => {
    if (!message) return null

    const messages = message.split('\n')
    const result = (
      <Row>
        {messages.map(d => (
          <Col>
            <h4>{d}</h4>
          </Col>
        ))}
      </Row>
    )
    return result
  }

  const footer = (id, source) => {
    let result
    const franchisee = source.find(x => x.id === id)
    if (franchisee && franchisee?.regionId) {
      result = (
        <span
          role="button"
          className="cursor-pointer"
          style={{ color: 'gray' }}
          onClick={() => openRegionModal(franchisee.regionId)}
        >
          {franchisee.regionName}
          {franchisee.regionStatus === 2 && <i className="ml-2">(Inativo)</i>}
        </span>
      )
    }
    return result
  }

  const openRegionModal = id => {
    setRegionId(id)
    setRegionModalVisible(true)
  }

  return (
    <React.Fragment>
      <RegionModal
        visible={regionModalVisible}
        setVisible={setRegionModalVisible}
        regionId={regionId}
        setRegionId={setRegionId}
        readOnly
      />
      <div
        style={{
          display:
            (form.getFieldValue('personType') === 1 &&
              (form.getFieldValue('isSeller') ||
                form.getFieldValue('isCollaborator'))) ||
            (form.getFieldValue('personType') === 2 &&
              form.getFieldValue('isFranchisee')) ||
            ownerProfile === 'Standard'
              ? 'none'
              : 'block',
        }}
      >
        <Row type="flex" className="mb-5">
          <Col style={{ width: '345px' }}>
            <Form.Item
              label="Franqueado Responsável"
              className="mb-0"
              extra={footer(
                form.getFieldValue('responsibleFranchiseeId'),
                responsibleFranchiseeSource,
              )}
              name="responsibleFranchiseeId"
              initialValue={editData?.responsibleFranchiseeId || null}
            >
              <Select
                placeholder="Informe o franqueado"
                disabled={!canBeUpdated}
                filterOption={false}
                showSearch
                allowClear
                optionLabelProp="label"
                onSearch={handleSearch}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={responsibleFranchiseeInput}
                showArrow={false}
                className="select-autocomplete"
                notFoundContent={
                  loading ? (
                    <Spin size="small" />
                  ) : name || searching ? (
                    <React.Fragment>
                      {showMessage(noResultsMessage)}
                    </React.Fragment>
                  ) : null
                }
              >
                {responsibleFranchiseeSource.map((record, index) => (
                  <Option key={index} value={record.id} label={record.name}>
                    <React.Fragment>
                      <Row type="flex">
                        <Col style={{ width: '240px' }}>
                          <strong>{record.name}</strong>
                        </Col>
                        <Col className="text-right" style={{ width: '50px' }}>
                          <i>{record.distance}</i>
                        </Col>
                      </Row>
                      <Row>
                        <Col>{record.address}</Col>
                      </Row>
                      <Row type="flex" align="middle">
                        <Col>{record.city}</Col>
                        {!!record.regionName && (
                          <span className="ml-2">{`(${record.regionName})`}</span>
                        )}
                      </Row>
                    </React.Fragment>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <div
            style={{
              display:
                ownerProfile === 'Franchisor' && canBeUpdated
                  ? 'block'
                  : 'none',
            }}
          >
            <Col style={{ marginLeft: '10px', marginTop: '30px' }}>
              <Tooltip
                placement="top"
                title="Buscar franqueados por localização"
              >
                <Button
                  shape="round"
                  disabled={!canBeUpdated}
                  onClick={() => searchFranchiseeByLocation()}
                >
                  <i className="fa fa-search"> </i>
                </Button>
              </Tooltip>
            </Col>
          </div>
        </Row>
      </div>
    </React.Fragment>
  )
}

InputResponsibleFranchisee.propTypes = {
  form: PropTypes.any,
  responsibleFranchiseeSource: PropTypes.array,
  canBeUpdated: PropTypes.bool,
  setResponsibleFranchiseeSource: PropTypes.func,
  ownerProfile: PropTypes.string,
  citySource: PropTypes.array,
  editData: PropTypes.any,
}

export default InputResponsibleFranchisee
