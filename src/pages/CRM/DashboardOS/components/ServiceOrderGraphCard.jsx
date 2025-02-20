import React, { useState, useEffect } from 'react'
import { Card, Spin, Row, Col, Tooltip as TooltipAntd } from 'antd'
import { Chart, Geom, Axis, Tooltip, Coord, Guide } from 'bizcharts'
import { formatNumber, addBrlCurrencyToNumber } from '@utils'
import PropTypes from 'prop-types'

const { Html } = Guide

const chartTop = 10
const chartRight = 10
const chartBottom = 10
const chartLeft = 10
const scale = {
  percent: {
    min: 0,
    formatter: val => `${formatNumber(val * 100, 2)}%`,
  },
}

function ServiceOrderGraphCard(props) {
  const {
    title,
    type,
    data,
    chartHeight,
    loading,
    openProposalDetail,
  } = props

  const [chartData, setChartData] = useState([])
  const [totalQuantity, setTotalQuantity] = useState(0)

  useEffect(() => {
    const dataSource = []
    let total = 0

    if (type === 1) {
      data.forEach(r => {
        dataSource.push({
          id: r.tipoOSId,
          description: r.descricao,
          color: r.cor,
          quantity: r.qtTipoOS,
          percent: r.percentual.toFixed(2) * 0.01
        })
        total += r.qtTipoOS
      })
    } else if (type === 2) {
      data.forEach(r => {
        dataSource.push({
          id: r.colaboradorId,
          description: r.pessoa,
          color: r.cor,
          quantity: r.qtOs,
          percent: r.percentual.toFixed(2) * 0.01
        })
        total += r.qtOs
      })
    }

    setTotalQuantity(total)
    setChartData(dataSource)
  }, [data, type])

  const getColor = color => {
    return color
  }

  return (
    <Spin spinning={loading} size="large">
      <Card
        size="small"
        title={
          <Row type="flex" className="w-full">
            <TooltipAntd title="Relatório de Ordens de serviço com data de criação conforme período selecionado">
              <h3>{title}</h3>
            </TooltipAntd>
          </Row>
        }
      >
        <Row type="flex" align="middle" justify="center" gutter={12}>
          <Col span={12}>
            <Chart
              height={chartHeight}
              padding={{
                top: chartTop,
                right: chartRight,
                bottom: chartBottom,
                left: chartLeft,
              }}
              forceFit
              data={chartData}
              scale={scale}
            >
              <Coord type="theta" radius={1} innerRadius={0.6} />

              <Axis name="percent" />

              <Tooltip showTitle={false} />

              <Guide>
                <Html
                  position={['50%', '50%']}
                  html={`<div align="center"><span style="font-size: 250%">${totalQuantity}</span><br /><span style="color: gray;">${
                    totalQuantity === 1 ? 'Ordem de serviço' : 'Ordens de serviço'
                  }</span></div>`}
                  alignX="middle"
                  alignY="middle"
                />
              </Guide>

              <Geom
                type="intervalStack"
                position="percent"
                color={['color', getColor]}
                tooltip={[
                  'description*quantity*percent',
                  (description, quantity, percent) => {
                    return {
                      name: description,
                      value: `${formatNumber(quantity, 0)} (${formatNumber(
                        100 * percent,
                        2,
                      )}%)`,
                    }
                  },
                ]}
              />
            </Chart>
          </Col>
          <Col span={12}>
            {chartData.map(d => (
              <Row className="mb-2" type="flex" key={d.id}>
                <Col>
                  <i className="fa fa-circle mr-2" style={{ color: d.color }} />
                </Col>
                <Col style={{ display: d.icon ? 'flex' : 'none' }}>
                  <i
                    className={`mr-2 fa ${d.icon} fa-fw mt-1`}
                    style={{ color: '#3182ce' }}
                  />
                </Col>
                <Col>
                  <TooltipAntd
                    title={
                      <Row>
                        <Col>{d.description}</Col>
                      </Row>
                    }
                  >
                    <span
                      role="button"
                      className="flex cursor-pointer"
                      onClick={() => openProposalDetail(type, d.id)}
                    >
                      <div style={{ maxWidth: '140px' }} className="truncate">
                        {d.description}
                      </div>
                      <span className="ml-1">
                        {`- ${d.quantity} (${formatNumber(
                          d.percent * 100,
                          2,
                        )}%)`}
                      </span>
                    </span>
                  </TooltipAntd>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}

ServiceOrderGraphCard.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  data: PropTypes.array,
  openProposalDetail: PropTypes.func,
  chartHeight: PropTypes.number,
  loading: PropTypes.bool,
}

export default ServiceOrderGraphCard
