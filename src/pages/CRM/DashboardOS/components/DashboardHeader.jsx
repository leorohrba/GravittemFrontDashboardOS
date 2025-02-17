import React, { useCallback } from 'react'
import { DatePicker, Form, Input, Select, Card, Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { debounce } from 'lodash'
// import InputSeller from './InputSeller'
// import Input from 'antd/lib/input/Input'

const { Option } = Select
const { RangePicker } = DatePicker

export default function DashboardHeader(props) {
  const {
    viewOptionId,
    setViewOptionId,
    filterClients,
    filterTypes,
    filterServices,
    filterClassOS,
    rangeDate,
    setRangeDate,
    profile,
    setBusinessAreaId,
    sellerId,
    setSalesRankingType,
    setTaskSummaryType,
    setFilterTypes,
    setFilterClients,
    setFilterServices,
    setFilterClassOS,
  } = props

  const handleChangeRangeDate = (value, type) => {
    let startDate = type === 'start' ? value : rangeDate[0]
    let endDate = type === 'end' ? value : rangeDate[1]
    if (type === 'start' && startDate > endDate) {
      endDate = startDate
    } else if (type === 'end' && endDate < startDate) {
      startDate = endDate
    }
    setRangeDate([startDate, endDate])
  }

  // const handleChangeViewOption = value => {
  //   setViewOptionId(value)
  //   handleConfigureType(value, sellerId)
  // }

  // const handleChangeSeller = value => {
  //   handleConfigureType(viewOptionId, value)
  // }

  // const handleChangeBusinessArea = value => {
  //   setBusinessAreaId(value)
  //   handleConfigureType(viewOptionId, sellerId)
  // }

    // Create debounced filter setters
    const debouncedSetFilterTypes = useCallback(
      debounce((value) => {
        setFilterTypes(value)
      }, 500),
      []
    )

    const debouncedSetFilterClients = useCallback(
      debounce((value) => {
        setFilterClients(value)
      }, 500),
      []
    )

    const debouncedSetFilterServices = useCallback(
      debounce((value) => {
        setFilterServices(value)
      }, 500),
      []
    )

    const debouncedSetFilterClassOS = useCallback(
      debounce((value) => {
        setFilterClassOS(value)
      }, 500),
      []
    )

  const handleConfigureType = (option, seller) => {
    const type =
      profile?.ownerProfile === 'Standard' ||
      profile?.ownerProfile === 'Franchise' ||
      (profile?.ownerProfile === 'Franchisor' && option === 3)
        ? 'seller'
        : 'franchisee'

    const salesRankingType = seller ? 'businessArea' : type
    setSalesRankingType(salesRankingType)
    setTaskSummaryType(type)
  }

  const moveDate = step => {
    const startDate = rangeDate[0]
    const endDate = rangeDate[1]
    startDate.add(step, 'month')
    endDate.add(step, 'month')
    setRangeDate([startDate, endDate])
  }

  return (
    <div className="mb-2">
      <Card bodyStyle={{ paddingLeft: '20px' }} size="small">
        <Row type="flex" gutter={24} align="middle">
          <Col>
            <h4>Tipo de ordem de serviço</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '100%' }}
              onChange={debouncedSetFilterTypes}
            >
              {filterTypes?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
            {/* <Input /> */}
          </Col>
          <Col>
            <Row>
              <Col>
                <h4>Período</h4>
              </Col>
            </Row>
            <Row type="flex" gutter={12}>
              <Col>
                <Select value="dtCriacao">
                  <Option key="1" value="dtCriacao">
                    Data de criação
                  </Option>
                </Select>
              </Col>
              <Col>
                <RangePicker
                  picker="month"
                  allowClear={false}
                  format="DD/MM/YYYY"
                  onChange={handleChangeRangeDate}
                  value={rangeDate}
                />
              </Col>
            </Row>
          </Col>
          <Col
            style={{
              //   width: '280px',
              display: profile?.ownerProfile === 'Standard' ? 'block' : 'none',
            }}
          >
            <h4>Colaboradores</h4>
            <Input />
          </Col>
          <Col>
            <h4>Cliente</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={debouncedSetFilterClients}
            >
              {filterClients?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <h4>Serviço</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={debouncedSetFilterServices}
            >
              {filterServices?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <h4>Classificação OS</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={debouncedSetFilterClassOS}
            >
              {filterClassOS?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <h4>Ordem de serviço</h4>
            <Input />
          </Col>
        </Row>
      </Card>
    </div>
  )
}

DashboardHeader.propTypes = {
  viewOptionId: PropTypes.number,
  setViewOptionId: PropTypes.func,
  rangeDate: PropTypes.array,
  setRangeDate: PropTypes.func,
  profile: PropTypes.any,
  sellerId: PropTypes.number,
  setBusinessAreaId: PropTypes.func,
  setSalesRankingType: PropTypes.func,
  setTaskSummaryType: PropTypes.func,
}
