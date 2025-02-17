import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spin, Tooltip } from 'antd'
import { apiServices } from '@services/api'
import { addBrlCurrencyToNumber, formatNumber } from '@utils'
import PropTypes from 'prop-types'
// import { use } from 'react'

export default function ServiceOrderStateCard({
  type,
  loading,
  openServiceOrderDetail,
  qtOSCriadas,
  qtOSLiquidadas, 
  qtOSAguardando, 
  qtOSCanceladas,
}) {

  // const [qtOSCriadas, setQtOSCriadas] = useState(0)
  // const [qtOSLiquidadas, setQtOSLiquidadas] = useState(0)
  // const [qtOSAguardando, setQtOSAguardando] = useState(0)
  // const [qtOSCanceladas, setQtOSCanceladas] = useState(0)
  const [totalHorasApontadas, setTotalHorasApontadas] = useState(0)

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await apiServices.get('/api/TotalHorasApontadas')
  //       setQtOSCriadas(response.data.osCriadas)
  //       setQtOSLiquidadas(response.data.osLiquidadas)
  //       setQtOSAguardando(qtOSCriadas-qtOSLiquidadas)
  //       setQtOSCanceladas(response.data.osCanceladas)
  //     } catch (error) {
  //       console.error('Error fetching data:', error)
  //     }
  //   }
  //   fetchData()
  // }, [])
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
            // type === 1 ?
            // 'Negócios ganhos com data de fechamento conforme período selecionado' :
            // type === 2 ?
            // 'Negócios perdidos com data de fechamento conforme período selecionado' :
            // 'Negócios criados com data de criação conforme período selecionado'
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
          {/* {formatNumber(proposalState?.quantity || 0, 0)} */}
          {/* {formatNumber((type%2 === 0) ? 0 : 2)} */}
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
        {/* <Row type="flex" gutter={36}>
          <Col span={12}>
            <span style={{ color: 'gray' }}>
              <i>Valor único</i>
            </span>
            <br />
            <span>
              {addBrlCurrencyToNumber(proposalState?.uniqueValue || 0)}
            </span>
          </Col>
          <Col span={12}>
            <span style={{ color: 'gray' }}>
              <i>Valor recorrente</i>
            </span>
            <br />
            <span>
              {addBrlCurrencyToNumber(proposalState?.recurrenceValue || 0)}
            </span>
          </Col>
        </Row> */}
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
