import React from 'react'
import DefaultTable from '@components/DefaultTable'
import { Card, Spin, Tooltip } from 'antd'
import PropTypes from 'prop-types'

export default function ServiceOrderRankingCard({
  type,
  setType,
  loading,
  data,
  openServiceOrderDetail,
  profile,
}) {
  const columns =
    type === 1
      ? [
          {
            title: 'Serviço',
            dataIndex: 'descricao',
            key: 'descricao',
          },
          {
            dataIndex: 'qtServico',
            key: 'qtServico',
            width: 80,
            sorter: (a, b) => a.qtServico - b.qtServico,
            render: (text, record) => (
              <Tooltip title={`${record.percentual.toFixed(2)}%`}>
                <div style={{ textAlign: 'center' }}>{text}</div>
              </Tooltip>
            ),
          },
        ]
      : [
          {
            title: 'Classificação OS',
            dataIndex: 'descricao',
            key: 'descricao',
          },
          {
            dataIndex: 'qtClassificacaoOs',
            key: 'qtClassificacaoOs',
            width: 80,
            sorter: (a, b) => a.qtClassificacaoOs - b.qtClassificacaoOs,
            render: (text, record) => (
              <Tooltip title={`${record.percentual.toFixed(2)}%`}>
                <div style={{ textAlign: 'center' }}>{text}</div>
              </Tooltip>
            ),
          },
        ]

  const handleRowClick = (record) => {
    openServiceOrderDetail(type, record.descricao, 'serviceOrderRanking')
  }

  return (
    <Spin spinning={loading}>
      <Card>
        <DefaultTable
          size="small"
          rowKey={record =>
            type === 1 ? record.servicoId : record.classificacaoOsId
          }
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 210 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
          })}
        />
      </Card>
    </Spin>
  )
}

ServiceOrderRankingCard.propTypes = {
  type: PropTypes.string,
  setType: PropTypes.func,
  loading: PropTypes.bool,
  data: PropTypes.array,
  openServiceOrderDetail: PropTypes.func,
  profile: PropTypes.any,
}