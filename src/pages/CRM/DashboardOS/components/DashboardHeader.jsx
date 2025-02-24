import React, { useEffect } from 'react'
import { DatePicker, Input, Select, Card, Row, Col } from 'antd'

const { Option } = Select
const { RangePicker } = DatePicker

export default function DashboardHeader(props) {
  const {
    filterClients,
    filterTypes,
    filterServices,
    filterClassOS,
    rangeDate,
    setRangeDate,
    setFilterParams, // Add this
    filterParams, // Add this
    selectedPeriod,
    setSelectedPeriod,
    fetchData
  } = props

  useEffect(() => {
    // if (filterTypes?.length > 0) {
    //   const allTypeIds = filterTypes.map(type => type.value)
    //   setFilterParams(prev => ({
    //     ...prev,
    //     tipoOSId: allTypeIds
    //   }))
    // }
    fetchData()
  }, [rangeDate, selectedPeriod, filterParams])

  // useEffect(() => {

  // }, [filterTypes])

  // Update the handlers to use setFilterParams
  const handleSetFilterTypes = (value) => {
    setFilterParams(prev => ({
      ...prev,
      tipoOSId: value
    }))
  }

  const handleSetFilterClients = (value) => {
    setFilterParams(prev => ({
      ...prev,
      pessoaId: value
    }))
  }

  const handleSetFilterServices = (value) => {
    setFilterParams(prev => ({
      ...prev,
      servicoId: value
    }))
  }

  const handleSetFilterClassOS = (value) => {
    setFilterParams(prev => ({
      ...prev,
      classificacaoOsId: value
    }))
  }

  const handleServiceOrderIdChange = (e) => {
    setFilterParams(prev => ({
      ...prev,
      serviceOrderId: e.target.value
    }))
  }

  // Update period change handler
  const handlePeriodChange = (value) => {
    setSelectedPeriod(value)
    setFilterParams(prev => ({
      ...prev,
      selectedPeriod: value
    }))
  }

  const handleRangeDateChange = (dates) => {
    setRangeDate(dates)
    setFilterParams(prev => ({
      ...prev,
      rangeDate: dates
    }))
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
              onChange={handleSetFilterTypes}
              value={filterParams?.tipoOSId || []}
            >
              {filterTypes?.map(client => (
                <Option key={client.value} value={client.value}>
                  {client.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Row>
              <Col>
                <h4>Período</h4>
              </Col>
            </Row>
            <Row type="flex" gutter={12}>
              <Col>
                <Select
                  style={{ width: '100%' }}
                  defaultValue="PeriodoCriacaoOs"
                  onChange={handlePeriodChange}
                >
                  <Option key="1" value="PeriodoCriacaoOs">
                    Data de criação
                  </Option>
                  <Option key="2" value="periodoApontamento">
                    Data de apontamento
                  </Option>
                  <Option key="3" value="PeriodoLiquidaOs">
                    Data de liquidação
                  </Option>
                  <Option key="4" value="PeriodoCancelaOs">
                    Data de cancelamento
                  </Option>
                </Select>
              </Col>
              <Col>
                <RangePicker
                  allowClear={false}
                  format="DD/MM/YYYY"
                  onChange={value => handleRangeDateChange(value)}
                  value={rangeDate}
                />
              </Col>
            </Row>
          </Col>
          <Col>
            <h4>Cliente</h4>
            <Select
              mode="multiple"
              placeholder="Selecione os tipos"
              style={{ width: '30vh' }}
              onChange={handleSetFilterClients}
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
              onChange={handleSetFilterServices}
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
              onChange={handleSetFilterClassOS}
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
            <Input onChange={handleServiceOrderIdChange} />
          </Col>
        </Row>
      </Card>
    </div>
  )
}
