import React from 'react'
import { Card, Row, Col, Select, DatePicker } from 'antd'
import PropTypes from 'prop-types'
import InputSeller from './InputSeller'

const { Option } = Select

export default function DashboardHeader(props) {
  const {
    viewOptionId,
    setViewOptionId,
    viewOptions,
    rangeDate,
    setRangeDate,
    proposalType,
    setProposalType,
    salesFunnelId,
    setSalesFunnelId,
    salesFunnels,
    franchisees,
    franchiseeId,
    setFranchiseeId,
    fetchData,
    profile,
    businessAreaId,
    setBusinessAreaId,
    businessAreas,
    sellerId,
    setSellerId,
    setSalesRankingType,
    setTaskSummaryType,
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

  const handleChangeViewOption = value => {
    setViewOptionId(value)
    handleConfigureType(value, sellerId)
  }

  const handleChangeSeller = value => {
    handleConfigureType(viewOptionId, value)
  }

  const handleChangeBusinessArea = value => {
    setBusinessAreaId(value)
    handleConfigureType(viewOptionId, sellerId)
  }

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
          <Col
            style={{
              width: '195px',
              display: profile?.ownerProfile === 'Standard' ? 'none' : 'block',
            }}
          >
            <Row type="flex">
              <Col>
                <h4>Visão</h4>
              </Col>
              <Col className="ml-auto">
                <i
                  className="cursor-pointer fa fa-repeat fa-lg"
                  aria-hidden="true"
                  style={{ color: 'gray' }}
                  onClick={() => fetchData()}
                />
              </Col>
            </Row>

            <Select
              className="w-full"
              value={viewOptionId}
              onChange={value => handleChangeViewOption(value)}
            >
              {viewOptions.map(d => (
                <Option key={d.id} value={d.id}>
                  {d.name}
                </Option>
              ))}
            </Select>
          </Col>
          <div style={{ display: viewOptionId === 3 ? 'block' : 'none' }}>
            <Col style={{ width: '255px' }}>
              <h4>Franquia</h4>
              <Select
                className="w-full"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                value={franchiseeId}
                onChange={value => setFranchiseeId(value)}
              >
                {franchisees.map(d => (
                  <Option key={d.franchiseeId} value={d.franchiseeId}>
                    {d.shortName}
                  </Option>
                ))}
              </Select>
            </Col>
          </div>
          <Col>
            <Row type="flex">
              <Col>
                <h4>Período</h4>
              </Col>
              <Col
                className={
                  profile?.ownerProfile === 'Standard' ? 'ml-auto' : ''
                }
                style={{
                  display:
                    profile?.ownerProfile === 'Standard' ? 'block' : 'none',
                }}
              >
                <i
                  className="mr-2 cursor-pointer fa fa-repeat fa-lg"
                  aria-hidden="true"
                  style={{ color: 'gray' }}
                  onClick={() => fetchData()}
                />
              </Col>
              <Col
                className={
                  profile?.ownerProfile === 'Standard' ? '' : 'ml-auto'
                }
              >
                <i
                  className="mr-2 fa fa-chevron-circle-left fa-lg cursor-pointer"
                  style={{ color: 'gray' }}
                  role="button"
                  onClick={() => moveDate(-1)}
                />
                <i
                  className="mr-2 fa fa-chevron-circle-right fa-lg cursor-pointer"
                  style={{ color: 'gray' }}
                  role="button"
                  onClick={() => moveDate(1)}
                />
              </Col>
            </Row>
            <Row type="flex" gutter={12}>
              <Col>
                <DatePicker
                  picker="month"
                  allowClear={false}
                  format="MMMM/YYYY"
                  onChange={value => handleChangeRangeDate(value, 'start')}
                  value={rangeDate[0]}
                />
              </Col>
              <Col>
                <DatePicker
                  picker="month"
                  allowClear={false}
                  format="MMMM/YYYY"
                  onChange={value => handleChangeRangeDate(value, 'end')}
                  value={rangeDate[1]}
                />
              </Col>
            </Row>
          </Col>
          <Col style={{ width: '260px' }}>
            <h4>Funil de vendas</h4>
            <Select
              allowClear
              className="w-full"
              value={salesFunnelId}
              onChange={value => setSalesFunnelId(value)}
            >
              {salesFunnels.map(d => (
                <Option key={d.salesFunnelId} value={d.salesFunnelId}>
                  {d.title}
                </Option>
              ))}
            </Select>
          </Col>
          <Col
            style={{
              width: '170px',
              display:
                profile?.ownerProfile !== 'Standard' &&
                profile?.isProposalRateLocation
                  ? 'block'
                  : 'none',
            }}
          >
            <h4>Tipo de proposta</h4>
            <Select
              allowClear
              className="w-full"
              value={proposalType}
              onChange={value => setProposalType(value)}
            >
              <Option value={1}>Venda</Option>
              <Option value={2}>Locação</Option>
            </Select>
          </Col>
          <Col
            style={{
              width: '280px',
              display: profile?.ownerProfile === 'Standard' ? 'block' : 'none',
            }}
          >
            <h4>Vendedor</h4>
            <InputSeller
              sellerId={sellerId}
              setSellerId={setSellerId}
              onChange={handleChangeSeller}
            />
          </Col>
          <Col
            style={{
              width: '200px',
              display: profile?.ownerProfile === 'Standard' ? 'block' : 'none',
            }}
          >
            <h4>Área de negócios</h4>
            <Select
              allowClear
              className="w-full"
              value={businessAreaId}
              onChange={handleChangeBusinessArea}
            >
              {businessAreas.map(d => (
                <Option value={d.id}>{d.descricao}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>
    </div>
  )
}

DashboardHeader.propTypes = {
  viewOptionId: PropTypes.number,
  setViewOptionId: PropTypes.func,
  viewOptions: PropTypes.array,
  rangeDate: PropTypes.array,
  setRangeDate: PropTypes.func,
  proposalType: PropTypes.number,
  setProposalType: PropTypes.func,
  salesFunnelId: PropTypes.number,
  setSalesFunnelId: PropTypes.func,
  salesFunnels: PropTypes.array,
  franchisees: PropTypes.array,
  franchiseeId: PropTypes.number,
  setFranchiseeId: PropTypes.func,
  fetchData: PropTypes.func,
  profile: PropTypes.any,
  sellerId: PropTypes.number,
  setSellerId: PropTypes.func,
  setBusinessAreaId: PropTypes.func,
  businessAreaId: PropTypes.number,
  businessAreas: PropTypes.array,
  setSalesRankingType: PropTypes.func,
  setTaskSummaryType: PropTypes.func,
}
