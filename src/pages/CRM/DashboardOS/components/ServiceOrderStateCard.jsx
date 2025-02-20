import React from 'react'
import { Card, Spin, Tooltip } from 'antd'
import { formatNumber } from '@utils'
import PropTypes from 'prop-types'

export default function ServiceOrderStateCard({
  type,
  loading,
  openServiceOrderDetail,
  qtOSCriadas,
  qtOSLiquidadas,
  qtOSAguardando,
  qtOSCanceladas,
}) {

  return (
    <Spin spinning={loading}>
      <Card>
        <Tooltip
          title={
            type === 1
              ? 'Ordens de serviço criadas'
              : type === 2
              ? 'Ordens de serviço liquidadas'
              : type === 3
              ? 'Ordens de serviço aguardando liquidação'
              : type === 4
              ? 'Ordens de serviço canceladas'
              : ''
            }
        >
          <h4>
            {type === 1
              ? 'Ordens de serviço criadas'
              : type === 2
              ? 'Ordens de serviço liquidadas'
              : type === 3
              ? 'Ordens de serviço aguardando liquidação'
              : type === 4
              ? 'Ordens de serviço canceladas'
              : ''}
          </h4>
        </Tooltip>
        <span
          style={{ fontSize: '300%', color: (type === 3) || (type === 4) ? 'red' : '#4caf50' }}
          className="mt-2 mb-2 cursor-pointer"
          role="button"
          onClick={() => openServiceOrderDetail('serviceOrderState', type)}
        >
          {type === 1
              ? formatNumber(qtOSCriadas)
              : type === 2
              ? formatNumber(qtOSLiquidadas)
              : type === 3
              ? formatNumber(qtOSAguardando)
              : type === 4
              ? formatNumber(qtOSCanceladas)
              : ''}
        </span>
      </Card>
    </Spin>
  )
}

ServiceOrderStateCard.propTypes = {
  type: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  openServiceOrderDetail: PropTypes.func.isRequired,
  qtOSCriadas: PropTypes.number.isRequired,
  qtOSLiquidadas: PropTypes.number.isRequired,
  qtOSAguardando: PropTypes.number.isRequired,
  qtOSCanceladas: PropTypes.number.isRequired,
}
