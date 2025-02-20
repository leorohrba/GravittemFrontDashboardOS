import React from 'react'
import DefaultTable from '@components/DefaultTable'
import { Card, Spin, Tooltip, Row, Col } from 'antd'
import PropTypes from 'prop-types'

export default function AtendimentoRankingCard({
  setType,
  loading,
  data,
  serviceData,
  openProposalDetail,
  profile,
  openServiceOrderDetail,
  type
}) {
  const columns = [
    {
      title: type === 'service' ? 'Serviço' : 'Colaborador', // Dynamic title
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Horas atendimento',
      dataIndex: 'hours',
      key: 'hours',
      sorter: (a, b) => a.hours - b.hours,
      render: (text, d) => (
        <React.Fragment>
          <span>{d.hours}</span>
        </React.Fragment>
      ),
    },
    {
      title: 'Ordens de serviço',
      dataIndex: 'orders',
      key: 'orders',
      sorter: (a, b) => a.orders - b.orders,
      render: (text, d) => (
        <React.Fragment>
          <span>{d.orders}</span>
        </React.Fragment>
      ),
    },
  ]

  const handleRowClick = (record) => {
    openServiceOrderDetail('atendimentoRanking', record.id)
  }

  return (
    <Spin spinning={loading}>
      <Card
        title={
          <Row type="flex" gutter={12}>
            <Col>
              <Tooltip title="Ranking de vendas dos negócios com data de fechamento conforme período selecionado">
                Ranking de atendimento
              </Tooltip>
            </Col>
            <Col className="ml-auto">
              <Tooltip title="Visualizar ranking de atendimento por colaborador">
                <i
                  className="cursor-pointer fa fa-user-circle"
                  role="button"
                  style={{ color: '#3182ce' }}
                  onClick={() => setType('seller')}
                />
              </Tooltip>
            </Col>
            <Col
              style={{
                display:
                  profile?.ownerProfile === 'Standard' ? 'none' : 'block',
              }}
            >
              <Tooltip title="Visualizar ranking de atendimento por colaborador">
                <i
                  className="cursor-pointer fa fa-building-o"
                  role="button"
                  style={{ color: '#3182ce' }}
                  onClick={() => setType('franchisee')}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title="Visualizar ranking de atendimento por serviço">
                <i
                  className="cursor-pointer fa fa-briefcase"
                  role="button"
                  style={{ color: '#3182ce' }}
                  onClick={() => setType('service')}
                />
              </Tooltip>
            </Col>
          </Row>
        }
      >
        <DefaultTable
          size="small"
          rowKey={record => record.id}
          columns={columns}
          dataSource={type === 'service' ? serviceData : data}
          pagination={false}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </Card>
    </Spin>
  )
}

AtendimentoRankingCard.propTypes = {
  setType: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array,
  openProposalDetail: PropTypes.func,
  profile: PropTypes.any,
  openServiceOrderDetail: PropTypes.func,
  type: PropTypes.string // Add this prop type
}
